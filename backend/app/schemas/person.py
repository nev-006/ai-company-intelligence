from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class PersonBase(BaseModel):
    name: Optional[str] = None
    job_title: str
    is_persona: Optional[bool] = True
    linkedin_url: Optional[str] = None
    relevance_reason: str
    approach_now_reason: Optional[str] = None
    source: str
    confidence: str = "High" # High, Medium, Low

class PersonResponse(PersonBase):
    id: int
    company_id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True
