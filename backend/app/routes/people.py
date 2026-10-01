from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.company import Company, CompanyResearch, Opportunity, Person
from app.schemas.person import PersonResponse
from app.services.people_service import identify_people

router = APIRouter(
    prefix="/api/companies",
    tags=["People"]
)

@router.post("/{company_id}/people", response_model=List[PersonResponse])
def generate_people(company_id: int, db: Session = Depends(get_db)):
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
        
    latest_research = db.query(CompanyResearch).filter(CompanyResearch.company_id == company_id).order_by(CompanyResearch.created_at.desc()).first()
    if not latest_research:
        raise HTTPException(status_code=400, detail="No research found for this company. Please run research first.")
        
    latest_opportunity = db.query(Opportunity).filter(Opportunity.company_id == company_id).order_by(Opportunity.created_at.desc()).first()
    
    research_dict = {
        "description": latest_research.description,
        "industry": latest_research.industry,
        "products_services": latest_research.products_services,
    }
    
    opp_dict = {}
    if latest_opportunity:
        opp_dict = {
            "score": latest_opportunity.score,
            "recommended_action": latest_opportunity.recommended_action
        }
        
    try:
        people_list = identify_people(company.name, research_dict, opp_dict)
        
        saved_people = []
        for p in people_list:
            db_person = Person(
                company_id=company.id,
                name=p.name,
                job_title=p.job_title,
                relevance_reason=p.relevance_reason,
                source=p.source,
                confidence=p.confidence
            )
            db.add(db_person)
            saved_people.append(db_person)
            
        db.commit()
        for sp in saved_people:
            db.refresh(sp)
            
        return saved_people
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error identifying people: {str(e)}")

@router.get("/{company_id}/people", response_model=List[PersonResponse])
def get_people(company_id: int, db: Session = Depends(get_db)):
    people = db.query(Person).filter(Person.company_id == company_id).all()
    return people
