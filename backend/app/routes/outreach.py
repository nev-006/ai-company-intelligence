from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.company import Company, CompanyResearch, Opportunity, Person, Outreach
from app.schemas.outreach import OutreachResponse
from app.services.outreach_service import generate_outreach

router = APIRouter(
    prefix="/api/outreach",
    tags=["Outreach"]
)

@router.post("/generate/{person_id}", response_model=OutreachResponse)
def create_outreach(person_id: int, db: Session = Depends(get_db)):
    person = db.query(Person).filter(Person.id == person_id).first()
    if not person:
        raise HTTPException(status_code=404, detail="Person not found")
        
    company = db.query(Company).filter(Company.id == person.company_id).first()
    latest_research = db.query(CompanyResearch).filter(CompanyResearch.company_id == company.id).order_by(CompanyResearch.created_at.desc()).first()
    latest_opp = db.query(Opportunity).filter(Opportunity.company_id == company.id).order_by(Opportunity.created_at.desc()).first()
    
    if not latest_research:
        raise HTTPException(status_code=400, detail="Need research data to generate outreach")
        
    person_dict = {
        "name": person.name,
        "job_title": person.job_title,
        "relevance_reason": person.relevance_reason
    }
    
    research_dict = {
        "description": latest_research.description,
        "industry": latest_research.industry,
        "products_services": latest_research.products_services,
    }
    
    opp_dict = {}
    if latest_opp:
        opp_dict = {
            "score": latest_opp.score,
            "recommended_action": latest_opp.recommended_action
        }
        
    try:
        outreach_data = generate_outreach(company.name, person_dict, research_dict, opp_dict)
        
        db_outreach = Outreach(
            company_id=company.id,
            person_id=person.id,
            subject=outreach_data.subject,
            opening=outreach_data.opening,
            body=outreach_data.body,
            evidence_used=outreach_data.evidence_used
        )
        
        db.add(db_outreach)
        db.commit()
        db.refresh(db_outreach)
        
        return db_outreach
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error generating outreach: {str(e)}")
        
@router.get("/company/{company_id}", response_model=List[OutreachResponse])
def get_outreach(company_id: int, db: Session = Depends(get_db)):
    outreaches = db.query(Outreach).filter(Outreach.company_id == company_id).order_by(Outreach.created_at.desc()).all()
    return outreaches
