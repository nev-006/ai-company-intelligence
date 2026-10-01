from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timezone
from urllib.parse import urlparse

from app.database import get_db
from app.models.company import Company, CompanyResearch, Opportunity, Person, Outreach, Signal, ResearchSnapshot, Source
from app.schemas.company import (
    CompanyCreate, CompanyResponse, CompanyResearchResponse,
    ResearchSnapshotResponse, SourceResponse
)
from app.schemas.opportunity import OpportunityResponse
from app.schemas.person import PersonResponse
from app.schemas.outreach import OutreachResponse
from app.schemas.signal import SignalResponse

from app.services.research.research_service import ResearchService
from app.services.opportunity_service import generate_opportunity_score
from app.services.people_service import identify_people
from app.services.outreach_service import generate_outreach
from app.services.trigger_service import detect_triggers

router = APIRouter(
    prefix="/api/companies",
    tags=["Companies"]
)

def normalize_url(url: str) -> str:
    if not url:
        return ""
    clean = url.strip().lower()
    for prefix in ["https://", "http://", "www."]:
        if clean.startswith(prefix):
            clean = clean[len(prefix):]
    return clean.rstrip("/")

def derive_company_name_from_url(url: str) -> str:
    cleaned = normalize_url(url)
    domain_part = cleaned.split("/")[0].split("?")[0]
    core = domain_part.split(".")[0]
    return core.capitalize() if core else "Target Company"

def find_existing_company(db: Session, name: str, website: str) -> Optional[Company]:
    norm_web = normalize_url(website)
    norm_name = name.strip().lower() if name else ""
    companies = db.query(Company).order_by(Company.id.desc()).all()
    for c in companies:
        c_web = normalize_url(c.website)
        c_name = c.name.strip().lower() if c.name else ""
        if (norm_web and c_web == norm_web) or (norm_name and c_name == norm_name):
            return c
    return None

# ==============================================================================
# CRUD & Ingestion Endpoints
# ==============================================================================

@router.post("/", response_model=CompanyResponse)
def create_company(company: CompanyCreate, db: Session = Depends(get_db)):
    try:
        existing = find_existing_company(db, company.name, company.website)
        if existing:
            return existing
        db_company = Company(
            name=company.name.strip(),
            website=company.website.strip()
        )
        db.add(db_company)
        db.commit()
        db.refresh(db_company)
        return db_company
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error saving company: {str(e)}"
        )

@router.get("/", response_model=List[CompanyResponse])
def get_companies(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    try:
        companies = db.query(Company).order_by(Company.id.desc()).offset(skip).limit(limit).all()
        return companies
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error retrieving companies: {str(e)}"
        )

@router.get("/{company_id}", response_model=CompanyResponse)
def get_company(company_id: int, db: Session = Depends(get_db)):
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    return company

@router.delete("/{company_id}")
def delete_company(company_id: int, db: Session = Depends(get_db)):
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    db.delete(company)
    db.commit()
    return {"message": f"Company {company_id} deleted successfully"}

# ==============================================================================
# Task 1 & Task 5: Research & Analyze
# ==============================================================================

@router.post("/analyze")
@router.post("/analyze/")
def analyze_company_endpoint(company_in: CompanyCreate, db: Session = Depends(get_db)):
    """
    Task 1 & Task 5: Validates URL, extracts public company information, sends to LLM,
    produces structured company intelligence, and saves to PostgreSQL.
    """
    comp_name = company_in.name.strip() if company_in.name else derive_company_name_from_url(company_in.website)
    company = find_existing_company(db, comp_name, company_in.website)
    if not company:
        company = Company(name=comp_name, website=company_in.website.strip())
        db.add(company)
        db.commit()
        db.refresh(company)

    # Execute research
    try:
        research_data = ResearchService.analyze_company(company.name, company.website)
        conflicts_list = [c.model_dump() if hasattr(c, "model_dump") else c for c in research_data.data_conflicts] if research_data.data_conflicts else []

        db_research = CompanyResearch(
            company_id=company.id,
            description=research_data.description,
            industry=research_data.industry,
            products_services=research_data.products_services,
            target_customers=research_data.target_customers,
            business_model=research_data.business_model,
            company_size=research_data.company_size,
            locations=research_data.locations,
            sources=research_data.sources,
            confidence_score=research_data.confidence_score,
            data_conflicts=conflicts_list,
            uncertainty_notes=research_data.uncertainty_notes,
            hiring_signals=research_data.hiring_signals,
            growth_signals=research_data.growth_signals,
            technology_signals=research_data.technology_signals,
            recent_events=research_data.recent_events,
            potential_opportunities=research_data.potential_opportunities,
            key_risks=research_data.key_risks
        )
        db.add(db_research)
        db.commit()
        db.refresh(db_research)

        # Save snapshot
        ResearchService.persist_snapshot(db, company.id, research_data, change_summary="Direct analyze endpoint execution")

        # Save sources
        if research_data.sources:
            ResearchService.persist_sources(db, company.id, research_data.sources)

        return {
            "success": True,
            "company": company,
            "research": db_research
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@router.post("/{company_id}/research", response_model=CompanyResearchResponse)
def trigger_company_research(company_id: int, db: Session = Depends(get_db)):
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
        
    try:
        research_data = ResearchService.analyze_company(company.name, company.website)
        conflicts_list = [c.model_dump() if hasattr(c, "model_dump") else c for c in research_data.data_conflicts] if research_data.data_conflicts else []
        
        db_research = CompanyResearch(
            company_id=company.id,
            description=research_data.description,
            industry=research_data.industry,
            products_services=research_data.products_services,
            target_customers=research_data.target_customers,
            business_model=research_data.business_model,
            company_size=research_data.company_size,
            locations=research_data.locations,
            sources=research_data.sources,
            confidence_score=research_data.confidence_score,
            data_conflicts=conflicts_list,
            uncertainty_notes=research_data.uncertainty_notes,
            hiring_signals=research_data.hiring_signals,
            growth_signals=research_data.growth_signals,
            technology_signals=research_data.technology_signals,
            recent_events=research_data.recent_events,
            potential_opportunities=research_data.potential_opportunities,
            key_risks=research_data.key_risks
        )
        db.add(db_research)
        db.commit()
        db.refresh(db_research)

        # Persist snapshot & sources
        ResearchService.persist_snapshot(db, company.id, research_data, change_summary="Research update")
        if research_data.sources:
            ResearchService.persist_sources(db, company.id, research_data.sources)
        
        return db_research
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error generating company research: {str(e)}")

@router.get("/{company_id}/research", response_model=List[CompanyResearchResponse])
def get_company_research(company_id: int, db: Session = Depends(get_db)):
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    return db.query(CompanyResearch).filter(CompanyResearch.company_id == company_id).order_by(CompanyResearch.created_at.desc()).all()

# ==============================================================================
# Task 2: Opportunity Scoring Endpoint
# ==============================================================================

@router.post("/{company_id}/score", response_model=OpportunityResponse)
def score_company_opportunity(company_id: int, db: Session = Depends(get_db)):
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    
    latest_research = db.query(CompanyResearch).filter(
        CompanyResearch.company_id == company_id
    ).order_by(CompanyResearch.created_at.desc()).first()

    if not latest_research:
        raise HTTPException(status_code=400, detail="No research found for company. Run research first.")

    research_dict = {
        "description": latest_research.description,
        "industry": latest_research.industry,
        "products_services": latest_research.products_services,
        "target_customers": latest_research.target_customers,
        "business_model": latest_research.business_model,
        "company_size": latest_research.company_size,
        "locations": latest_research.locations,
        "sources": latest_research.sources,
        "hiring_signals": latest_research.hiring_signals,
        "growth_signals": latest_research.growth_signals
    }

    signals = db.query(Signal).filter(Signal.company_id == company_id).all()
    signals_dict = [{"type": s.signal_type, "desc": s.description} for s in signals]

    try:
        score_data = generate_opportunity_score(company.name, research_dict, signals_dict)
        factors_dict = score_data.score_factors.model_dump() if hasattr(score_data.score_factors, "model_dump") else score_data.score_factors

        db_opp = Opportunity(
            company_id=company.id,
            score=score_data.score,
            priority=score_data.priority or ("High" if score_data.score >= 75 else "Medium"),
            score_factors=factors_dict,
            reasons=score_data.reasons,
            positive_signals=score_data.positive_signals,
            negative_signals=score_data.negative_signals,
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
        raise HTTPException(status_code=500, detail=f"Scoring failed: {str(e)}")

# ==============================================================================
# Task 3: Contacts / Decision Maker Personas
# ==============================================================================

@router.get("/{company_id}/contacts", response_model=List[PersonResponse])
def get_company_contacts(company_id: int, db: Session = Depends(get_db)):
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    return db.query(Person).filter(Person.company_id == company_id).order_by(Person.id.asc()).all()

# ==============================================================================
# Task 4: Contextual Outreach Endpoint
# ==============================================================================

@router.post("/{company_id}/outreach", response_model=OutreachResponse)
def generate_company_outreach(company_id: int, db: Session = Depends(get_db)):
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    latest_research = db.query(CompanyResearch).filter(
        CompanyResearch.company_id == company_id
    ).order_by(CompanyResearch.created_at.desc()).first()

    if not latest_research:
        raise HTTPException(status_code=400, detail="Research required before generating outreach.")

    latest_opp = db.query(Opportunity).filter(
        Opportunity.company_id == company_id
    ).order_by(Opportunity.created_at.desc()).first()

    person = db.query(Person).filter(Person.company_id == company_id).first()
    if not person:
        # Auto-create strategic persona if none exists
        person = Person(
            company_id=company.id,
            name=None,
            job_title="VP of Engineering / Technical Leader",
            is_persona=True,
            relevance_reason="Directly oversees technical tooling, architecture, and developer productivity decisions.",
            approach_now_reason="Immediate relevance to company scaling and infrastructure goals.",
            source="Automated Persona Matching",
            confidence="High"
        )
        db.add(person)
        db.commit()
        db.refresh(person)

    research_dict = {
        "description": latest_research.description,
        "industry": latest_research.industry,
        "products_services": latest_research.products_services,
        "business_model": latest_research.business_model
    }
    opp_dict = {
        "score": latest_opp.score if latest_opp else 75,
        "recommended_action": latest_opp.recommended_action if latest_opp else "Explore architecture synergy."
    }
    person_dict = {
        "name": person.name,
        "job_title": person.job_title,
        "relevance_reason": person.relevance_reason
    }

    signals = db.query(Signal).filter(Signal.company_id == company_id).all()
    signals_data = [{"type": s.signal_type, "desc": s.description} for s in signals]

    try:
        outreach_data = generate_outreach(company.name, person_dict, research_dict, opp_dict, signals_data)
        db_outreach = Outreach(
            company_id=company.id,
            person_id=person.id,
            subject=outreach_data.subject,
            opening=outreach_data.opening,
            body=outreach_data.body,
            main_message=outreach_data.main_message,
            call_to_action=outreach_data.call_to_action,
            personalization_reasons=outreach_data.personalization_reasons,
            evidence_used=outreach_data.evidence_used
        )
        db.add(db_outreach)
        db.commit()
        db.refresh(db_outreach)
        return db_outreach
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Outreach generation failed: {str(e)}")

# ==============================================================================
# Task 6: Trigger Check Endpoint & Snapshots History
# ==============================================================================

@router.post("/{company_id}/trigger-check", response_model=List[SignalResponse])
def run_trigger_check(company_id: int, db: Session = Depends(get_db)):
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    research_history = db.query(CompanyResearch).filter(
        CompanyResearch.company_id == company_id
    ).order_by(CompanyResearch.created_at.desc()).limit(2).all()

    if not research_history:
        raise HTTPException(status_code=400, detail="No research found for trigger comparison.")

    def r_to_dict(r):
        return {
            "description": r.description,
            "industry": r.industry,
            "products_services": r.products_services,
            "target_customers": r.target_customers,
            "business_model": r.business_model,
            "company_size": r.company_size,
            "locations": r.locations
        }

    try:
        if len(research_history) >= 2:
            signals = detect_triggers(company.name, r_to_dict(research_history[1]), r_to_dict(research_history[0]))
        else:
            signals = detect_triggers(company.name, None, r_to_dict(research_history[0]))

        saved = []
        for s in signals:
            sig = Signal(
                company_id=company.id,
                signal_type=s.signal_type,
                description=s.description,
                meaningful=s.meaningful,
                is_meaningful=s.is_meaningful,
                worth_acting_on=s.worth_acting_on,
                recommended_action=s.recommended_action,
                source=s.source
            )
            db.add(sig)
            saved.append(sig)
        db.commit()
        for ss in saved:
            db.refresh(ss)
        return saved
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Trigger detection failed: {str(e)}")

@router.get("/{company_id}/snapshots", response_model=List[ResearchSnapshotResponse])
def get_company_snapshots(company_id: int, db: Session = Depends(get_db)):
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    return db.query(ResearchSnapshot).filter(ResearchSnapshot.company_id == company_id).order_by(ResearchSnapshot.created_at.desc()).all()

@router.get("/{company_id}/sources", response_model=List[SourceResponse])
def get_company_sources(company_id: int, db: Session = Depends(get_db)):
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    return db.query(Source).filter(Source.company_id == company_id).order_by(Source.created_at.desc()).all()

# ==============================================================================
# Unified Automation Pipeline (Task 5)
# ==============================================================================

@router.post("/{company_id}/pipeline")
def run_company_pipeline(company_id: int, db: Session = Depends(get_db)):
    """Runs the entire end-to-end intelligence pipeline for an existing company."""
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    # Step 1: Research
    try:
        research_data = ResearchService.analyze_company(company.name, company.website)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI Research step failed: {str(e)}")

    # Step 2: Save Research
    try:
        conflicts_list = [c.model_dump() if hasattr(c, "model_dump") else c for c in research_data.data_conflicts] if research_data.data_conflicts else []
        existing_research = db.query(CompanyResearch).filter(CompanyResearch.company_id == company_id).order_by(CompanyResearch.created_at.desc()).all()

        if len(existing_research) < 2:
            db_research = CompanyResearch(
                company_id=company.id,
                description=research_data.description,
                industry=research_data.industry,
                products_services=research_data.products_services,
                target_customers=research_data.target_customers,
                business_model=research_data.business_model,
                company_size=research_data.company_size,
                locations=research_data.locations,
                sources=research_data.sources,
                confidence_score=research_data.confidence_score,
                data_conflicts=conflicts_list,
                uncertainty_notes=research_data.uncertainty_notes,
                hiring_signals=research_data.hiring_signals,
                growth_signals=research_data.growth_signals,
                technology_signals=research_data.technology_signals,
                recent_events=research_data.recent_events,
                potential_opportunities=research_data.potential_opportunities,
                key_risks=research_data.key_risks
            )
            db.add(db_research)
        else:
            db_research = existing_research[0]
            db_research.description = research_data.description
            db_research.industry = research_data.industry
            db_research.products_services = research_data.products_services
            db_research.target_customers = research_data.target_customers
            db_research.business_model = research_data.business_model
            db_research.company_size = research_data.company_size
            db_research.locations = research_data.locations
            db_research.sources = research_data.sources
            db_research.confidence_score = research_data.confidence_score
            db_research.data_conflicts = conflicts_list
            db_research.uncertainty_notes = research_data.uncertainty_notes
            db_research.hiring_signals = research_data.hiring_signals
            db_research.growth_signals = research_data.growth_signals
            db_research.technology_signals = research_data.technology_signals

        db.commit()
        db.refresh(db_research)

        # Persist snapshot & sources
        ResearchService.persist_snapshot(db, company.id, research_data, change_summary="Automated pipeline execution")
        if research_data.sources:
            ResearchService.persist_sources(db, company.id, research_data.sources)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error saving research: {str(e)}")

    # Step 3: Opportunity Scoring
    try:
        research_dict = {
            "description": db_research.description,
            "industry": db_research.industry,
            "products_services": db_research.products_services,
            "target_customers": db_research.target_customers,
            "business_model": db_research.business_model,
            "company_size": db_research.company_size,
            "locations": db_research.locations,
            "sources": db_research.sources
        }
        score_data = generate_opportunity_score(company.name, research_dict)
        factors_dict = score_data.score_factors.model_dump() if hasattr(score_data.score_factors, "model_dump") else score_data.score_factors

        db_opp = db.query(Opportunity).filter(Opportunity.company_id == company.id).order_by(Opportunity.created_at.desc()).first()
        if db_opp:
            db_opp.score = score_data.score
            db_opp.priority = score_data.priority or ("High" if score_data.score >= 75 else "Medium")
            db_opp.score_factors = factors_dict
            db_opp.reasons = score_data.reasons
            db_opp.positive_signals = score_data.positive_signals
            db_opp.negative_signals = score_data.negative_signals
            db_opp.evidence = score_data.evidence
            db_opp.reasoning = score_data.reasoning
            db_opp.confidence = score_data.confidence
            db_opp.recommended_action = score_data.recommended_action
        else:
            db_opp = Opportunity(
                company_id=company.id,
                score=score_data.score,
                priority=score_data.priority or ("High" if score_data.score >= 75 else "Medium"),
                score_factors=factors_dict,
                reasons=score_data.reasons,
                positive_signals=score_data.positive_signals,
                negative_signals=score_data.negative_signals,
                evidence=score_data.evidence,
                reasoning=score_data.reasoning,
                confidence=score_data.confidence,
                recommended_action=score_data.recommended_action
            )
            db.add(db_opp)

        db.commit()
        db.refresh(db_opp)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Opportunity scoring failed: {str(e)}")

    # Step 4: Personas
    try:
        opp_dict = {
            "score": db_opp.score,
            "recommended_action": db_opp.recommended_action
        }
        people_list = identify_people(company.name, research_dict, opp_dict)
        existing_people = db.query(Person).filter(Person.company_id == company.id).all()
        saved_people = []

        for p in people_list:
            match = None
            for ep in existing_people:
                if (ep.job_title and p.job_title and ep.job_title.strip().lower() == p.job_title.strip().lower()) or \
                   (ep.name and p.name and ep.name.strip().lower() == p.name.strip().lower()):
                    match = ep
                    break
            if match:
                if p.name:
                    match.name = p.name
                match.is_persona = p.is_persona
                match.linkedin_url = p.linkedin_url
                match.relevance_reason = p.relevance_reason
                match.approach_now_reason = p.approach_now_reason
                match.source = p.source
                match.confidence = p.confidence
                saved_people.append(match)
            else:
                db_person = Person(
                    company_id=company.id,
                    name=p.name,
                    job_title=p.job_title,
                    is_persona=p.is_persona,
                    linkedin_url=p.linkedin_url,
                    relevance_reason=p.relevance_reason,
                    approach_now_reason=p.approach_now_reason,
                    source=p.source,
                    confidence=p.confidence
                )
                db.add(db_person)
                saved_people.append(db_person)

        db.commit()
        for sp in saved_people:
            db.refresh(sp)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Personas identification failed: {str(e)}")

    # Step 5: Outreach
    saved_outreach = None
    try:
        if saved_people:
            primary_person = saved_people[0]
            person_dict = {
                "name": primary_person.name,
                "job_title": primary_person.job_title,
                "relevance_reason": primary_person.relevance_reason
            }
            outreach_data = generate_outreach(company.name, person_dict, research_dict, opp_dict)

            db_outreach = db.query(Outreach).filter(
                Outreach.company_id == company.id,
                Outreach.person_id == primary_person.id
            ).first()

            if db_outreach:
                db_outreach.subject = outreach_data.subject
                db_outreach.opening = outreach_data.opening
                db_outreach.body = outreach_data.body
                db_outreach.main_message = outreach_data.main_message
                db_outreach.call_to_action = outreach_data.call_to_action
                db_outreach.personalization_reasons = outreach_data.personalization_reasons
                db_outreach.evidence_used = outreach_data.evidence_used
            else:
                db_outreach = Outreach(
                    company_id=company.id,
                    person_id=primary_person.id,
                    subject=outreach_data.subject,
                    opening=outreach_data.opening,
                    body=outreach_data.body,
                    main_message=outreach_data.main_message,
                    call_to_action=outreach_data.call_to_action,
                    personalization_reasons=outreach_data.personalization_reasons,
                    evidence_used=outreach_data.evidence_used
                )
                db.add(db_outreach)

            db.commit()
            db.refresh(db_outreach)
            saved_outreach = db_outreach
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Outreach generation failed: {str(e)}")

    # Step 6: Trigger Signals
    saved_signals = []
    try:
        research_history = db.query(CompanyResearch).filter(
            CompanyResearch.company_id == company_id
        ).order_by(CompanyResearch.created_at.desc()).limit(2).all()

        if len(research_history) >= 2:
            signals = detect_triggers(company.name, {
                "description": research_history[1].description,
                "industry": research_history[1].industry,
                "products_services": research_history[1].products_services,
                "business_model": research_history[1].business_model,
                "locations": research_history[1].locations
            }, {
                "description": research_history[0].description,
                "industry": research_history[0].industry,
                "products_services": research_history[0].products_services,
                "business_model": research_history[0].business_model,
                "locations": research_history[0].locations
            })
        else:
            signals = detect_triggers(company.name, None, {
                "description": research_history[0].description,
                "industry": research_history[0].industry,
                "products_services": research_history[0].products_services,
                "business_model": research_history[0].business_model,
                "locations": research_history[0].locations
            })

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
                    is_meaningful=s.is_meaningful,
                    worth_acting_on=s.worth_acting_on,
                    recommended_action=s.recommended_action,
                    source=s.source
                )
                db.add(db_signal)
                saved_signals.append(db_signal)
            else:
                saved_signals.append(existing_sig)

        db.commit()
        for ss in saved_signals:
            db.refresh(ss)
    except Exception as e:
        db.rollback()

    # Step 7: Database Verification Contract
    verified_company = db.query(Company).filter(Company.id == company.id).first()
    verified_research = db.query(CompanyResearch).filter(CompanyResearch.company_id == company.id).first()
    verified_opp = db.query(Opportunity).filter(Opportunity.company_id == company.id).first()
    verified_people_count = db.query(Person).filter(Person.company_id == company.id).count()
    verified_outreach_count = db.query(Outreach).filter(Outreach.company_id == company.id).count()

    if not (verified_company and verified_research and verified_opp and verified_people_count > 0 and verified_outreach_count > 0):
        raise HTTPException(
            status_code=500,
            detail="Database verification failed: Pipeline records could not be verified in PostgreSQL."
        )

    all_signals_count = db.query(Signal).filter(Signal.company_id == company.id).count()

    return {
        "success": True,
        "company_id": company.id,
        "company_name": company.name,
        "research_created": True,
        "opportunity_created": True,
        "personas_created": True,
        "outreach_generated": bool(saved_outreach),
        "signals_detected": all_signals_count > 0,
        "pipeline_completed": True,
        "research": db_research,
        "opportunity": db_opp,
        "people_count": len(saved_people),
        "signals_count": all_signals_count
    }

@router.post("/pipeline")
@router.post("/pipeline/")
def ingest_and_run_pipeline(company_in: CompanyCreate, db: Session = Depends(get_db)):
    """Ingests a company and executes the entire pipeline in one single API call."""
    comp_name = company_in.name.strip() if company_in.name else derive_company_name_from_url(company_in.website)
    company = find_existing_company(db, comp_name, company_in.website)
    if not company:
        company = Company(name=comp_name, website=company_in.website.strip())
        db.add(company)
        db.commit()
        db.refresh(company)

    return run_company_pipeline(company.id, db)