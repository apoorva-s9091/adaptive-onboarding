"""
L4 — Adaptive Confidence Scorer
YOUR ORIGINAL ML MODEL
LogisticRegression trained on synthetic data
Features: quiz_score, years_exp, semantic_similarity, skill_frequency_in_jd
Output: beginner / intermediate / advanced
"""

import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
import pickle
import os

MODEL_PATH = os.path.join(os.path.dirname(__file__), "../models/confidence_model.pkl")
SCALER_PATH = os.path.join(os.path.dirname(__file__), "../models/scaler.pkl")


# ── Synthetic training data generator ─────────────────────────────────────────

def generate_synthetic_data(n=120):
    """
    Generate synthetic training samples.
    Features: [quiz_score, years_exp_norm, semantic_sim, skill_freq]
    Labels: 0=beginner, 1=intermediate, 2=advanced
    """
    np.random.seed(42)
    X, y = [], []

    for _ in range(n // 3):
        # Beginner profile
        X.append([
            np.random.uniform(0.0, 0.4),   # low quiz score
            np.random.uniform(0.0, 0.2),   # low experience
            np.random.uniform(0.0, 0.4),   # low semantic sim
            np.random.uniform(0.1, 0.5),   # skill freq
        ])
        y.append(0)

        # Intermediate profile
        X.append([
            np.random.uniform(0.4, 0.7),
            np.random.uniform(0.2, 0.6),
            np.random.uniform(0.4, 0.7),
            np.random.uniform(0.4, 0.7),
        ])
        y.append(1)

        # Advanced profile
        X.append([
            np.random.uniform(0.7, 1.0),
            np.random.uniform(0.6, 1.0),
            np.random.uniform(0.7, 1.0),
            np.random.uniform(0.6, 1.0),
        ])
        y.append(2)

    return np.array(X), np.array(y)


# ── Train and save ─────────────────────────────────────────────────────────────

def train_and_save():
    X, y = generate_synthetic_data(n=120)

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    model = LogisticRegression(max_iter=500, random_state=42)
    model.fit(X_scaled, y)

    os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
    with open(MODEL_PATH, "wb") as f:
        pickle.dump(model, f)
    with open(SCALER_PATH, "wb") as f:
        pickle.dump(scaler, f)

    print(f"Model trained and saved to {MODEL_PATH}")
    return model, scaler


# ── Load ───────────────────────────────────────────────────────────────────────

def load_model():
    if not os.path.exists(MODEL_PATH):
        print("No saved model found — training now...")
        return train_and_save()

    with open(MODEL_PATH, "rb") as f:
        model = pickle.load(f)
    with open(SCALER_PATH, "rb") as f:
        scaler = pickle.load(f)
    return model, scaler


# ── Predict ────────────────────────────────────────────────────────────────────

LABEL_MAP = {0: "beginner", 1: "intermediate", 2: "advanced"}

def compute_confidence(
    quiz_score: float,        # 0.0 - 1.0
    years_experience: float,  # raw years, will be normalized
    semantic_similarity: float,  # from L3 best match score
    skill_frequency: float,   # how often skill appears in JD (0-1)
) -> dict:
    """
    Predict difficulty level for a skill gap.
    This feeds directly into L5 to decide which path modules to assign.
    """
    model, scaler = load_model()

    # Normalize years (cap at 10 years = 1.0)
    years_norm = min(years_experience / 10.0, 1.0)

    features = np.array([[quiz_score, years_norm, semantic_similarity, skill_frequency]])
    features_scaled = scaler.transform(features)

    pred = model.predict(features_scaled)[0]
    proba = model.predict_proba(features_scaled)[0]

    return {
        "level": LABEL_MAP[pred],
        "confidence": round(float(max(proba)), 3),
        "probabilities": {
            "beginner": round(float(proba[0]), 3),
            "intermediate": round(float(proba[1]), 3),
            "advanced": round(float(proba[2]), 3),
        }
    }


def score_all_gaps(gaps: list, years_experience: float, quiz_results: dict = None) -> list:
    """
    Run confidence scoring for every gap from L3.
    quiz_results: {skill_name: score_0_to_1} — optional, defaults to 0.5
    """
    scored = []
    for gap in gaps:
        skill = gap["skill"]
        quiz_score = (quiz_results or {}).get(skill, 0.5)

        result = compute_confidence(
            quiz_score=quiz_score,
            years_experience=years_experience,
            semantic_similarity=gap["similarity"],
            skill_frequency=gap["onet_importance"],
        )

        scored.append({
            **gap,
            "difficulty_level": result["level"],
            "confidence": result["confidence"],
            "probabilities": result["probabilities"]
        })

    return scored


# ── Entrypoint for training ────────────────────────────────────────────────────
if __name__ == "__main__":
    train_and_save()
    print("Test prediction:")
    print(compute_confidence(
        quiz_score=0.8,
        years_experience=5,
        semantic_similarity=0.75,
        skill_frequency=0.6
    ))
