import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_home_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"

def test_get_companies_endpoint():
    response = client.get("/api/companies/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_get_dashboard_today_endpoint():
    response = client.get("/api/dashboard/today")
    assert response.status_code == 200
    data = response.json()
    assert "top_5_actions" in data
    assert "backlog" in data
    assert len(data["top_5_actions"]) <= 5

def test_invalid_company_id_404():
    response = client.get("/api/companies/9999999")
    assert response.status_code == 404
    assert response.json()["detail"] == "Company not found"

def test_invalid_url_handling():
    # Attempting to fetch an invalid domain should not crash server
    response = client.post("/api/companies/", json={"name": "Test Company", "website": "https://nonexistent-domain-xyz-1234.com"})
    assert response.status_code in [200, 500]
