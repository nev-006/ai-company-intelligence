from typing import List, Optional
from pydantic import BaseModel
from app.schemas.signal import SignalBase
from app.services.ai.llm_service import render_prompt, generate_structured_llm

class SignalsExtraction(BaseModel):
    signals: List[SignalBase]

def detect_triggers(
    company_name: str,
    old_research: Optional[dict] = None,
    new_research: Optional[dict] = None
) -> List[SignalBase]:
    """
    Detects temporal changes across company research snapshots.
    Critically separates meaningful operational signals from marketing noise.
    """
    prompt = render_prompt("trigger_detection.txt", {
        "company_name": company_name,
        "old_research_json": old_research or "No previous snapshot available (initial ingestion baseline)",
        "new_research_json": new_research or {}
    })

    extraction = generate_structured_llm(
        prompt=prompt,
        response_schema=SignalsExtraction,
        temperature=0.1
    )

    for s in extraction.signals:
        is_meaningful = "meaningful" in s.meaningful.lower() or s.is_meaningful is True
        s.is_meaningful = is_meaningful
        if not s.worth_acting_on:
            s.worth_acting_on = is_meaningful

    return extraction.signals
