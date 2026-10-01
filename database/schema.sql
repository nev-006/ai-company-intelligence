-- ==============================================================================
-- ANAIKA Company Intelligence & Opportunity Engine Schema
-- PostgreSQL DDL Script
-- ==============================================================================

-- 1. Companies Table
CREATE TABLE IF NOT EXISTS companies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    website VARCHAR(500) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_companies_name ON companies(name);

-- 2. Company Research Table
CREATE TABLE IF NOT EXISTS company_research (
    id SERIAL PRIMARY KEY,
    company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
    description TEXT,
    industry VARCHAR(255),
    products_services JSONB DEFAULT '[]'::jsonb,
    target_customers JSONB DEFAULT '[]'::jsonb,
    business_model VARCHAR(255),
    company_size VARCHAR(100),
    locations JSONB DEFAULT '[]'::jsonb,
    sources JSONB DEFAULT '[]'::jsonb,
    confidence_score VARCHAR(50), -- High, Medium, Low
    data_conflicts JSONB DEFAULT '[]'::jsonb,
    uncertainty_notes TEXT,
    hiring_signals JSONB DEFAULT '[]'::jsonb,
    growth_signals JSONB DEFAULT '[]'::jsonb,
    technology_signals JSONB DEFAULT '[]'::jsonb,
    recent_events JSONB DEFAULT '[]'::jsonb,
    potential_opportunities JSONB DEFAULT '[]'::jsonb,
    key_risks JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_research_company_id ON company_research(company_id);

-- 3. Research Snapshots Table (Snapshot diffing over time)
CREATE TABLE IF NOT EXISTS research_snapshots (
    id SERIAL PRIMARY KEY,
    company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
    snapshot_data JSONB NOT NULL,
    change_summary TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_snapshots_company_id ON research_snapshots(company_id);

-- 4. Sources Table
CREATE TABLE IF NOT EXISTS sources (
    id SERIAL PRIMARY KEY,
    company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
    url VARCHAR(1000) NOT NULL,
    source_name VARCHAR(255),
    source_type VARCHAR(100) DEFAULT 'Website',
    reliability_tier VARCHAR(50) DEFAULT 'High',
    retrieved_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    snippet TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_sources_company_id ON sources(company_id);

-- 5. Opportunities Table
CREATE TABLE IF NOT EXISTS opportunities (
    id SERIAL PRIMARY KEY,
    company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
    score INTEGER NOT NULL, -- 0-100
    priority VARCHAR(50) DEFAULT 'Medium',
    score_factors JSONB NOT NULL,
    reasons JSONB DEFAULT '[]'::jsonb,
    positive_signals JSONB DEFAULT '[]'::jsonb,
    negative_signals JSONB DEFAULT '[]'::jsonb,
    evidence TEXT,
    reasoning TEXT,
    confidence VARCHAR(50), -- High, Medium, Low
    recommended_action TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_opportunities_company_id ON opportunities(company_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_score ON opportunities(score DESC);

-- 6. People / Contacts Table
CREATE TABLE IF NOT EXISTS people (
    id SERIAL PRIMARY KEY,
    company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(255),
    job_title VARCHAR(255) NOT NULL,
    is_persona BOOLEAN DEFAULT TRUE,
    linkedin_url VARCHAR(500),
    relevance_reason TEXT,
    approach_now_reason TEXT,
    source VARCHAR(255),
    confidence VARCHAR(50), -- High, Medium, Low
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_people_company_id ON people(company_id);

-- 7. Outreaches Table
CREATE TABLE IF NOT EXISTS outreaches (
    id SERIAL PRIMARY KEY,
    company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
    person_id INTEGER REFERENCES people(id) ON DELETE CASCADE,
    subject VARCHAR(500) NOT NULL,
    opening TEXT NOT NULL,
    body TEXT NOT NULL,
    main_message TEXT,
    call_to_action TEXT,
    personalization_reasons JSONB DEFAULT '[]'::jsonb,
    evidence_used JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_outreaches_company_id ON outreaches(company_id);

-- 8. Signals / Triggers Table
CREATE TABLE IF NOT EXISTS signals (
    id SERIAL PRIMARY KEY,
    company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
    signal_type VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    meaningful VARCHAR(255) NOT NULL,
    is_meaningful BOOLEAN DEFAULT TRUE,
    worth_acting_on BOOLEAN DEFAULT TRUE,
    recommended_action TEXT,
    source VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_signals_company_id ON signals(company_id);

-- ==============================================================================
-- Schema Aliases / Compatibility Views
-- ==============================================================================
CREATE OR REPLACE VIEW research AS SELECT * FROM company_research;
CREATE OR REPLACE VIEW contacts AS SELECT * FROM people;
CREATE OR REPLACE VIEW outreach AS SELECT * FROM outreaches;
CREATE OR REPLACE VIEW triggers AS SELECT * FROM signals;
