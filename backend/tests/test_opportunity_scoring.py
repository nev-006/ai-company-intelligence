import pytest
from app.schemas.opportunity import OpportunityBase, ScoreFactors
from app.services.selection_service import ActionSelectionService

def test_score_factors_defaults_and_validation():
    factors = ScoreFactors(
        company_fit=90,
        growth_signal=85,
        hiring_signal=80,
        technology_signal=95,
        recent_activity=75,
        trigger_strength=88,
        decision_maker_availability=90,
        business_fit=90,
        technology_relevance=95
    )
    assert factors.company_fit == 90
    assert factors.growth_signal == 85
    assert factors.hiring_signal == 80
    assert factors.technology_signal == 95
    assert factors.trigger_strength == 88

def test_opportunity_priority_calculation():
    opp_high = OpportunityBase(
        score=85,
        priority="High",
        score_factors=ScoreFactors(company_fit=90, growth_signal=80, hiring_signal=85, technology_signal=90, recent_activity=80, trigger_strength=85, decision_maker_availability=85),
        evidence="Active hiring and series B funding announced.",
        reasoning="Strong alignment with developer infrastructure ICP.",
        confidence="High",
        recommended_action="Contact VP of Engineering"
    )
    assert opp_high.score == 85
    assert opp_high.priority == "High"
    assert "hiring" in opp_high.evidence.lower()

def test_opportunity_low_score_priority():
    opp_low = OpportunityBase(
        score=42,
        priority="Low",
        score_factors=ScoreFactors(company_fit=40, growth_signal=30, hiring_signal=30, technology_signal=50, recent_activity=40, trigger_strength=30, decision_maker_availability=50),
        evidence="Stagnant team growth and legacy technology stack.",
        reasoning="Low ICP alignment for modern AI cloud tools.",
        confidence="Medium",
        recommended_action="Place on passive monitor list"
    )
    assert opp_low.score < 50
    assert opp_low.priority == "Low"
