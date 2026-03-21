"""
L3 — Skill Gap Analyzer
YOUR IMPLEMENTATION — original contribution
Uses semantic similarity (MiniLM) instead of exact string matching
so "data analysis" partially covers "business intelligence"
"""

from sentence_transformers import SentenceTransformer, util
import pandas as pd
import os

_model = None
_onet_skills = None

ONET_CSV_PATH = os.path.join(os.path.dirname(__file__), "../data/onet_skills.csv")
SIMILARITY_THRESHOLD = 0.65  # tune this — above = covered, below = gap


def load_model():
    global _model
    if _model is None:
        _model = SentenceTransformer("all-MiniLM-L6-v2")
    return _model


def load_onet_weights() -> dict:
    """
    Load O*NET skill importance weights.
    CSV should have columns: skill_name, importance (1-5 scale)
    Download from: https://www.onetcenter.org/db_releases.html
    """
    global _onet_skills
    if _onet_skills is not None:
        return _onet_skills

    if os.path.exists(ONET_CSV_PATH):
        df = pd.read_csv(ONET_CSV_PATH)
        _onet_skills = dict(zip(
            df["skill_name"].str.lower(),
            df["importance"] / 5.0  # normalize to 0-1
        ))
    else:
        # Fallback: uniform weights if O*NET not downloaded yet
        _onet_skills = {}

    return _onet_skills


def compute_semantic_similarity(skill_a: str, skill_b: str, model) -> float:
    """Core semantic matching — this is your differentiator vs exact string match."""
    emb_a = model.encode(skill_a, convert_to_tensor=True)
    emb_b = model.encode(skill_b, convert_to_tensor=True)
    return float(util.cos_sim(emb_a, emb_b))


def compute_gap(resume_skills: list, jd_skills: list) -> dict:
    """
    For each JD skill, find the best semantic match in resume.
    If best match < threshold → it's a gap.
    Returns gaps with similarity scores and O*NET priority weights.
    """
    model = load_model()
    onet_weights = load_onet_weights()

    gaps = []
    covered = []

    for jd_skill in jd_skills:
        best_score = 0.0
        best_match = None

        for res_skill in resume_skills:
            score = compute_semantic_similarity(jd_skill, res_skill, model)
            if score > best_score:
                best_score = score
                best_match = res_skill

        onet_weight = onet_weights.get(jd_skill.lower(), 0.5)  # default 0.5

        if best_score < SIMILARITY_THRESHOLD:
            gaps.append({
                "skill": jd_skill,
                "best_resume_match": best_match,
                "similarity": round(best_score, 3),
                "onet_importance": round(onet_weight, 3),
                "priority_score": round((1 - best_score) * onet_weight, 3)
            })
        else:
            covered.append({
                "skill": jd_skill,
                "matched_by": best_match,
                "similarity": round(best_score, 3)
            })

    # Sort gaps by priority (highest first)
    gaps.sort(key=lambda x: x["priority_score"], reverse=True)

    return {
        "gaps": gaps,
        "covered": covered,
        "gap_count": len(gaps),
        "coverage_percent": round(len(covered) / max(len(jd_skills), 1) * 100, 1)
    }
