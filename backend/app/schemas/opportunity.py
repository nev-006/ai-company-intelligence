from pydantic import BaseModel, Field
from typing import Dict, Any, Optional, List
from datetime import datetime

class ScoreFactors(BaseModel):
    company_fit: int = 80
    growth_signal: int = 70
    hiring_signal: int = 75
    technology_signal: int = 80
    recent_activity: int = 70
    trigger_strength: int = 75
    decision_maker_availability: int = 85
    # Backward compatibility with existing callers
    business_fit: int = 80
    technology_relevance: int = 75

class OpportunityBase(BaseModel):
    score: int # 0-100
    priority: Optional[str] = "Medium" # High, Medium, Low
    score_factors: ScoreFactors
    reasons: Optional[List[str]] = Field(default_factory=list)
    positive_signals: Optional[List[str]] = Field(default_factory=list)
    negative_signals: Optional[List[str]] = Field(default_factory=list)
    evidence: str
    reasoning: str
    confidence: str # High, Medium, Low
    recommended_action: str

class OpportunityResponse(OpportunityBase):
    id: int
    company_id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True
