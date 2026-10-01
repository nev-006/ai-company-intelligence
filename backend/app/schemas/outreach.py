from pydantic import BaseModel, Field
from typing import Dict, Any, Optional, List
from datetime import datetime

class OutreachBase(BaseModel):
    subject: str
    opening: str
    body: str
    main_message: Optional[str] = None
    call_to_action: Optional[str] = None
    personalization_reasons: Optional[List[str]] = Field(default_factory=list)
    evidence_used: List[str] = Field(default_factory=list)

class OutreachResponse(OutreachBase):
    id: int
    company_id: int
    person_id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True
