import requests
from bs4 import BeautifulSoup
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session

from app.schemas.company import CompanyResearchBase, DataConflictItem
from app.services.ai.llm_service import render_prompt, generate_structured_llm
from app.models.company import ResearchSnapshot, Source

class ResearchService:
    """
    Production-ready research service abstraction.
    Handles polite web extraction, content normalization, provenance tracking,
    LLM reasoning integration, and research snapshot persistence.
    """

    USER_AGENT = (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.0.0 Safari/537.36 (AnaikaBot/1.0; Public B2B Research)"
    )

    @staticmethod
    def normalize_url(url: str) -> str:
        """Sanitizes and normalizes a target company URL."""
        if not url:
            return ""
        clean = url.strip()
        if not clean.startswith(("http://", "https://")):
            clean = "https://" + clean
        return clean.rstrip("/")

    @classmethod
    def fetch_public_page(cls, url: str, timeout: int = 8) -> Dict[str, Any]:
        """Politely fetches public HTML content and extracts clean structured text."""
        target_url = cls.normalize_url(url)
        headers = {
            "User-Agent": cls.USER_AGENT,
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9"
        }

        try:
            resp = requests.get(target_url, headers=headers, timeout=timeout)
            resp.raise_for_status()

            soup = BeautifulSoup(resp.text, "html.parser")

            # Remove non-content elements
            for tag in soup(["script", "style", "nav", "footer", "noscript", "svg"]):
                tag.extract()

            # Extract metadata
            title = soup.title.string.strip() if soup.title and soup.title.string else ""
            meta_desc = ""
            desc_tag = soup.find("meta", attrs={"name": "description"}) or soup.find("meta", attrs={"property": "og:description"})
            if desc_tag and desc_tag.get("content"):
                meta_desc = desc_tag["content"].strip()

            text_content = soup.get_text(separator=" ", strip=True)

            return {
                "success": True,
                "url": target_url,
                "title": title,
                "meta_description": meta_desc,
                "text": text_content[:20000],
                "retrieved_at": datetime.now(timezone.utc).isoformat()
            }

        except Exception as e:
            return {
                "success": False,
                "url": target_url,
                "title": "",
                "meta_description": "",
                "text": f"Public research limited: {str(e)}",
                "retrieved_at": datetime.now(timezone.utc).isoformat(),
                "error": str(e)
            }

    @classmethod
    def analyze_company(cls, company_name: str, website: str) -> CompanyResearchBase:
        """
        Executes comprehensive company research via clean abstraction:
        1. Fetch public website & metadata
        2. Format prompt using template
        3. Pass to LLM structured engine
        4. Validate against Pydantic schema
        """
        page_data = cls.fetch_public_page(website)
        
        prompt = render_prompt("company_research.txt", {
            "company_name": company_name,
            "website": website,
            "website_content": f"Page Title: {page_data['title']}\nMeta Description: {page_data['meta_description']}\n\nContent:\n{page_data['text']}"
        })

        research_data = generate_structured_llm(
            prompt=prompt,
            response_schema=CompanyResearchBase,
            temperature=0.1
        )

        # Ensure official website is present in sources
        official_url = cls.normalize_url(website)
        if official_url not in research_data.sources:
            research_data.sources.append(official_url)

        return research_data

    @classmethod
    def persist_snapshot(
        cls,
        db: Session,
        company_id: int,
        research_data: CompanyResearchBase,
        change_summary: Optional[str] = None
    ) -> ResearchSnapshot:
        """Stores an immutable historical research snapshot for temporal diffing."""
        snapshot_dict = research_data.model_dump() if hasattr(research_data, "model_dump") else dict(research_data)
        snapshot = ResearchSnapshot(
            company_id=company_id,
            snapshot_data=snapshot_dict,
            change_summary=change_summary
        )
        db.add(snapshot)
        db.commit()
        db.refresh(snapshot)
        return snapshot

    @classmethod
    def persist_sources(
        cls,
        db: Session,
        company_id: int,
        sources_list: List[str]
    ) -> List[Source]:
        """Saves verified research sources into the sources table."""
        saved = []
        for src_url in sources_list:
            if not src_url:
                continue
            existing = db.query(Source).filter(
                Source.company_id == company_id,
                Source.url == src_url
            ).first()
            if not existing:
                src = Source(
                    company_id=company_id,
                    url=src_url,
                    source_name=f"Primary Research: {src_url[:50]}",
                    source_type="Official Website" if "http" in src_url else "External Source",
                    reliability_tier="High",
                    retrieved_at=datetime.now(timezone.utc)
                )
                db.add(src)
                saved.append(src)
            else:
                saved.append(existing)
        db.commit()
        return saved
