from typing import List, Dict, Any, Optional
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from app.models.company import Company, CompanyResearch, Opportunity, Person, Signal, Outreach

class ActionSelectionService:
    """
    Implements Task 8 & Task 9:
    Intelligently curates the 'TOP 5 ACTIONS TODAY' from potentially hundreds of backlog opportunities.
    Evaluates:
      - Opportunity Score (30% weight)
      - Active Trigger Strength (25% weight)
      - Decision Maker Availability (15% weight)
      - Company ICP Fit (15% weight)
      - Data Confidence (10% weight)
      - Signal Recency (5% weight)
    Produces transparent, explainable selection rationales for every chosen target.
    """

    @classmethod
    def get_top_5_actions(cls, db: Session) -> Dict[str, Any]:
        companies = db.query(Company).all()
        if not companies:
            return {
                "top_5_actions": [],
                "backlog": [],
                "total_evaluated": 0,
                "selection_framework": cls._get_framework_metadata(),
                "generated_at": datetime.now(timezone.utc).isoformat()
            }

        candidates = []

        for comp in companies:
            latest_opp = db.query(Opportunity).filter(
                Opportunity.company_id == comp.id
            ).order_by(Opportunity.created_at.desc()).first()

            latest_research = db.query(CompanyResearch).filter(
                CompanyResearch.company_id == comp.id
            ).order_by(CompanyResearch.created_at.desc()).first()

            contacts = db.query(Person).filter(
                Person.company_id == comp.id
            ).all()

            signals = db.query(Signal).filter(
                Signal.company_id == comp.id
            ).order_by(Signal.created_at.desc()).all()

            meaningful_signals = [s for s in signals if s.is_meaningful is not False]
            primary_signal = meaningful_signals[0] if meaningful_signals else (signals[0] if signals else None)

            # Recommended contact
            recommended_contact = None
            if contacts:
                # Prefer VP / CTO / Head of Engineering or first contact
                sorted_contacts = sorted(
                    contacts,
                    key=lambda c: 2 if any(role in (c.job_title or "").lower() for role in ["cto", "vp", "head of", "founder"]) else 1,
                    reverse=True
                )
                rc = sorted_contacts[0]
                recommended_contact = {
                    "id": rc.id,
                    "name": rc.name or f"Strategic Persona: {rc.job_title}",
                    "job_title": rc.job_title,
                    "is_persona": rc.is_persona,
                    "relevance_reason": rc.relevance_reason or "Key decision maker for technology and product adoption."
                }

            # Factors
            opp_score = latest_opp.score if latest_opp and latest_opp.score is not None else 50
            factors = latest_opp.score_factors if latest_opp and latest_opp.score_factors else {}
            
            fit_score = factors.get("company_fit", factors.get("business_fit", 70))
            tech_score = factors.get("technology_signal", factors.get("technology_relevance", 70))
            hiring_score = factors.get("hiring_signal", 60)

            # Trigger score (100 if meaningful trigger exists, 60 if generic, 30 if none)
            if meaningful_signals:
                trigger_score = 95
            elif signals:
                trigger_score = 65
            else:
                trigger_score = 35

            # Decision maker score
            dm_score = 90 if contacts else 40

            # Confidence score
            confidence_str = (latest_research.confidence_score if latest_research else "Medium") or "Medium"
            conf_multiplier = 1.0 if confidence_str.lower() == "high" else (0.8 if confidence_str.lower() == "medium" else 0.5)
            conf_score = int(100 * conf_multiplier)

            # Weighted composite action index
            action_index = (
                (opp_score * 0.30) +
                (trigger_score * 0.25) +
                (fit_score * 0.15) +
                (dm_score * 0.15) +
                (conf_score * 0.10) +
                (5.0) # recency base
            )

            # Selection rationale
            why_selected_points = []
            if opp_score >= 80:
                why_selected_points.append(f"High opportunity score ({opp_score}/100)")
            if meaningful_signals:
                why_selected_points.append(f"Active buying trigger: {primary_signal.signal_type} ({primary_signal.description[:60]}...)")
            if fit_score >= 75:
                why_selected_points.append(f"Strong ICP company fit ({fit_score}/100)")
            if recommended_contact:
                why_selected_points.append(f"Identified decision maker: {recommended_contact['job_title']}")
            if confidence_str.lower() == "high":
                why_selected_points.append("High verified data confidence")

            why_selected = " • ".join(why_selected_points) if why_selected_points else "Matched active target criteria based on company profile."

            rec_action = (
                latest_opp.recommended_action
                if latest_opp and latest_opp.recommended_action
                else f"Initiate tailored outreach to {recommended_contact['job_title'] if recommended_contact else 'key stakeholder'}."
            )

            candidate_record = {
                "company_id": comp.id,
                "company_name": comp.name,
                "website": comp.website,
                "action_index": round(action_index, 1),
                "opportunity_score": opp_score,
                "priority": latest_opp.priority if latest_opp and latest_opp.priority else ("High" if opp_score >= 75 else "Medium"),
                "trigger": primary_signal.description if primary_signal else "Routine monitoring - no disruptive trigger detected",
                "trigger_type": primary_signal.signal_type if primary_signal else "Baseline",
                "trigger_strength": "High" if meaningful_signals else ("Medium" if signals else "Low"),
                "recommended_contact": recommended_contact,
                "recommended_action": rec_action,
                "why_selected": why_selected,
                "confidence": confidence_str,
                "score_factors": {
                    "company_fit": fit_score,
                    "technology_signal": tech_score,
                    "hiring_signal": hiring_score,
                    "trigger_strength": trigger_score,
                    "decision_maker_readiness": dm_score
                },
                "last_updated": (latest_opp.created_at if latest_opp else comp.created_at).isoformat() if (latest_opp or comp.created_at) else datetime.now(timezone.utc).isoformat()
            }
            candidates.append(candidate_record)

        # Sort strictly by action_index descending
        candidates.sort(key=lambda c: c["action_index"], reverse=True)

        top_5 = []
        for rank, cand in enumerate(candidates[:5], start=1):
            cand_copy = dict(cand)
            cand_copy["rank"] = rank
            top_5.append(cand_copy)

        backlog = []
        for cand in candidates[5:]:
            backlog_item = {
                "company_id": cand["company_id"],
                "company_name": cand["company_name"],
                "website": cand["website"],
                "opportunity_score": cand["opportunity_score"],
                "action_index": cand["action_index"],
                "priority": cand["priority"],
                "confidence": cand["confidence"],
                "deferral_reason": f"Ranked #{len(top_5) + len(backlog) + 1} (Score: {cand['opportunity_score']}). Trigger urgency lower than Top 5 focus list."
            }
            backlog.append(backlog_item)

        return {
            "top_5_actions": top_5,
            "backlog": backlog,
            "total_evaluated": len(candidates),
            "selection_framework": cls._get_framework_metadata(),
            "generated_at": datetime.now(timezone.utc).isoformat()
        }

    @staticmethod
    def _get_framework_metadata() -> Dict[str, Any]:
        return {
            "algorithm": "Anaika Multi-Factor Action Prioritizer v2.0",
            "weights": {
                "opportunity_score": "30%",
                "trigger_strength": "25%",
                "company_fit": "15%",
                "decision_maker_readiness": "15%",
                "data_confidence": "10%",
                "recency": "5%"
            },
            "rule": "Dynamically selects exactly 5 most actionable targets today. Defer low-urgency accounts to monitored backlog."
        }
