from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

class CompanyBase(BaseModel):
    name: str
    website: str

class CompanyCreate(CompanyBase):
    pass

class CompanyResponse(CompanyBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class DataConflictItem(BaseModel):
    field: Optional[str] = None
    source_a: Optional[str] = None
    source_b: Optional[str] = None
    chosen_value: Optional[str] = None
    resolution_reasoning: Optional[str] = None
    uncertainty_level: Optional[str] = "Medium"
    display_status: Optional[str] = "Conflicting" # Verified, Inferred, Unknown, Conflicting

class CompanyResearchBase(BaseModel):
    description: Optional[str] = None
    industry: Optional[str] = None
    products_services: Optional[List[str]] = Field(default_factory=list)
    target_customers: Optional[List[str]] = Field(default_factory=list)
    business_model: Optional[str] = None
    company_size: Optional[str] = None
    locations: Optional[List[str]] = Field(default_factory=list)
    sources: Optional[List[str]] = Field(default_factory=list)
    confidence_score: Optional[str] = "High" # High, Medium, Low
    data_conflicts: Optional[List[DataConflictItem]] = Field(default_factory=list)
    uncertainty_notes: Optional[str] = None
    hiring_signals: Optional[List[str]] = Field(default_factory=list)
    growth_signals: Optional[List[str]] = Field(default_factory=list)
    technology_signals: Optional[List[str]] = Field(default_factory=list)
    recent_events: Optional[List[str]] = Field(default_factory=list)
    potential_opportunities: Optional[List[str]] = Field(default_factory=list)
    key_risks: Optional[List[str]] = Field(default_factory=list)

class CompanyResearchResponse(CompanyResearchBase):
    id: int
    company_id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class ResearchSnapshotResponse(BaseModel):
    id: int
    company_id: int
    snapshot_data: Dict[str, Any]
    change_summary: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class SourceResponse(BaseModel):
    id: int
    company_id: int
    url: str
    source_name: Optional[str] = None
    source_type: Optional[str] = "Website"
    reliability_tier: Optional[str] = "High"
    retrieved_at: Optional[datetime] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
