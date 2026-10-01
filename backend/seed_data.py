"""
seed_data.py - ANAIKA Intelligence Seed Data Script
Creates realistic B2B companies for demonstration and testing.
ALL DATA IS EXPLICITLY LABELED AS [DEMO SEED DATA].
"""

import sys
import os

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
from datetime import datetime, timezone, timedelta

# Ensure backend path is on sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.database import engine, SessionLocal, Base
from app.models.company import Company, CompanyResearch, ResearchSnapshot, Source, Opportunity, Person, Outreach, Signal

def run_seed():
    print("=" * 60)
    print("ANAIKA INTELLIGENCE — SEED DATA INITIALIZER")
    print("=" * 60)

    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    demo_companies = [
        {
            "name": "Linear",
            "website": "https://linear.app",
            "description": "[DEMO SEED DATA] Linear is an issue tracking and product project management tool built for high-performance software engineering and product teams.",
            "industry": "Developer Tools & Project Management",
            "products_services": ["Linear Issues", "Linear Cycles", "Linear Insights", "Linear Asks", "Linear Mobile"],
            "target_customers": ["High-growth technology startups", "Product engineering teams", "SaaS scale-ups"],
            "business_model": "B2B SaaS (Seat-based tiered subscription)",
            "company_size": "85 employees (Adjudicated)",
            "locations": ["San Francisco, CA, USA", "Remote Worldwide"],
            "sources": ["https://linear.app/about", "https://linear.app/careers", "https://techcrunch.com/linear-series-b"],
            "confidence_score": "High",
            "data_conflicts": [
                {
                    "field": "company_size",
                    "source_a": "LinkedIn Company Directory: 120 employees",
                    "source_b": "Linear Official Careers Page: 85 team members",
                    "chosen_value": "85 employees",
                    "resolution_reasoning": "Linear official team page is a primary company-maintained source updated March 2026. LinkedIn includes contractors and unverified profiles.",
                    "uncertainty_level": "Low",
                    "display_status": "Conflicting"
                }
            ],
            "uncertainty_notes": "[DEMO SEED DATA] Valuation and private revenue metrics are estimated based on industry benchmarks; headcount is verified from primary team roster.",
            "hiring_signals": ["Hiring 8 Senior Distributed Systems Engineers", "Hiring AI Product Designer"],
            "growth_signals": ["Reported 300% ARR growth in enterprise tier", "Rapid expansion across EMEA tech hubs"],
            "technology_signals": ["Sync engine built in TypeScript & Rust", "Local-first SQLite browser architecture", "Deep GitHub/Slack API integrations"],
            "recent_events": ["Launched Linear Asks for enterprise IT requests", "Introduced AI-powered duplicate issue detection"],
            "potential_opportunities": ["Partner on AI triage workflows", "Integrate automated company signal feeds"],
            "key_risks": ["Competition from Jira Enterprise and GitHub Projects"],
            "opp_score": 92,
            "priority": "High",
            "score_factors": {
                "company_fit": 95,
                "growth_signal": 92,
                "hiring_signal": 90,
                "technology_signal": 95,
                "recent_activity": 88,
                "trigger_strength": 94,
                "decision_maker_availability": 85,
                "business_fit": 95,
                "technology_relevance": 95
            },
            "reasons": [
                "Top-tier modern ICP fit: engineering-centric high-velocity software company",
                "Aggressive senior backend hiring indicates expanding infrastructure needs",
                "Recent AI product launch creates immediate strategic relevance",
                "High data confidence with verified official primary sources"
            ],
            "positive_signals": ["Hiring surge in distributed systems", "Local-first architecture investment", "High customer love & organic expansion"],
            "negative_signals": ["Relatively small team size requires high-touch executive engagement"],
            "evidence": "Primary career portal lists 8 active engineering openings in distributed systems and AI workflows. Official blog announces major enterprise tier push.",
            "reasoning": "Linear is experiencing significant enterprise adoption requiring expanded infrastructure reliability and developer tooling. Ideal moment to engage technical leadership.",
            "confidence": "High",
            "recommended_action": "Reach out to VP of Engineering regarding developer workflow automation and AI sync architecture.",
            "contacts": [
                {
                    "name": "Karri Saarinen",
                    "job_title": "CEO & Co-Founder",
                    "is_persona": False,
                    "linkedin_url": "https://linkedin.com/in/karrisaarinen",
                    "relevance_reason": "Sets company vision, product philosophy, and major platform partnership strategy.",
                    "approach_now_reason": "Linear is scaling enterprise tiers and expanding developer ecosystem partnerships.",
                    "source": "Official Company About Page",
                    "confidence": "High"
                },
                {
                    "name": None,
                    "job_title": "Head of Engineering",
                    "is_persona": True,
                    "linkedin_url": None,
                    "relevance_reason": "Owns engineering infrastructure, developer velocity, and system scaling decisions.",
                    "approach_now_reason": "Managing aggressive engineering recruitment and distributed sync infrastructure.",
                    "source": "Strategic Persona Matching",
                    "confidence": "High"
                }
            ],
            "outreach": {
                "subject": "Linear's distributed sync & AI workflow scaling",
                "opening": "Saw Linear's recent launch of AI issue triage alongside the expansion of your distributed sync engine.",
                "main_message": "As your engineering team scales past 80 people and rolls out enterprise workflows, maintaining sub-50ms sync latency while orchestrating AI agents across workspaces is a critical hurdle.",
                "call_to_action": "Would you be open to a 5-minute conversation on how we solved similar sync bottlenecks for fast-growing dev tools?",
                "personalization_reasons": ["Referenced local-first sync architecture", "Cited AI issue triage launch", "Acknowledged team expansion to 85 engineers"],
                "evidence_used": ["Linear Asks announcement", "Senior Distributed Systems hiring surge", "85 employee headcount milestone"]
            },
            "signals": [
                {
                    "signal_type": "Hiring Surge",
                    "description": "Linear posted 8 new senior distributed systems engineering roles in the past 14 days.",
                    "meaningful": "Meaningful Signal",
                    "is_meaningful": True,
                    "worth_acting_on": True,
                    "recommended_action": "Initiate outreach to Head of Engineering referencing sync infrastructure challenges.",
                    "source": "Linear Careers Page Diff"
                },
                {
                    "signal_type": "Product Launch",
                    "description": "Released Linear Asks and AI-assisted workspace duplicate detection.",
                    "meaningful": "Meaningful Signal",
                    "is_meaningful": True,
                    "worth_acting_on": True,
                    "recommended_action": "Highlight capability integrations with new AI workflows.",
                    "source": "Linear Release Notes"
                },
                {
                    "signal_type": "Website Copy Update",
                    "description": "Refined tagline on homepage hero from 'Issue tracking' to 'Purpose-built for modern product teams'.",
                    "meaningful": "Noise",
                    "is_meaningful": False,
                    "worth_acting_on": False,
                    "recommended_action": "Ignore - routine brand copy iteration.",
                    "source": "Homepage HTML Snapshot"
                }
            ]
        },
        {
            "name": "PostHog",
            "website": "https://posthog.com",
            "description": "[DEMO SEED DATA] PostHog is the all-in-one open-source developer platform for product analytics, session recording, feature flags, A/B testing, and AI LLM observability.",
            "industry": "Product Analytics & Developer Tools",
            "products_services": ["Product Analytics", "Session Replay", "Feature Flags", "LLM Observability", "Surveys", "Data Warehouse"],
            "target_customers": ["Software engineering teams", "Product managers", "Technical founders", "Growth leads"],
            "business_model": "Open-core + Usage-based Cloud SaaS",
            "company_size": "110 employees",
            "locations": ["San Francisco, CA, USA", "London, UK", "100% Fully Remote Worldwide"],
            "sources": ["https://posthog.com/about", "https://posthog.com/handbook", "https://github.com/PostHog/posthog"],
            "confidence_score": "High",
            "data_conflicts": [],
            "uncertainty_notes": "[DEMO SEED DATA] Fully transparent company handbook makes data confidence exceptionally high.",
            "hiring_signals": ["Hiring ClickHouse infrastructure engineers", "Hiring LLM evaluation specialists"],
            "growth_signals": ["Over 100,000 developer teams onboarded", "ClickHouse ingest exceeding billions of daily events"],
            "technology_signals": ["ClickHouse OLAP backend", "Django/Python API", "React/TypeScript frontend", "Kafka event streaming"],
            "recent_events": ["Launched PostHog LLM Observability & Cost Tracking", "Released Native Data Warehouse with S3 sync"],
            "potential_opportunities": ["Partner on real-time event pipeline integrations", "LLM monitoring cross-adoption"],
            "key_risks": ["High volume ingest requires efficient self-hosting or high cloud usage tier"],
            "opp_score": 89,
            "priority": "High",
            "score_factors": {
                "company_fit": 92,
                "growth_signal": 90,
                "hiring_signal": 88,
                "technology_signal": 95,
                "recent_activity": 92,
                "trigger_strength": 90,
                "decision_maker_availability": 85,
                "business_fit": 92,
                "technology_relevance": 95
            },
            "reasons": [
                "Exceptional product velocity with 6 active product suites",
                "Recent rollout of LLM Observability signals aggressive AI initiative push",
                "Transparent remote culture facilitates rapid technical engagement",
                "High data reliability backed by public company handbook"
            ],
            "positive_signals": ["Launched LLM Observability", "Scaling ClickHouse infrastructure", "Over 100k companies deployed"],
            "negative_signals": ["Strong bias towards internal open-source dogfooding"],
            "evidence": "Public handbook confirms 110 employees, $15M+ ARR, and active expansion into data warehouse and LLM tracking.",
            "reasoning": "PostHog's entry into LLM Observability makes them a prime partner and user for enterprise AI telemetry tooling.",
            "confidence": "High",
            "recommended_action": "Contact Head of Product / VP Engineering referencing LLM Observability synergies.",
            "contacts": [
                {
                    "name": "James Hawkins",
                    "job_title": "CEO & Co-Founder",
                    "is_persona": False,
                    "linkedin_url": "https://linkedin.com/in/james-hawkins-posthog",
                    "relevance_reason": "Co-founder leading overall product roadmap and open-core developer strategy.",
                    "approach_now_reason": "Accelerating LLM tooling adoption and enterprise data warehouse features.",
                    "source": "Public Company Handbook",
                    "confidence": "High"
                },
                {
                    "name": None,
                    "job_title": "VP of Engineering / Technical Leader",
                    "is_persona": True,
                    "linkedin_url": None,
                    "relevance_reason": "Oversees ClickHouse scalability, ingest pipelines, and infrastructure uptime.",
                    "approach_now_reason": "Managing massive multi-billion event daily ingestion scaling.",
                    "source": "Strategic Persona Matching",
                    "confidence": "High"
                }
            ],
            "outreach": {
                "subject": "PostHog's LLM Observability & ClickHouse scale",
                "opening": "Loved reading your public handbook writeup on scaling ClickHouse ingest alongside the new LLM Observability product launch.",
                "main_message": "As developers stream millions of prompt traces into PostHog, indexing unstructured conversational vectors without degrading session replay queries becomes challenging.",
                "call_to_action": "Open to a quick exchange on how we streamlined vector trace aggregation for developer platforms?",
                "personalization_reasons": ["Referenced public handbook transparency", "Cited ClickHouse ingest scale", "Addressed LLM Observability launch"],
                "evidence_used": ["PostHog LLM Observability launch", "ClickHouse infrastructure hiring", "110-person distributed team"]
            },
            "signals": [
                {
                    "signal_type": "New Product Line",
                    "description": "PostHog launched native LLM Observability & Cost Tracking for generative AI applications.",
                    "meaningful": "Meaningful Signal",
                    "is_meaningful": True,
                    "worth_acting_on": True,
                    "recommended_action": "Position developer AI telemetry solutions to Head of Product.",
                    "source": "PostHog Product Blog"
                },
                {
                    "signal_type": "Infrastructure Scale",
                    "description": "Event ingestion surpassed 5 billion events per day on primary cloud cluster.",
                    "meaningful": "Meaningful Signal",
                    "is_meaningful": True,
                    "worth_acting_on": True,
                    "recommended_action": "Engage infrastructure engineering lead.",
                    "source": "Public System Metrics"
                }
            ]
        },
        {
            "name": "Resend",
            "website": "https://resend.com",
            "description": "[DEMO SEED DATA] Resend is the email platform for developers, built on React Email to enable seamless transactional and marketing email delivery.",
            "industry": "Developer Tools & Communication Infrastructure",
            "products_services": ["Resend Email API", "React Email", "Audiences & Broadcasts", "Email Analytics"],
            "target_customers": ["Fullstack developers", "Next.js & React builders", "SaaS startups"],
            "business_model": "Usage-based Developer API",
            "company_size": "25 employees",
            "locations": ["San Francisco, CA, USA", "Remote"],
            "sources": ["https://resend.com/about", "https://resend.com/blog", "https://github.com/resend/react-email"],
            "confidence_score": "High",
            "data_conflicts": [],
            "uncertainty_notes": "[DEMO SEED DATA] Rapidly growing startup with verified founder updates.",
            "hiring_signals": ["Hiring Senior Infrastructure Engineers", "Hiring Enterprise Sales Lead"],
            "growth_signals": ["Over 500 million emails delivered monthly", "React Email surpassed 15,000 GitHub stars"],
            "technology_signals": ["Edge-first API on Cloudflare/AWS", "React Email component ecosystem", "Next.js native SDK"],
            "recent_events": ["Launched Broadcasts & Marketing Engine", "Released Webhook Delivery v2"],
            "potential_opportunities": ["Partner on AI email generation and deliverability telemetry"],
            "key_risks": ["Deliverability reputation management at high sender volumes"],
            "opp_score": 86,
            "priority": "High",
            "score_factors": {
                "company_fit": 90,
                "growth_signal": 88,
                "hiring_signal": 85,
                "technology_signal": 92,
                "recent_activity": 85,
                "trigger_strength": 88,
                "decision_maker_availability": 82,
                "business_fit": 90,
                "technology_relevance": 92
            },
            "reasons": [
                "Dominant momentum in the modern React and Next.js developer ecosystem",
                "Transitioning from pure transactional API to full marketing email suite",
                "High growth and strong developer community evangelism",
                "Lean team with fast decision-making cycles"
            ],
            "positive_signals": ["Over 500M monthly emails", "Launched Marketing Broadcasts", "React Email virality"],
            "negative_signals": ["Lean team size means strict prioritization of inbound partnerships"],
            "evidence": "Founder announced surpassing 500 million monthly emails and expanding into full marketing email suite.",
            "reasoning": "Resend's expansion into marketing broadcasts requires advanced audience segmentation and deliverability analytics.",
            "confidence": "High",
            "recommended_action": "Contact Founder/CTO regarding AI deliverability monitoring and template generation.",
            "contacts": [
                {
                    "name": "Zeno Rocha",
                    "job_title": "Founder & CEO",
                    "is_persona": False,
                    "linkedin_url": "https://linkedin.com/in/zenorocha",
                    "relevance_reason": "Visionary developer advocate and founder driving product strategy and platform partnerships.",
                    "approach_now_reason": "Expanding Resend into enterprise marketing broadcasts and developer tooling.",
                    "source": "Official Resend Website",
                    "confidence": "High"
                }
            ],
            "outreach": {
                "subject": "Resend's 500M email milestone & deliverability scale",
                "opening": "Congrats on hitting the 500 million monthly email milestone and the rapid adoption of React Email.",
                "main_message": "As developers adopt Broadcasts for marketing emails, managing IP warmup and reputation drift across shared vs dedicated pools becomes a major friction point.",
                "call_to_action": "Worth a quick 5-minute chat on how our automated deliverability telemetry can plug into Resend Webhooks?",
                "personalization_reasons": ["Cited 500M monthly email milestone", "Acknowledged React Email momentum", "Referenced Broadcasts launch"],
                "evidence_used": ["500M monthly email announcement", "Broadcasts launch", "React Email adoption"]
            },
            "signals": [
                {
                    "signal_type": "Product Expansion",
                    "description": "Resend officially launched Broadcasts and Audiences to compete with marketing email providers.",
                    "meaningful": "Meaningful Signal",
                    "is_meaningful": True,
                    "worth_acting_on": True,
                    "recommended_action": "Offer AI personalization and segmentation integrations.",
                    "source": "Resend Blog"
                }
            ]
        },
        {
            "name": "Supabase",
            "website": "https://supabase.com",
            "description": "[DEMO SEED DATA] Supabase is an open-source Firebase alternative providing a dedicated PostgreSQL database, authentication, instant APIs, edge functions, and real-time subscriptions.",
            "industry": "Cloud Database & Backend as a Service (BaaS)",
            "products_services": ["PostgreSQL Database", "Supabase Auth", "Edge Functions", "Storage", "Realtime", "pgvector AI"],
            "target_customers": ["Fullstack developers", "AI application builders", "Modern web and mobile teams"],
            "business_model": "Developer-first Cloud SaaS + Enterprise Support",
            "company_size": "140 employees",
            "locations": ["Singapore", "San Francisco, CA, USA", "100% Fully Distributed"],
            "sources": ["https://supabase.com/company", "https://github.com/supabase/supabase"],
            "confidence_score": "High",
            "data_conflicts": [],
            "uncertainty_notes": "[DEMO SEED DATA] Verified through Launch Week releases and open-source milestones.",
            "hiring_signals": ["Hiring Database Kernel Engineers", "Hiring Enterprise Support Architects"],
            "growth_signals": ["Over 1 million databases launched", "Leading cloud host for pgvector AI embeddings"],
            "technology_signals": ["PostgreSQL core", "Elixir/Phoenix realtime engine", "Deno edge runtime", "Go authentication service"],
            "recent_events": ["Launch Week XI: Postgres 17 support, Auth v3 with Passkeys, Branching GA"],
            "potential_opportunities": ["AI vector index optimization and enterprise schema governance"],
            "key_risks": ["Competition from AWS Aurora Serverless and PlanetScale"],
            "opp_score": 94,
            "priority": "High",
            "score_factors": {
                "company_fit": 96,
                "growth_signal": 94,
                "hiring_signal": 90,
                "technology_signal": 98,
                "recent_activity": 95,
                "trigger_strength": 96,
                "decision_maker_availability": 88,
                "business_fit": 96,
                "technology_relevance": 98
            },
            "reasons": [
                "De facto backend choice for modern AI startups leveraging pgvector",
                "Launch Week releases provide constant buying and integration triggers",
                "Rapid enterprise tier adoption creating governance and compliance demands",
                "Highest technology alignment in modern database infrastructure"
            ],
            "positive_signals": ["Over 1M databases created", "Launch Week releases", "Leading host for AI pgvector"],
            "negative_signals": ["High inbound volume requires precise technical value proposition"],
            "evidence": "Launch Week announcements confirm over 1 million deployed databases and major enterprise feature rollouts.",
            "reasoning": "Supabase's dominance in pgvector hosting creates immense demand for AI workflow observability and enterprise security.",
            "confidence": "High",
            "recommended_action": "Contact CTO or Head of Product regarding enterprise database governance and vector tooling.",
            "contacts": [
                {
                    "name": "Paul Copplestone",
                    "job_title": "CEO & Co-Founder",
                    "is_persona": False,
                    "linkedin_url": "https://linkedin.com/in/paulcopplestone",
                    "relevance_reason": "Co-founder leading overall architecture, open-source governance, and strategic enterprise growth.",
                    "approach_now_reason": "Scaling enterprise customer tier and launching dedicated cloud instances.",
                    "source": "Official Supabase Leadership Page",
                    "confidence": "High"
                },
                {
                    "name": None,
                    "job_title": "Head of AI & Vector Infrastructure",
                    "is_persona": True,
                    "linkedin_url": None,
                    "relevance_reason": "Drives pgvector optimization, AI embeddings integrations, and LLM framework adoption.",
                    "approach_now_reason": "Managing hyper-growth in generative AI developers choosing Supabase.",
                    "source": "Strategic Persona Matching",
                    "confidence": "High"
                }
            ],
            "outreach": {
                "subject": "Supabase's pgvector scale & AI schema branching",
                "opening": "Incredible momentum on Launch Week and surpassing 1 million deployed PostgreSQL databases.",
                "main_message": "As thousands of teams spin up pgvector instances for generative AI, managing vector index rebuilds and schema migrations in production without read locks is a common pain point.",
                "call_to_action": "Would you be open to seeing how we optimize vector index caching for high-concurrency Postgres apps?",
                "personalization_reasons": ["Cited 1M deployed databases milestone", "Referenced Launch Week branching feature", "Focused on pgvector high-concurrency index caching"],
                "evidence_used": ["1 Million databases deployed", "Launch Week announcements", "pgvector AI dominance"]
            },
            "signals": [
                {
                    "signal_type": "Major Product Milestone",
                    "description": "Supabase announced general availability of Database Branching and Postgres 17 support.",
                    "meaningful": "Meaningful Signal",
                    "is_meaningful": True,
                    "worth_acting_on": True,
                    "recommended_action": "Reach out to technical leadership on database governance workflows.",
                    "source": "Launch Week Press Release"
                },
                {
                    "signal_type": "Hiring Growth",
                    "description": "Actively recruiting database reliability engineers and enterprise solutions architects.",
                    "meaningful": "Meaningful Signal",
                    "is_meaningful": True,
                    "worth_acting_on": True,
                    "recommended_action": "Engage enterprise solutions team.",
                    "source": "Supabase Careers"
                }
            ]
        },
        {
            "name": "Vercel",
            "website": "https://vercel.com",
            "description": "[DEMO SEED DATA] Vercel is the frontend cloud platform for Next.js, providing developer experience, preview deployments, serverless functions, and AI SDK infrastructure.",
            "industry": "Frontend Cloud & Developer Infrastructure",
            "products_services": ["Vercel Frontend Cloud", "Next.js", "v0 Generative UI", "Vercel AI SDK", "Edge Functions", "Vercel Analytics"],
            "target_customers": ["Enterprise engineering teams", "Frontend developers", "AI application creators"],
            "business_model": "Usage-based Cloud SaaS + Enterprise Contracts",
            "company_size": "550 employees",
            "locations": ["San Francisco, CA, USA", "Global Remote"],
            "sources": ["https://vercel.com/about", "https://vercel.com/blog", "https://techcrunch.com/vercel-series-e"],
            "confidence_score": "High",
            "data_conflicts": [
                {
                    "field": "company_size",
                    "source_a": "TechCrunch Funding Article (2024): 450 employees",
                    "source_b": "LinkedIn Company Page (2026): 580 employees",
                    "chosen_value": "550 employees (Approximate)",
                    "resolution_reasoning": "TechCrunch article is from 2024. LinkedIn data reflects current 2026 growth with verified engineering hires.",
                    "uncertainty_level": "Medium",
                    "display_status": "Conflicting"
                }
            ],
            "uncertainty_notes": "[DEMO SEED DATA] Headcount represents current estimated range between press releases and public directory data.",
            "hiring_signals": ["Hiring 15+ Enterprise Account Executives", "Hiring AI Systems Researchers for v0"],
            "growth_signals": ["Series E funding at $3.25B valuation", "Massive enterprise adoption of Next.js and v0"],
            "technology_signals": ["Next.js App Router", "Turbopack Rust bundler", "Vercel AI SDK with multi-model streaming"],
            "recent_events": ["Launched v0 for Enterprise teams", "Announced Next.js 15 with React 19 support"],
            "potential_opportunities": ["Partner on enterprise workflow integrations and AI SDK components"],
            "key_risks": ["Enterprise scrutiny around egress pricing and serverless compute costs"],
            "opp_score": 96,
            "priority": "High",
            "score_factors": {
                "company_fit": 98,
                "growth_signal": 96,
                "hiring_signal": 95,
                "technology_signal": 98,
                "recent_activity": 96,
                "trigger_strength": 98,
                "decision_maker_availability": 85,
                "business_fit": 98,
                "technology_relevance": 98
            },
            "reasons": [
                "Highest possible market momentum in frontend and generative UI tooling",
                "Aggressive enterprise tier push with v0 AI product expansion",
                "Massive ecosystem presence as creators of Next.js",
                "Multiple active hiring and product launch triggers"
            ],
            "positive_signals": ["v0 enterprise rollout", "Series E funding", "Next.js ecosystem dominance"],
            "negative_signals": ["Large organization requires navigating multi-layered decision hierarchies"],
            "evidence": "Announced $250M Series E, v0 enterprise launch, and 15+ strategic enterprise sales and engineering openings.",
            "reasoning": "Vercel's transformation into an AI-first frontend cloud creates urgent demand for enterprise tooling partnerships.",
            "confidence": "High",
            "recommended_action": "Reach out to VP of Engineering or Head of Enterprise Product regarding v0 enterprise integration.",
            "contacts": [
                {
                    "name": "Guillermo Rauch",
                    "job_title": "CEO & Founder",
                    "is_persona": False,
                    "linkedin_url": "https://linkedin.com/in/rauchg",
                    "relevance_reason": "Founder and visionary driving Vercel AI SDK, Next.js, and generative UI strategy.",
                    "approach_now_reason": "Leading the company's aggressive push into enterprise generative UI tooling.",
                    "source": "Official Vercel Leadership",
                    "confidence": "High"
                },
                {
                    "name": None,
                    "job_title": "VP of Engineering",
                    "is_persona": True,
                    "linkedin_url": None,
                    "relevance_reason": "Oversees edge network reliability, runtime execution, and enterprise customer SLA delivery.",
                    "approach_now_reason": "Scaling global infrastructure to handle massive AI SDK streaming workloads.",
                    "source": "Strategic Persona Matching",
                    "confidence": "High"
                }
            ],
            "outreach": {
                "subject": "Vercel's v0 enterprise scaling & AI SDK streaming",
                "opening": "Huge congratulations on the Series E announcement and the rapid enterprise traction of v0.",
                "main_message": "As enterprise engineering orgs standardize on the Vercel AI SDK, optimizing token streaming resilience across multi-region edge runtimes while controlling compute egress is top of mind.",
                "call_to_action": "Open to a brief conversation on how our telemetry engine helps enterprise teams monitor LLM streaming latency?",
                "personalization_reasons": ["Cited Series E funding", "Addressed v0 enterprise traction", "Focused on AI SDK multi-region streaming latency"],
                "evidence_used": ["Series E $250M raise", "v0 Enterprise launch", "Vercel AI SDK rollout"]
            },
            "signals": [
                {
                    "signal_type": "Funding Event",
                    "description": "Vercel secured $250M Series E financing at a $3.25B valuation to accelerate AI development.",
                    "meaningful": "Meaningful Signal",
                    "is_meaningful": True,
                    "worth_acting_on": True,
                    "recommended_action": "Target VP of Engineering with enterprise integration proposal.",
                    "source": "TechCrunch Announcement"
                },
                {
                    "signal_type": "Product Launch",
                    "description": "v0 Generative UI expanded to support enterprise private codebases and custom design systems.",
                    "meaningful": "Meaningful Signal",
                    "is_meaningful": True,
                    "worth_acting_on": True,
                    "recommended_action": "Engage product leadership on design system connectors.",
                    "source": "Vercel Product Blog"
                }
            ]
        },
        {
            "name": "Retool",
            "website": "https://retool.com",
            "description": "[DEMO SEED DATA] Retool is the fast way to build internal software, offering drag-and-drop UI components, database connectors, and AI workflow automation.",
            "industry": "Internal Tools & Enterprise Software",
            "products_services": ["Retool Apps", "Retool Workflows", "Retool AI", "Retool Database", "Retool Mobile"],
            "target_customers": ["Operations teams", "Engineering teams", "IT and business operations leaders"],
            "business_model": "Enterprise SaaS (User-based license)",
            "company_size": "400 employees",
            "locations": ["San Francisco, CA, USA", "New York, NY, USA", "London, UK"],
            "sources": ["https://retool.com/about", "https://retool.com/careers"],
            "confidence_score": "High",
            "data_conflicts": [],
            "uncertainty_notes": "[DEMO SEED DATA] Enterprise internal software leader with verified public features.",
            "hiring_signals": ["Hiring Enterprise Solutions Engineers in NYC", "Hiring AI Product Managers"],
            "growth_signals": ["Used by over 50% of the Fortune 500 for custom internal applications"],
            "technology_signals": ["React component engine", "Node.js sandbox execution", "Native integrations with 50+ databases"],
            "recent_events": ["Launched Retool AI with custom agent building and vector store integrations"],
            "potential_opportunities": ["Partner on external data connectors and real-time business intelligence"],
            "key_risks": ["Internal engineering teams building custom React dashboards in-house"],
            "opp_score": 84,
            "priority": "High",
            "score_factors": {
                "company_fit": 88,
                "growth_signal": 82,
                "hiring_signal": 80,
                "technology_signal": 88,
                "recent_activity": 85,
                "trigger_strength": 82,
                "decision_maker_availability": 82,
                "business_fit": 88,
                "technology_relevance": 88
            },
            "reasons": [
                "Proven enterprise market penetration across Fortune 500 operations",
                "Retool AI workflows open immediate avenues for sales automation",
                "Strong financial standing and sustained enterprise expansion"
            ],
            "positive_signals": ["Launched Retool AI", "Fortune 500 customer base", "Expansion in London & NYC"],
            "negative_signals": ["Longer enterprise procurement cycles"],
            "evidence": "Customer case studies verify massive Fortune 500 footprint; product releases highlight deep investments in Retool AI.",
            "reasoning": "Retool is empowering ops teams with AI; our intelligence engine can serve as an automated data provider for Retool workflows.",
            "confidence": "High",
            "recommended_action": "Reach out to Head of Product / VP Engineering on AI workflow integrations.",
            "contacts": [
                {
                    "name": "David Hsu",
                    "job_title": "CEO & Founder",
                    "is_persona": False,
                    "linkedin_url": "https://linkedin.com/in/david-hsu-retool",
                    "relevance_reason": "Founder setting product roadmap, developer experience, and enterprise expansion.",
                    "approach_now_reason": "Promoting Retool AI as the primary growth catalyst for enterprise accounts.",
                    "source": "Official Retool About Page",
                    "confidence": "High"
                }
            ],
            "outreach": {
                "subject": "Retool AI & automated company data connectors",
                "opening": "Really impressed with how seamlessly Retool AI enables teams to orchestrate LLM workflows alongside internal databases.",
                "main_message": "As enterprise customers build custom sales and ops workflows in Retool, feeding them clean, real-time company intelligence without writing custom scraper scripts accelerates app build times.",
                "call_to_action": "Open to a quick exchange on building a verified company intelligence connector for Retool Workflows?",
                "personalization_reasons": ["Cited Retool AI workflow launch", "Addressed enterprise ops app use case", "Proposed native data connector synergy"],
                "evidence_used": ["Retool AI launch", "Retool Workflows adoption", "Fortune 500 enterprise footprint"]
            },
            "signals": [
                {
                    "signal_type": "Product Launch",
                    "description": "Retool announced native Vector Storage and LLM Agent orchestration within Retool Workflows.",
                    "meaningful": "Meaningful Signal",
                    "is_meaningful": True,
                    "worth_acting_on": True,
                    "recommended_action": "Explore partner integration for sales intelligence workflows.",
                    "source": "Retool Release Notes"
                }
            ]
        },
        {
            "name": "Pinecone",
            "website": "https://pinecone.io",
            "description": "[DEMO SEED DATA] Pinecone is the leading managed vector database for high-performance AI applications, providing serverless vector search with low latency and enterprise scale.",
            "industry": "Artificial Intelligence & Vector Database Infrastructure",
            "products_services": ["Pinecone Serverless", "Vector Search API", "Hybrid Search", "Pinecone Assistant"],
            "target_customers": ["AI developers", "Enterprise LLM architects", "Search and recommendation engineers"],
            "business_model": "Usage-based Serverless Infrastructure",
            "company_size": "160 employees",
            "locations": ["San Francisco, CA, USA", "New York, NY, USA", "Tel Aviv, Israel"],
            "sources": ["https://pinecone.io/about", "https://techcrunch.com/pinecone-series-b"],
            "confidence_score": "High",
            "data_conflicts": [],
            "uncertainty_notes": "[DEMO SEED DATA] High data consistency backed by technical whitepapers and cloud partner listings.",
            "hiring_signals": ["Hiring 10+ Distributed Systems Engineers", "Hiring Solutions Architects in EMEA"],
            "growth_signals": ["Serverless architecture adoption reduced vector search costs by up to 50x", "Rapid enterprise onboarding across AWS/Azure"],
            "technology_signals": ["Rust/C++ vector indexing algorithms", "Blob-storage decoupled serverless architecture", "Multi-cloud Kubernetes foundation"],
            "recent_events": ["Launched Pinecone Serverless on AWS and Azure", "Introduced Pinecone Assistant for conversational retrieval"],
            "potential_opportunities": ["Partner on B2B intelligence semantic search and embeddings pipeline"],
            "key_risks": ["Competition from PostgreSQL pgvector and specialized open-source alternatives"],
            "opp_score": 91,
            "priority": "High",
            "score_factors": {
                "company_fit": 94,
                "growth_signal": 92,
                "hiring_signal": 88,
                "technology_signal": 96,
                "recent_activity": 90,
                "trigger_strength": 92,
                "decision_maker_availability": 85,
                "business_fit": 94,
                "technology_relevance": 96
            },
            "reasons": [
                "Crucial infrastructure layer for generative AI search and RAG applications",
                "Recent rollout of Pinecone Serverless significantly expands market reach",
                "Active recruitment in distributed systems infrastructure indicates rapid customer scaling",
                "High technical alignment with AI-native intelligence solutions"
            ],
            "positive_signals": ["Pinecone Serverless launch", "Decoupled architecture innovation", "Strong enterprise RAG adoption"],
            "negative_signals": ["Intense rivalry from database incumbents adding vector search"],
            "evidence": "Technical documentation and AWS marketplace partnership verify general availability of serverless vector indexing.",
            "reasoning": "Pinecone's enterprise RAG expansion requires enriched metadata and verified entity intelligence to maximize retrieval quality.",
            "confidence": "High",
            "recommended_action": "Reach out to CTO or Head of Product regarding metadata enrichment for enterprise vector search.",
            "contacts": [
                {
                    "name": "Edo Liberty",
                    "job_title": "Founder & CEO",
                    "is_persona": False,
                    "linkedin_url": "https://linkedin.com/in/edo-liberty",
                    "relevance_reason": "Renowned machine learning scientist and founder guiding vector search architecture.",
                    "approach_now_reason": "Promoting serverless vector indexing for high-scale enterprise applications.",
                    "source": "Official Pinecone Leadership",
                    "confidence": "High"
                },
                {
                    "name": None,
                    "job_title": "VP of Engineering",
                    "is_persona": True,
                    "linkedin_url": None,
                    "relevance_reason": "Oversees distributed query execution, latency optimization, and multi-cloud reliability.",
                    "approach_now_reason": "Managing scaling demands of thousands of production serverless vector indexes.",
                    "source": "Strategic Persona Matching",
                    "confidence": "High"
                }
            ],
            "outreach": {
                "subject": "Pinecone Serverless & metadata-rich vector search",
                "opening": "Loved reading your deep dive on decoupling compute from storage in Pinecone Serverless.",
                "main_message": "As developers build production RAG systems on Pinecone, hybrid search accuracy heavily hinges on high-cardinality metadata filtering without latency spikes.",
                "call_to_action": "Would you be open to a 5-minute chat on how our automated entity classification enriches vector metadata payloads?",
                "personalization_reasons": ["Cited decoupled serverless architecture", "Addressed RAG hybrid search accuracy", "Focused on high-cardinality metadata filtering"],
                "evidence_used": ["Pinecone Serverless launch", "RAG adoption metrics", "Decoupled storage innovation"]
            },
            "signals": [
                {
                    "signal_type": "Architecture Innovation",
                    "description": "Launched Pinecone Serverless, decoupling compute from storage to dramatically lower RAG index costs.",
                    "meaningful": "Meaningful Signal",
                    "is_meaningful": True,
                    "worth_acting_on": True,
                    "recommended_action": "Engage VP of Engineering on metadata enrichment pipelines.",
                    "source": "Pinecone Technical Blog"
                }
            ]
        }
    ]

    seeded_count = 0
    for data in demo_companies:
        # Check if company already exists
        comp = db.query(Company).filter(Company.name == data["name"]).first()
        if not comp:
            comp = Company(name=data["name"], website=data["website"])
            db.add(comp)
            db.commit()
            db.refresh(comp)

        # Research Record
        existing_res = db.query(CompanyResearch).filter(CompanyResearch.company_id == comp.id).first()
        if not existing_res:
            res = CompanyResearch(
                company_id=comp.id,
                description=data["description"],
                industry=data["industry"],
                products_services=data["products_services"],
                target_customers=data["target_customers"],
                business_model=data["business_model"],
                company_size=data["company_size"],
                locations=data["locations"],
                sources=data["sources"],
                confidence_score=data["confidence_score"],
                data_conflicts=data["data_conflicts"],
                uncertainty_notes=data["uncertainty_notes"],
                hiring_signals=data["hiring_signals"],
                growth_signals=data["growth_signals"],
                technology_signals=data["technology_signals"],
                recent_events=data["recent_events"],
                potential_opportunities=data["potential_opportunities"],
                key_risks=data["key_risks"]
            )
            db.add(res)
            db.commit()
            db.refresh(res)

            # Snapshots (create 2 for temporal diffing demonstration)
            old_snapshot_data = dict(data)
            old_snapshot_data["description"] = f"[BASELINE 2025 SNAPSHOT] Earlier state of {data['name']}"
            snap1 = ResearchSnapshot(
                company_id=comp.id,
                snapshot_data=old_snapshot_data,
                change_summary="Initial baseline snapshot from Q4 2025",
                created_at=datetime.now(timezone.utc) - timedelta(days=90)
            )
            snap2 = ResearchSnapshot(
                company_id=comp.id,
                snapshot_data=data,
                change_summary="Current updated snapshot with active signals",
                created_at=datetime.now(timezone.utc)
            )
            db.add_all([snap1, snap2])

            # Sources
            for s_url in data["sources"]:
                src = Source(
                    company_id=comp.id,
                    url=s_url,
                    source_name=f"[DEMO SEED SOURCE] {data['name']}",
                    source_type="Official Website" if "about" in s_url or "careers" in s_url else "Industry Publication",
                    reliability_tier="High",
                    snippet=f"Verified public intelligence for {data['name']} retrieved during seed initialization."
                )
                db.add(src)

            # Opportunity
            opp = Opportunity(
                company_id=comp.id,
                score=data["opp_score"],
                priority=data["priority"],
                score_factors=data["score_factors"],
                reasons=data["reasons"],
                positive_signals=data["positive_signals"],
                negative_signals=data["negative_signals"],
                evidence=data["evidence"],
                reasoning=data["reasoning"],
                confidence=data["confidence"],
                recommended_action=data["recommended_action"]
            )
            db.add(opp)

            # Contacts
            saved_people = []
            for c_info in data["contacts"]:
                person = Person(
                    company_id=comp.id,
                    name=c_info["name"],
                    job_title=c_info["job_title"],
                    is_persona=c_info["is_persona"],
                    linkedin_url=c_info["linkedin_url"],
                    relevance_reason=c_info["relevance_reason"],
                    approach_now_reason=c_info["approach_now_reason"],
                    source=c_info["source"],
                    confidence=c_info["confidence"]
                )
                db.add(person)
                saved_people.append(person)
            db.commit()

            # Outreach
            if saved_people:
                outreach_info = data["outreach"]
                outreach = Outreach(
                    company_id=comp.id,
                    person_id=saved_people[0].id,
                    subject=outreach_info["subject"],
                    opening=outreach_info["opening"],
                    body=f"{outreach_info['opening']}\n\n{outreach_info['main_message']}\n\n{outreach_info['call_to_action']}",
                    main_message=outreach_info["main_message"],
                    call_to_action=outreach_info["call_to_action"],
                    personalization_reasons=outreach_info["personalization_reasons"],
                    evidence_used=outreach_info["evidence_used"]
                )
                db.add(outreach)

            # Signals
            for sig_info in data["signals"]:
                sig = Signal(
                    company_id=comp.id,
                    signal_type=sig_info["signal_type"],
                    description=sig_info["description"],
                    meaningful=sig_info["meaningful"],
                    is_meaningful=sig_info["is_meaningful"],
                    worth_acting_on=sig_info["worth_acting_on"],
                    recommended_action=sig_info["recommended_action"],
                    source=sig_info["source"]
                )
                db.add(sig)

            db.commit()
            seeded_count += 1
            print(f"✓ Seeded company: {data['name']} (Score: {data['opp_score']}, Contacts: {len(data['contacts'])}, Signals: {len(data['signals'])})")
        else:
            print(f"• Company {data['name']} already initialized in DB.")

    db.close()
    print("=" * 60)
    print(f"SEED DATA COMPLETED: {seeded_count} new realistic demo companies seeded.")
    print("=" * 60)

if __name__ == "__main__":
    run_seed()
