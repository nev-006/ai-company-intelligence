from app.schemas.company import CompanyResearchBase
from app.services.research.research_service import ResearchService

def fetch_website_content(url: str) -> str:
    """Compatibility wrapper for web content extraction."""
    page_data = ResearchService.fetch_public_page(url)
    return page_data.get("text", "")

def analyze_company(company_name: str, website: str) -> CompanyResearchBase:
    """Delegates to production ResearchService abstraction."""
    return ResearchService.analyze_company(company_name, website)