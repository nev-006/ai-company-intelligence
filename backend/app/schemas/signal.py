from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class SignalBase(BaseModel):
    signal_type: str
    description: str
    meaningful: str # Meaningful Signal or Noise
    is_meaningful: Optional[bool] = True
    worth_acting_on: Optional[bool] = True
    recommended_action: Optional[str] = None
    source: str

class SignalResponse(SignalBase):
    id: int
    company_id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True
