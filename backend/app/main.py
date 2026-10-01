from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.companies import router as companies_router
from app.routes.opportunities import router as opportunities_router
from app.routes.people import router as people_router
from app.routes.outreach import router as outreach_router
from app.routes.signals import router as signals_router
from app.routes.dashboard import router as dashboard_router

app = FastAPI(
    title="ANAIKA AI Company Intelligence & Opportunity Engine API",
    description="Production-grade API for company intelligence, multi-factor opportunity scoring, persona identification, tailored outreach, trigger detection, and data reliability resolution.",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(companies_router)
app.include_router(opportunities_router)
app.include_router(people_router)
app.include_router(outreach_router)
app.include_router(signals_router)
app.include_router(dashboard_router)

@app.get("/")
def home():
    return {
        "status": "healthy",
        "service": "ANAIKA AI Company Intelligence & Opportunity Engine",
        "version": "2.0.0",
        "docs_url": "/docs"
    }