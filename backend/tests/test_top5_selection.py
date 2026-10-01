import pytest
from app.database import SessionLocal
from app.services.selection_service import ActionSelectionService

def test_top5_selection_logic():
    db = SessionLocal()
    try:
        result = ActionSelectionService.get_top_5_actions(db)
        assert "top_5_actions" in result
        assert "backlog" in result
        assert "selection_framework" in result
        
        top5 = result["top_5_actions"]
        assert len(top5) <= 5
        assert len(top5) > 0

        # Verify ranking order
        indices = [item["action_index"] for item in top5]
        assert indices == sorted(indices, reverse=True), "Top 5 must be sorted by action_index descending"

        # Verify every item has required explainability attributes
        for item in top5:
            assert "rank" in item
            assert item["rank"] in [1, 2, 3, 4, 5]
            assert "why_selected" in item
            assert len(item["why_selected"]) > 10
            assert "trigger" in item
            assert "recommended_contact" in item
            assert "recommended_action" in item
            assert "action_index" in item
    finally:
        db.close()
