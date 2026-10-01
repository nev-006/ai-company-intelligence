from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.company import Company, CompanyResearch, Opportunity
from app.schemas.opportunity import OpportunityResponse
from app.services.opportunity_service import generate_opportunity_score

router = APIRouter(
    prefix="/api/opportunities",
    tags=["Opportunities"]
)

@router.post("/company/{company_id}/score", response_model=OpportunityResponse)
def score_opportunity(company_id: int, db: Session = Depends(get_db)):
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
        
    latest_research = db.query(CompanyResearch).filter(CompanyResearch.company_id == company_id).order_by(CompanyResearch.created_at.desc()).first()
    if not latest_research:
        raise HTTPException(status_code=400, detail="No research found for this company. Run research first.")
        
    # Convert research to dict for the prompt
    research_dict = {
        "description": latest_research.description,
        "industry": latest_research.industry,
        "products_services": latest_research.products_services,
        "target_customers": latest_research.target_customers,
        "business_model": latest_research.business_model,
        "company_size": latest_research.company_size,
        "locations": latest_research.locations,
        "sources": latest_research.sources
    }
    
    try:
        score_data = generate_opportunity_score(company.name, research_dict)
        
        score_factors_dict = score_data.score_factors.model_dump() if hasattr(score_data.score_factors, "model_dump") else score_data.score_factors
        db_opp = Opportunity(
            company_id=company.id,
            score=score_data.score,
            score_factors=score_factors_dict,
            evidence=score_data.evidence,
            reasoning=score_data.reasoning,
            confidence=score_data.confidence,
            recommended_action=score_data.recommended_action
        )
        
        db.add(db_opp)
        db.commit()
        db.refresh(db_opp)
        
        return db_opp
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error scoring opportunity: {str(e)}")

@router.get("/", response_model=List[OpportunityResponse])
def get_opportunities(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    # Returns all opportunities, sorted by highest score
    opps = db.query(Opportunity).order_by(Opportunity.score.desc()).offset(skip).limit(limit).all()
    return opps

@router.get("/company/{company_id}", response_model=List[OpportunityResponse])
def get_company_opportunities(company_id: int, db: Session = Depends(get_db)):
    opps = db.query(Opportunity).filter(Opportunity.company_id == company_id).order_by(Opportunity.created_at.desc()).all()
    return opps
