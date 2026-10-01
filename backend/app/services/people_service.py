from typing import List, Optional
from pydantic import BaseModel
from app.schemas.person import PersonBase
from app.services.ai.llm_service import render_prompt, generate_structured_llm

class PeopleExtraction(BaseModel):
    people: List[PersonBase]

def identify_people(
    company_name: str,
    research_data: dict,
    opportunity_data: dict
) -> List[PersonBase]:
    """
    Identifies key decision-maker personas and confirmed individuals using
    prompt template and structured LLM.
    Strictly prevents fabrication of fake people names.
    """
    prompt = render_prompt("contact_reasoning.txt", {
        "company_name": company_name,
        "research_json": research_data,
        "opportunity_json": opportunity_data
    })

    extraction = generate_structured_llm(
        prompt=prompt,
        response_schema=PeopleExtraction,
        temperature=0.1
    )

    # Ensure is_persona flag matches name presence
    for p in extraction.people:
        if not p.name:
            p.is_persona = True
        else:
            p.is_persona = False

    return extraction.people
