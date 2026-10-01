from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from urllib.parse import quote_plus

from app.config import (
    DATABASE_HOST,
    DATABASE_NAME,
    DATABASE_USER,
    DATABASE_PASSWORD,
    DATABASE_PORT
)


encoded_password = quote_plus(DATABASE_PASSWORD)

SQLALCHEMY_DATABASE_URL = (
    f"postgresql+psycopg2://"
    f"{DATABASE_USER}:{encoded_password}@"
    f"{DATABASE_HOST}:{DATABASE_PORT}/"
    f"{DATABASE_NAME}"
)

engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()