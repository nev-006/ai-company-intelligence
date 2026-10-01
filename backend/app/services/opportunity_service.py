import json
from typing import Dict, Any, List, Optional
from app.schemas.opportunity import OpportunityBase, ScoreFactors
from app.services.ai.llm_service import render_prompt, generate_structured_llm

def generate_opportunity_score(
    company_name: str,
    research_data: dict,
    signals: Optional[List[dict]] = None
) -> OpportunityBase:
    """
    Generates explainable multi-factor opportunity score using prompt template and structured LLM.
    Evaluates company fit, growth signal, hiring signal, technology signal, recent activity,
    trigger strength, and decision maker availability.
    """
    prompt = render_prompt("opportunity_scoring.txt", {
        "company_name": company_name,
        "research_json": research_data,
        "signals_json": signals or []
    })

    opp = generate_structured_llm(
        prompt=prompt,
        response_schema=OpportunityBase,
        temperature=0.1
    )

    # Ensure priority is assigned cleanly
    if not opp.priority:
        if opp.score >= 75:
            opp.priority = "High"
        elif opp.score >= 50:
            opp.priority = "Medium"
        else:
            opp.priority = "Low"

    # Ensure legacy factors are synced
    if hasattr(opp.score_factors, "company_fit") and not hasattr(opp.score_factors, "business_fit"):
        opp.score_factors.business_fit = opp.score_factors.company_fit
    if hasattr(opp.score_factors, "technology_signal") and not hasattr(opp.score_factors, "technology_relevance"):
        opp.score_factors.technology_relevance = opp.score_factors.technology_signal

    return opp
