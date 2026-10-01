from typing import Dict, Any, Optional
from app.schemas.outreach import OutreachBase
from app.services.ai.llm_service import render_prompt, generate_structured_llm

def generate_outreach(
    company_name: str,
    person_data: dict,
    research_data: dict,
    opportunity_data: dict,
    signals_data: Optional[list] = None
) -> OutreachBase:
    """
    Generates contextual, non-generic first-touch outreach email referencing
    verified company facts, opportunity scoring, and active trigger signals.
    """
    prompt = render_prompt("outreach.txt", {
        "company_name": company_name,
        "person_json": person_data,
        "research_json": research_data,
        "opportunity_json": opportunity_data,
        "signals_json": signals_data or []
    })

    outreach = generate_structured_llm(
        prompt=prompt,
        response_schema=OutreachBase,
        temperature=0.2
    )

    # Ensure full body text contains all parts if body was not combined
    if not outreach.body or len(outreach.body) < 15:
        parts = [outreach.opening, outreach.main_message, outreach.call_to_action]
        outreach.body = "\n\n".join([p for p in parts if p])

    return outreach
