import requests
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

BACKEND_URL = "http://127.0.0.1:8000"
FRONTEND_URL = "http://localhost:3000"

print("=" * 60)
print("TASK 5 AUTOMATION - VERIFICATION SUITE")
print("=" * 60)

# 1. Test Swagger docs
print("\n[1] Checking Swagger /docs endpoint...")
docs_r = requests.get(f"{BACKEND_URL}/docs")
assert docs_r.status_code == 200, f"Docs failed with {docs_r.status_code}"
openapi_r = requests.get(f"{BACKEND_URL}/openapi.json")
assert openapi_r.status_code == 200, f"OpenAPI failed with {openapi_r.status_code}"
paths = openapi_r.json().get("paths", {})
assert "/api/companies/pipeline" in paths, "Missing POST /api/companies/pipeline"
assert "/api/companies/{company_id}/pipeline" in paths, "Missing POST /api/companies/{company_id}/pipeline"
print("✓ Swagger /docs is accessible and contains pipeline endpoints.")

# 2. Test Pipeline API directly
print("\n[2] Testing Pipeline API POST /api/companies/pipeline...")
payload = {"name": "Zoho", "website": "https://www.zoho.com"}
pipe_r = requests.post(f"{BACKEND_URL}/api/companies/pipeline", json=payload, timeout=60)
assert pipe_r.status_code == 200, f"Pipeline returned {pipe_r.status_code}: {pipe_r.text}"
data = pipe_r.json()
print("✓ Pipeline API response received:")
print(f"   success: {data.get('success')}")
print(f"   company_id: {data.get('company_id')}")
print(f"   company_name: {data.get('company_name')}")
print(f"   research_created: {data.get('research_created')}")
print(f"   opportunity_created: {data.get('opportunity_created')}")
print(f"   personas_created: {data.get('personas_created')}")
print(f"   outreach_generated: {data.get('outreach_generated')}")
print(f"   signals_detected: {data.get('signals_detected')}")
print(f"   pipeline_completed: {data.get('pipeline_completed')}")

cid = data.get("company_id")
assert data.get("success") is True
assert data.get("pipeline_completed") is True
assert data.get("research_created") is True
assert data.get("opportunity_created") is True
assert data.get("personas_created") is True
assert data.get("outreach_generated") is True

# 3. Verify PostgreSQL Database
print(f"\n[3] Verifying PostgreSQL records for Company {cid}...")
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "backend"))
from app.database import engine
from sqlalchemy import text

with engine.connect() as conn:
    comp = conn.execute(text(f"SELECT id, name, website FROM companies WHERE id = {cid}")).fetchone()
    print(f"✓ Company in DB: {comp}")
    assert comp is not None

    research = conn.execute(text(f"SELECT id, description, industry, confidence_score, sources FROM company_research WHERE company_id = {cid}")).fetchall()
    print(f"✓ Research records in DB: {len(research)} (Latest ID: {research[-1][0]}, Industry: {research[-1][2]}, Confidence: {research[-1][3]})")
    assert len(research) >= 1

    opps = conn.execute(text(f"SELECT id, score, recommended_action FROM opportunities WHERE company_id = {cid}")).fetchall()
    print(f"✓ Opportunity records in DB: {len(opps)} (Score: {opps[0][1]}/100)")
    assert len(opps) >= 1

    people = conn.execute(text(f"SELECT id, job_title, relevance_reason FROM people WHERE company_id = {cid}")).fetchall()
    print(f"✓ Personas in DB: {len(people)} personas")
    for p in people:
        print(f"   - ID {p[0]}: {p[1]}")
    assert len(people) >= 1

    outreaches = conn.execute(text(f"SELECT id, person_id, subject FROM outreaches WHERE company_id = {cid}")).fetchall()
    print(f"✓ Outreach drafts in DB: {len(outreaches)} drafts")
    for o in outreaches:
        print(f"   - ID {o[0]} (Persona {o[1]}): {o[2]}")
    assert len(outreaches) >= 1

    signals = conn.execute(text(f"SELECT id, signal_type, description FROM signals WHERE company_id = {cid}")).fetchall()
    print(f"✓ Trigger signals in DB: {len(signals)} signals")
    for s in signals:
        print(f"   - [{s[1]}]: {s[2][:70]}...")
    assert len(signals) >= 1

# 4. Verify Frontend Page
print(f"\n[4] Verifying Frontend SSR for /companies/{cid}...")
front_r = requests.get(f"{FRONTEND_URL}/companies/{cid}")
assert front_r.status_code == 200, f"Frontend returned {front_r.status_code}"
html = front_r.text

checks = {
    "Company Name (Zoho)": "Zoho" in html,
    "Run Full AI Pipeline Button": "Run Full AI Pipeline" in html,
    "Opportunity Scoring Section": "Opportunity Scoring" in html,
    "Company Intelligence Section": "Company Intelligence" in html,
    "Industry Data": "Software as a Service" in html,
    "Recommended Personas Section": "Recommended Personas" in html,
    "Personalised Outreach Section": "Personalised Outreach" in html,
    "Data Reliability Card": "Data Reliability" in html,
    "Temporal Trigger Signals Section": "Temporal Trigger Signals" in html,
}

for label, passed in checks.items():
    print(f"✓ Frontend check '{label}': {'PASS' if passed else 'FAIL'}")
    assert passed, f"Frontend missing {label}"

print("\n" + "=" * 60)
print("ALL TASK 5 REQUIREMENTS VERIFIED SUCCESSFULLY: PASS")
print("=" * 60)
