# ANAIKA Intelligence — AI-Powered B2B Opportunity Engine

> **Production-Grade Autonomous B2B Company Intelligence, Opportunity Scoring, Contact Discovery, and Outreach Platform**  
> Evaluated for the ANAIKA Product Engineer Candidate Assessment.

---

## 1. Product Overview

**ANAIKA Intelligence** is an AI-native B2B sales intelligence and opportunity prioritization platform. Traditional sales intelligence platforms overwhelm account executives with hundreds of noisy leads. ANAIKA Intelligence solves this by ingesting company websites, autonomously researching public company intelligence, evaluating fit across an explainable 7-factor opportunity framework, discovering targeted technical decision makers, drafting grounded non-generic outreach, detecting temporal buying signals, and resolving conflicting data across sources with transparent uncertainty metrics.

### Key Value Pillars
- **Autonomous End-to-End Pipeline**: A single URL input initiates web crawling, LLM structured extraction, 7-factor opportunity scoring, persona extraction, outreach drafting, and Postgres persistence.
- **Explainable 7-Factor Scoring**: Replaces arbitrary AI scores with a weighted, multi-factor framework (Company Fit, Growth, Hiring, Tech Stack, Activity, Trigger Urgency, and Buyer Availability).
- **Anti-Hallucination Contact Engine**: Strictly differentiates confirmed individuals from strategic personas to prevent fabricating executive identities.
- **Contextual Outreach**: Employs cold email best practices (under 120 words, concrete company hooks, low-friction conversational CTAs, zero generic spam templates).
- **Temporal Trigger Diffing**: Stores immutable research snapshots over time and diffs consecutive versions to separate high-yield buying signals (e.g. engineering hiring surges) from marketing noise (e.g. copyright year bumps).
- **Transparent Data Reliability**: Explicitly adjudicates contradictory data across sources (e.g. headcount differences) with source-tier weighting, recency preference, and uncertainty level labeling.
- **"Act Today" (Top 5 Actions Only)**: Fulfills the executive requirement change: dynamically curating the **Top 5 accounts worth acting on today** with explicit selection rationales rather than dumping a 100-row backlog.

---

## 2. Architecture

```
                       ┌───────────────────────────────┐
                       │   Target Company Website URL  │
                       └───────────────┬───────────────┘
                                       │
                                       ▼
                       ┌───────────────────────────────┐
                       │    ResearchService Layer      │
                       │ (Polite HTML Crawl & Metadata)│
                       └───────────────┬───────────────┘
                                       │
                                       ▼
                       ┌───────────────────────────────┐
                       │      AI / LLM Service         │
                       │   (Modular Prompt Templates)  │
                       │  Gemini 2.5 / 3.8 Flash SDK   │
                       └───────────────┬───────────────┘
                                       │
             ┌─────────────────────────┼─────────────────────────┐
             ▼                         ▼                         ▼
   ┌───────────────────┐     ┌───────────────────┐     ┌───────────────────┐
   │Structured Research│     │7-Factor Opp Score │     │Decision Personas  │
   │  & Provenance     │     │  & Priority       │     │& Anti-Hallucinate │
   └─────────┬─────────┘     └─────────┬─────────┘     └─────────┬─────────┘
             │                         │                         │
             └─────────────────────────┼─────────────────────────┘
                                       │
                                       ▼
                       ┌───────────────────────────────┐
                       │  Personalized Outreach Engine │
                       │ (Contextual Hooks & Evidence) │
                       └───────────────┬───────────────┘
                                       │
                                       ▼
                       ┌───────────────────────────────┐
                       │   Temporal Trigger Engine     │
                       │  (Snapshot Diff vs Baseline)  │
                       │   Meaningful Signal vs Noise  │
                       └───────────────┬───────────────┘
                                       │
                                       ▼
                       ┌───────────────────────────────┐
                       │  PostgreSQL Relational DB     │
                       │  (Companies, Research, Opps,  │
                       │   Contacts, Outreaches, etc.) │
                       └───────────────┬───────────────┘
                                       │
                                       ▼
                       ┌───────────────────────────────┐
                       │  Top 5 Action Prioritizer     │
                       │ (Dynamic Daily Curation v2.0) │
                       └───────────────┬───────────────┘
                                       │
                                       ▼
                       ┌───────────────────────────────┐
                       │   Next.js 16 B2B Dashboard    │
                       │  /act-today  •  /companies    │
                       └───────────────────────────────┘
```

---

## 3. Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Turbopack.
- **Backend**: Python 3.13, FastAPI, Pydantic v2 (Strict Schema Validation), SQLAlchemy 2.0.
- **Database**: PostgreSQL (with relational foreign keys, cascading deletions, and compatibility views).
- **AI & Reasoning**: Google GenAI SDK (Gemini 2.5 Flash / Gemini 3.8 Flash) with structured JSON schemas and model fallback cascade.
- **HTML Extraction**: BeautifulSoup4, Requests, urllib3 with polite bot headers.
- **Automation & Integrations**: REST APIs, n8n-compatible webhook architecture (`automation/n8n_workflow.json`).
- **Testing**: Pytest, FastAPI TestClient, SQLAlchemy live integration test suite.

---

## 4. Setup Instructions

### Prerequisites
- Python 3.11+ (tested on Python 3.13)
- Node.js 18+ and npm
- PostgreSQL database running locally or remotely

### Quick Start

#### 1. Backend Setup
```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
pip install pytest httpx

# Configure environment
cp .env.example .env
# Ensure DATABASE_HOST, DATABASE_NAME, DATABASE_USER, DATABASE_PASSWORD, and GEMINI_API_KEY are configured

# Seed demo dataset (Linear, PostHog, Supabase, Vercel, Retool, Pinecone, Stripe)
python seed_data.py

# Start FastAPI development server
uvicorn app.main:app --reload --port 8000
```
Interactive Swagger API documentation: `http://127.0.0.1:8000/docs`

#### 2. Frontend Setup
```powershell
cd frontend
npm install
npm run dev
```
Web application: `http://localhost:3000`

---

## 5. Environment Variables

Create `.env` in `backend/` with the following variables:

| Variable | Description | Example |
|---|---|---|
| `DATABASE_HOST` | PostgreSQL hostname | `localhost` |
| `DATABASE_PORT` | PostgreSQL port | `5432` |
| `DATABASE_NAME` | PostgreSQL database name | `company_intelligence` |
| `DATABASE_USER` | PostgreSQL user | `postgres` |
| `DATABASE_PASSWORD` | PostgreSQL password | `your_postgres_password` |
| `GEMINI_API_KEY` | Google Gemini API Key | `AIzaSy...` |
| `GEMINI_MODEL` | Preferred model (optional, defaults to `gemini-2.5-flash`) | `gemini-2.5-flash` |

*Security Note: Sensitive API keys and database credentials are never bundled in frontend artifacts or public repos.*

---

## 6. Database Setup

The database schema is defined via SQLAlchemy in `backend/app/models/company.py` and exported as pure DDL in `database/schema.sql`.

### Relational Schema (8 Core Tables & Compatibility Views):
1. **`companies`**: Primary target company record (`id`, `name`, `website`, `created_at`, `updated_at`).
2. **`company_research`** (View: `research`): Structured intelligence, market analysis, hiring signals, growth indicators, tech signals, sources, confidence, and conflict notes.
3. **`research_snapshots`**: Immutable historical records of company state at discrete points in time used for temporal diffing.
4. **`sources`**: Tracked provenance records (`url`, `source_name`, `source_type`, `reliability_tier`, `retrieved_at`, `snippet`).
5. **`opportunities`**: 7-factor scoring records (`score`, `priority`, `score_factors`, `reasons`, `positive_signals`, `negative_signals`, `evidence`, `reasoning`, `recommended_action`).
6. **`people`** (View: `contacts`): Target personas & confirmed individuals (`name`, `job_title`, `is_persona`, `linkedin_url`, `relevance_reason`, `approach_now_reason`, `source`, `confidence`).
7. **`outreaches`** (View: `outreach`): Personalized first-touch emails (`subject`, `opening`, `main_message`, `body`, `call_to_action`, `evidence_used`, `personalization_reasons`).
8. **`signals`** (View: `triggers`): Operational buying signals and marketing noise (`signal_type`, `description`, `meaningful`, `is_meaningful`, `worth_acting_on`, `recommended_action`, `source`).

---

## 7. How AI Integration Works

Prompts are strictly separated from route files and maintained as modular templates in `backend/app/services/ai/prompts/`:
- `company_research.txt`
- `opportunity_scoring.txt`
- `contact_reasoning.txt`
- `outreach.txt`
- `trigger_detection.txt`
- `reliability.txt`

### Structured Output Engine (`llm_service.py`):
1. **Template Rendering**: Dynamically injects company research and signal context into prompt variables.
2. **Native JSON Schema Enforcement**: Uses the Google GenAI SDK `response_schema` mode bound to Pydantic models.
3. **Model Fallback Cascade**: If the primary configured model (`gemini-2.5-flash`) encounters a transient rate limit (429) or server error (503), it applies exponential backoff and automatically falls back across lighter alternatives (`gemini-3.1-flash-lite`, `gemini-3.6-flash`, `gemini-3.8-flash`).
4. **Automatic JSON Repair**: Cleanses markdown code blocks and trailing commas before passing to Pydantic validation.

---

## 8. How Research Works

The research pipeline is encapsulated behind the `ResearchService` abstraction:
1. **Safe Extraction**: Polite User-Agent identification, HTML tag stripping (scripts, styles, navigation bars), and timeout limits (8s).
2. **Metadata Harvesting**: Title tags, OpenGraph descriptions, and core body copy extracted and normalized.
3. **Provenance Capture**: Tracks official source URLs and timestamps in the `sources` table.
4. **Snapshot Persistence**: Automatically archives each research execution into `research_snapshots` so future runs can compute temporal deltas.

---

## 9. Opportunity Scoring Logic (Task 2)

Rather than asking the LLM for a black-box number, scoring is computed via a 7-Factor Framework (0–100):
1. **Company Fit (20%)**: Alignment with high-growth B2B software ideal customer profile.
2. **Growth Signal (15%)**: Funding rounds, customer milestones, ARR expansion.
3. **Hiring Signal (15%)**: Active engineering and leadership recruitment velocity.
4. **Technology Signal (15%)**: Modern cloud infrastructure, API adoption, AI initiatives.
5. **Recent Activity (15%)**: Major product releases, conferences, technical blog posts.
6. **Trigger Strength (10%)**: Urgency created by active buying signals.
7. **Decision Maker Availability (10%)**: Presence of identified technical buyers (CTO, VP Eng).

### Explainability Output:
- Overall Score (0–100) & Priority (`High`, `Medium`, `Low`)
- 7 individual factor scores
- Concrete factual evidence quote
- Strategic sales reasoning
- Positive growth signals & negative friction points
- Concrete recommended next action

---

## 10. Trigger Detection Logic (Task 6)

The engine stores immutable company research snapshots across time. When new research is generated:
1. **Snapshot Comparison**: Compares previous snapshot with current snapshot.
2. **Signal Separation**:
   - **Meaningful Signal**: Real business events that open a timely sales window (e.g. "Linear posted 8 new senior distributed systems engineering roles in the past 14 days" → Action: "Initiate outreach to Head of Engineering referencing sync infrastructure challenges").
   - **Marketing Noise**: Superficial cosmetic copy changes (e.g. "Updated footer copyright from 2025 to 2026" → Action: "Ignore routine marketing noise").
3. **Trigger History View**: All historic snapshots and detected signals can be explored on `/companies/[id]/triggers`.

---

## 11. Data Reliability Approach (Task 7)

When conflicting information exists across public sources (e.g. LinkedIn reports 120 employees vs. Company Careers page reports 85 team members):
1. **Source Tiering**: Primary company-maintained sources supersede third-party scrapers or directories.
2. **Recency Weighting**: Current 2026 releases supersede dated 2023 articles.
3. **Explicit Adjudication**: Stores `selected_value`, `source_a`, `source_b`, `resolution_reasoning`, and `uncertainty_level`.
4. **Transparent Communication**: Displays uncertainty badges (`Verified`, `Inferred`, `Conflicting`, `Unknown`) directly on the UI so sales reps understand data pedigree.

---

## 12. API Documentation

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/companies/analyze` | Ingests company URL/name and returns structured company intelligence. |
| `POST` | `/api/companies/pipeline` | Runs the complete end-to-end pipeline in a single call. |
| `GET` | `/api/companies/` | Lists all ingested companies. |
| `GET` | `/api/companies/{id}` | Gets company record by ID. |
| `POST` | `/api/companies/{id}/research` | Triggers live research update for company. |
| `POST` | `/api/companies/{id}/score` | Calculates 7-factor opportunity score for company. |
| `GET` | `/api/companies/{id}/contacts` | Retrieves identified decision makers and personas. |
| `POST` | `/api/companies/{id}/outreach` | Generates personalized contextual outreach email. |
| `POST` | `/api/companies/{id}/trigger-check`| Diffs research snapshots and detects operational buying triggers. |
| `GET` | `/api/companies/{id}/snapshots` | Gets historical snapshot records. |
| `GET` | `/api/companies/{id}/sources` | Gets tracked research sources and provenance. |
| `GET` | `/api/dashboard/today` | **Act Today**: Returns the Top 5 prioritized actions with explainability rationales. |

---

## 13. Frontend Navigation & Pages

- **`/` (Dashboard)**: Executive view with dynamic Top 5 Focus, monitored backlog, and metric stats.
- **`/act-today` (Act Today)**: Dedicated executive prioritization interface answering *"What are the 5 things worth acting on today?"* with selection rationales.
- **`/companies` (All Companies)**: Complete table and search directory of all ingested target accounts.
- **`/companies/add` (Add & Analyze Company)**: Dedicated company ingestion workflow with live multi-stage progress stepper.
- **`/companies/[id]` (Company Intelligence)**: Full intelligence deep-dive covering products, size, target customers, data reliability card, and quick actions.
- **`/companies/[id]/opportunity` (Opportunity Analysis)**: Deep dive into the 7-factor score, evidence, and positive/negative signals.
- **`/companies/[id]/contacts` (Relevant Contacts)**: Persona discovery with clear anti-hallucination labeling.
- **`/companies/[id]/outreach` (Personalized Outreach)**: Cold email generator with copy-to-clipboard, opening hook, value prop, and cited evidence.
- **`/companies/[id]/triggers` (Trigger History)**: Temporal diff stream separating meaningful triggers from noise.
- **`/opportunities`**: Global directory of opportunity rankings.
- **`/contacts`**: Global directory of decision makers and personas.
- **`/triggers`**: Global stream of detected buying triggers.
- **`/outreach`**: Global library of generated outreach drafts.

---

## 14. Testing & Verification

### Run Automated Backend Unit & Integration Tests
```powershell
cd backend
.\venv\Scripts\pytest.exe tests/ -v
```
All 13 automated tests cover:
- Opportunity scoring & priority calculations
- Meaningful trigger vs marketing noise separation
- Data reliability adjudication & uncertainty levels
- Top 5 selection algorithm & descending ranking
- FastAPI route validation & 404 contracts

### Run Full Pipeline End-to-End Test Suite
```powershell
python test_task5_complete.py
```
Validates OpenAPI docs, live pipeline execution, PostgreSQL record verification across all tables, and Frontend SSR rendering.

---

## 15. Product Decisions & Rationale

1. **Why Top 5 Instead of 100 Leads?** Sales reps experience choice paralysis when faced with 100 leads. Focusing on the top 5 with clear *Why Selected* rationales drives immediate action on the highest-probability opportunities.
2. **Why Personas When Real Names Aren't Verified?** Fabricating fake employee names destroys credibility. If an executive name isn't officially verified, the engine labels the target as a "Strategic Persona" (e.g. VP of Engineering), defining the ideal title to seek on LinkedIn.
3. **Why Filter Marketing Noise?** Website copy edits occur daily. Without filtering, noise buries critical triggers like funding events or senior infrastructure hiring spikes.

---

## 16. Known Limitations & Future Improvements

- **Authentication / Multi-Tenancy**: The current MVP operates in single-tenant mode; multi-workspace user auth can be added via Supabase Auth or Clerk.
- **Automated Webhook Ingestion**: Integrates with n8n; future versions could ingest RSS/Atom feeds or SEC EDGAR filings on a scheduled cron job.
- **CRM Sync**: Direct export to Salesforce / HubSpot via bi-directional webhook sync.
