import os
import re
import json
import time
from typing import Type, TypeVar, Optional, Dict, Any
from pydantic import BaseModel
from google import genai
from google.genai import types
from google.genai.errors import APIError, ServerError
from app.config import GEMINI_API_KEY

T = TypeVar("T", bound=BaseModel)

# Gemini Client
client = genai.Client(api_key=GEMINI_API_KEY)

# Configurable default model from .env with intelligent fallbacks
CONFIGURED_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

FALLBACK_MODELS = [
    CONFIGURED_MODEL,
    "gemini-2.5-flash",
    "gemini-3.1-flash-lite",
    "gemini-3.6-flash",
    "gemini-3.8-flash",
    "gemini-flash-latest"
]
# Remove duplicates while preserving priority order
FALLBACK_MODELS = list(dict.fromkeys(FALLBACK_MODELS))

PROMPTS_DIR = os.path.join(os.path.dirname(__file__), "prompts")

def load_prompt_template(template_name: str) -> str:
    """Loads a prompt template from the prompts directory."""
    if not template_name.endswith(".txt"):
        template_name = f"{template_name}.txt"
    path = os.path.join(PROMPTS_DIR, template_name)
    if not os.path.exists(path):
        raise FileNotFoundError(f"Prompt template {template_name} not found at {path}")
    with open(path, "r", encoding="utf-8") as f:
        return f.read()

def render_prompt(template_name: str, variables: Dict[str, Any]) -> str:
    """Renders a prompt template replacing {{var}} tags with values."""
    template = load_prompt_template(template_name)
    for key, value in variables.items():
        placeholder = f"{{{{{key}}}}}"
        str_val = json.dumps(value, indent=2) if isinstance(value, (dict, list)) else str(value)
        template = template.replace(placeholder, str_val)
    return template

def repair_json_string(raw: str) -> str:
    """Repairs common LLM JSON syntax issues safely."""
    cleaned = raw.strip()
    # Strip markdown backticks
    if cleaned.startswith("```json"):
        cleaned = cleaned[7:]
    elif cleaned.startswith("```"):
        cleaned = cleaned[3:]
    if cleaned.endswith("```"):
        cleaned = cleaned[:-3]
    cleaned = cleaned.strip()

    # Fix trailing commas before closing braces/brackets
    cleaned = re.sub(r",\s*([\]}])", r"\1", cleaned)

    return cleaned

def generate_structured_llm(
    prompt: str,
    response_schema: Type[T],
    temperature: float = 0.1,
    max_retries: int = 3
) -> T:
    """
    Robust LLM call that returns a validated Pydantic model instance.
    Includes model fallbacks, exponential backoff, JSON sanitization, and Pydantic validation.
    """
    last_exception = None

    for model_name in FALLBACK_MODELS:
        for attempt in range(1, max_retries + 1):
            try:
                response = client.models.generate_content(
                    model=model_name,
                    contents=prompt,
                    config=types.GenerateContentConfig(
                        temperature=temperature,
                        response_mime_type="application/json",
                        response_schema=response_schema,
                    ),
                )

                if not response.text:
                    raise ValueError(f"Empty response text received from {model_name}")

                raw_text = repair_json_string(response.text)

                # Validate and parse into Pydantic model
                parsed = response_schema.model_validate_json(raw_text)
                return parsed

            except (ServerError, APIError) as e:
                last_exception = e
                status_code = getattr(e, "code", None)
                if status_code in [429, 500, 502, 503, 504] or isinstance(e, ServerError):
                    wait = 2 ** attempt
                    time.sleep(wait)
                    continue
                else:
                    # Non-transient API error (400, 401, 403), switch model immediately
                    break

            except Exception as e:
                last_exception = e
                # Attempt manual JSON repair if schema validation failed
                try:
                    raw_data = json.loads(repair_json_string(response.text if 'response' in locals() and response.text else "{}"))
                    return response_schema.model_validate(raw_data)
                except Exception:
                    wait = 1.5 * attempt
                    time.sleep(wait)

    raise RuntimeError(f"All LLM models failed to generate valid structured output. Last error: {last_exception}")
