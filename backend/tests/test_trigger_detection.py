import pytest
from app.schemas.signal import SignalBase

def test_meaningful_signal_vs_noise():
    meaningful_signal = SignalBase(
        signal_type="Hiring Surge",
        description="Engineering openings increased from 2 to 18 roles.",
        meaningful="Meaningful Signal",
        is_meaningful=True,
        worth_acting_on=True,
        recommended_action="Review company for immediate outreach to CTO.",
        source="Temporal Snapshot Comparison"
    )

    noise_signal = SignalBase(
        signal_type="Website Copy Update",
        description="Updated footer copyright from 2025 to 2026.",
        meaningful="Noise",
        is_meaningful=False,
        worth_acting_on=False,
        recommended_action="No action needed; ignore routine marketing noise.",
        source="Homepage HTML Diff"
    )

    assert meaningful_signal.is_meaningful is True
    assert meaningful_signal.worth_acting_on is True
    assert "outreach" in meaningful_signal.recommended_action.lower()

    assert noise_signal.is_meaningful is False
    assert noise_signal.worth_acting_on is False
    assert "ignore" in noise_signal.recommended_action.lower()

def test_signal_classification_helpers():
    signals = [
        SignalBase(signal_type="Funding", description="Series B $30M", meaningful="Meaningful Signal", is_meaningful=True, worth_acting_on=True, source="TechCrunch"),
        SignalBase(signal_type="CSS Change", description="Button color tweak", meaningful="Noise", is_meaningful=False, worth_acting_on=False, source="CSS Diff")
    ]
    actionable = [s for s in signals if s.worth_acting_on]
    assert len(actionable) == 1
    assert actionable[0].signal_type == "Funding"
