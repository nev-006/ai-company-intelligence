import time

from google import genai
from google.genai import types
from google.genai.errors import APIError, ServerError

from app.config import GEMINI_API_KEY


# Create Gemini client
client = genai.Client(api_key=GEMINI_API_KEY)


# Models available in your Gemini account
# Put lighter models first so they are more likely to respond
FALLBACK_MODELS = [
    "gemini-3.1-flash-lite",
    "gemini-3.6-flash",
    "gemini-3.7-flash",
    "gemini-3.8-flash",
    "gemini-flash-lite-latest",
    "gemini-flash-latest",
]


def generate_structured_content(
    prompt: str,
    response_schema,
    temperature: float = 0.2
):
    """
    Generate structured JSON using Gemini.

    If a model is temporarily unavailable (503) or rate limited (429),
    retry it and then automatically try the next model.
    """

    last_error = None

    for model_name in FALLBACK_MODELS:

        print(f"\n[Gemini] Trying model: {model_name}")

        # Try each model up to 3 times
        for attempt in range(1, 4):

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

                # Make sure Gemini actually returned something
                if not response.text:
                    raise RuntimeError(
                        f"Gemini returned an empty response from {model_name}"
                    )

                print(
                    f"[Gemini] Success with model: {model_name}"
                )

                return response.text

            except ServerError as e:

                last_error = e

                print(
                    f"[Gemini] {model_name} returned server error "
                    f"(attempt {attempt}/3): {e}"
                )

                # Wait longer after each failure
                wait_time = 2 ** attempt

                if attempt < 3:
                    print(
                        f"[Gemini] Retrying in {wait_time} seconds..."
                    )
                    time.sleep(wait_time)

            except APIError as e:

                last_error = e

                status_code = getattr(e, "code", None)

                print(
                    f"[Gemini] {model_name} API error "
                    f"(HTTP {status_code}): {e}"
                )

                # Retry only temporary errors
                if status_code in [429, 500, 502, 503, 504]:

                    if attempt < 3:
                        wait_time = 2 ** attempt

                        print(
                            f"[Gemini] Temporary error. "
                            f"Retrying in {wait_time} seconds..."
                        )

                        time.sleep(wait_time)

                    continue

                # 400 / 401 / 403 / 404 etc.
                # Don't waste time retrying the same model
                print(
                    f"[Gemini] Non-retryable error. "
                    f"Trying next model..."
                )

                break

            except Exception as e:

                last_error = e

                print(
                    f"[Gemini] Unexpected error with "
                    f"{model_name}: {e}"
                )

                break

        print(
            f"[Gemini] Model {model_name} failed. "
            f"Moving to next model..."
        )

    # All models failed
    raise RuntimeError(
        "All Gemini models failed. "
        f"Last error: {last_error}"
    )