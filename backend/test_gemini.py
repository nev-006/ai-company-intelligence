from app.services.ai_service import analyze_company


result = analyze_company(
    "Zoho",
    "https://www.zoho.com"
)

print(result)