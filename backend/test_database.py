from app.database import SessionLocal
from sqlalchemy import text


db = SessionLocal()

try:
    result = db.execute(
        text("""
            SELECT id, name, website
            FROM companies
            ORDER BY id;
        """)
    )

    companies = result.fetchall()

    print("Companies in database:")

    for company in companies:
        print(company)

finally:
    db.close()