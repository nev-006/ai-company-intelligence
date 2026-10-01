from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.company import Company, CompanyResearch, Signal
from app.schemas.signal import SignalResponse
from app.services.trigger_service import detect_triggers

router = APIRouter(
    prefix="/api/signals",
    tags=["Signals"]
)

@router.post("/company/{company_id}/detect", response_model=List[SignalResponse])
def run_trigger_detection(company_id: int, db: Session = Depends(get_db)):
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
        
    # Get the top 2 most recent research records
    research_history = db.query(CompanyResearch).filter(CompanyResearch.company_id == company_id).order_by(CompanyResearch.created_at.desc()).limit(2).all()
    
    if len(research_history) == 0:
        raise HTTPException(status_code=400, detail="No research found for this company. Please run research first.")
        
    def r_to_dict(r):
        return {
            "description": r.description,
            "industry": r.industry,
            "products_services": r.products_services,
            "target_customers": r.target_customers,
            "business_model": r.business_model,
            "locations": r.locations
        }
        
    try:
        if len(research_history) >= 2:
            new_research = research_history[0]
            old_research = research_history[1]
            signals = detect_triggers(company.name, r_to_dict(old_research), r_to_dict(new_research))
        else:
            new_research = research_history[0]
            signals = detect_triggers(company.name, None, r_to_dict(new_research))
        
        saved_signals = []
        for s in signals:
            existing_sig = db.query(Signal).filter(
                Signal.company_id == company.id,
                Signal.signal_type == s.signal_type,
                Signal.description == s.description
            ).first()
            if not existing_sig:
                db_signal = Signal(
                    company_id=company.id,
                    signal_type=s.signal_type,
                    description=s.description,
                    meaningful=s.meaningful,
                    source=s.source
                )
                db.add(db_signal)
                saved_signals.append(db_signal)
            else:
                saved_signals.append(existing_sig)
            
        db.commit()
        for s in saved_signals:
            db.refresh(s)
            
        return saved_signals
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error detecting triggers: {str(e)}")

@router.get("/company/{company_id}", response_model=List[SignalResponse])
def get_company_signals(company_id: int, db: Session = Depends(get_db)):
    signals = db.query(Signal).filter(Signal.company_id == company_id).order_by(Signal.created_at.desc()).all()
    return signals

@router.get("/", response_model=List[SignalResponse])
def get_all_signals(db: Session = Depends(get_db)):
    signals = db.query(Signal).order_by(Signal.created_at.desc()).all()
    return signals
