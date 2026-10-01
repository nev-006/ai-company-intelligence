from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.selection_service import ActionSelectionService

router = APIRouter(
    prefix="/api/dashboard",
    tags=["Dashboard"]
)

@router.get("/today")
def get_act_today_dashboard(db: Session = Depends(get_db)):
    """
    Returns the 'ACT TODAY' top 5 actionable companies curated dynamically
    from the full backlog based on opportunity score, active triggers, ICP fit,
    decision maker readiness, and data confidence.
    """
    return ActionSelectionService.get_top_5_actions(db)
