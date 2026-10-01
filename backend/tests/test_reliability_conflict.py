import pytest
from app.schemas.company import DataConflictItem

def test_data_conflict_adjudication_model():
    conflict = DataConflictItem(
        field="company_size",
        source_a="LinkedIn Aggregator: 500 employees",
        source_b="SEC 10-K Annual Filing: 235 employees",
        chosen_value="235 employees",
        resolution_reasoning="SEC 10-K is a regulatory audited primary filing, superseding third-party scrape directory data.",
        uncertainty_level="Low",
        display_status="Conflicting"
    )

    assert conflict.field == "company_size"
    assert conflict.chosen_value == "235 employees"
    assert "regulatory" in conflict.resolution_reasoning.lower()
    assert conflict.display_status == "Conflicting"
    assert conflict.uncertainty_level == "Low"

def test_conflict_display_status_values():
    valid_statuses = ["Verified", "Inferred", "Unknown", "Conflicting"]
    item = DataConflictItem(
        field="headquarters",
        source_a="Old press release: London",
        source_b="Current website: San Francisco",
        chosen_value="San Francisco, CA",
        resolution_reasoning="Current website about page supersedes 2022 press release.",
        uncertainty_level="Medium",
        display_status="Verified"
    )
    assert item.display_status in valid_statuses
