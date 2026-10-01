from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, JSON, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base

class Company(Base):
    __tablename__ = "companies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    website = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    research = relationship("CompanyResearch", back_populates="company", cascade="all, delete-orphan")
    opportunities = relationship("Opportunity", back_populates="company", cascade="all, delete-orphan")
    people = relationship("Person", back_populates="company", cascade="all, delete-orphan")
    signals = relationship("Signal", back_populates="company", cascade="all, delete-orphan")
    snapshots = relationship("ResearchSnapshot", back_populates="company", cascade="all, delete-orphan")
    source_records = relationship("Source", back_populates="company", cascade="all, delete-orphan")


class CompanyResearch(Base):
    __tablename__ = "company_research"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"))
    
    description = Column(Text)
    industry = Column(String)
    products_services = Column(JSON) # List of products
    target_customers = Column(JSON)
    business_model = Column(String)
    company_size = Column(String)
    locations = Column(JSON)
    sources = Column(JSON)
    confidence_score = Column(String) # High, Medium, Low
    data_conflicts = Column(JSON, nullable=True) # Explicit conflict analysis between sources
    uncertainty_notes = Column(Text, nullable=True) # Explanation of uncertainty and communication to user
    
    # Extended intelligence signals
    hiring_signals = Column(JSON, nullable=True)
    growth_signals = Column(JSON, nullable=True)
    technology_signals = Column(JSON, nullable=True)
    recent_events = Column(JSON, nullable=True)
    potential_opportunities = Column(JSON, nullable=True)
    key_risks = Column(JSON, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    company = relationship("Company", back_populates="research")


class ResearchSnapshot(Base):
    __tablename__ = "research_snapshots"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"))
    
    snapshot_data = Column(JSON, nullable=False)
    change_summary = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    company = relationship("Company", back_populates="snapshots")


class Source(Base):
    __tablename__ = "sources"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"))
    
    url = Column(String, nullable=False)
    source_name = Column(String, nullable=True)
    source_type = Column(String, default="Website")
    reliability_tier = Column(String, default="High")
    retrieved_at = Column(DateTime(timezone=True), server_default=func.now())
    snippet = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    company = relationship("Company", back_populates="source_records")


class Opportunity(Base):
    __tablename__ = "opportunities"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"))
    
    score = Column(Integer) # 0-100
    priority = Column(String, default="Medium") # High, Medium, Low
    score_factors = Column(JSON) # Detailed factors
    reasons = Column(JSON, nullable=True) # Why this score
    positive_signals = Column(JSON, nullable=True)
    negative_signals = Column(JSON, nullable=True)
    evidence = Column(Text)
    reasoning = Column(Text)
    confidence = Column(String) # High, Medium, Low
    recommended_action = Column(Text)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    company = relationship("Company", back_populates="opportunities")


class Person(Base):
    __tablename__ = "people"
    
    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"))
    
    name = Column(String, nullable=True) # None if persona
    job_title = Column(String)
    is_persona = Column(Boolean, default=True) # Clearly distinguish persona vs confirmed individual
    linkedin_url = Column(String, nullable=True)
    relevance_reason = Column(Text)
    approach_now_reason = Column(Text, nullable=True)
    source = Column(String)
    confidence = Column(String) # High, Medium, Low
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    company = relationship("Company", back_populates="people")
    outreaches = relationship("Outreach", back_populates="person", cascade="all, delete-orphan")


class Outreach(Base):
    __tablename__ = "outreaches"
    
    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"))
    person_id = Column(Integer, ForeignKey("people.id"))
    
    subject = Column(String)
    opening = Column(Text)
    body = Column(Text)
    main_message = Column(Text, nullable=True)
    call_to_action = Column(Text, nullable=True)
    personalization_reasons = Column(JSON, nullable=True)
    evidence_used = Column(JSON) # Company signals & facts used
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    person = relationship("Person", back_populates="outreaches")


class Signal(Base):
    __tablename__ = "signals"
    
    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"))
    
    signal_type = Column(String) # E.g., Hiring Surge, Product Expansion, Funding
    description = Column(Text)
    meaningful = Column(String) # Meaningful Signal or Noise
    is_meaningful = Column(Boolean, default=True)
    worth_acting_on = Column(Boolean, default=True)
    recommended_action = Column(Text, nullable=True)
    source = Column(String)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    company = relationship("Company", back_populates="signals")
