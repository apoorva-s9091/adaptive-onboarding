"""
L2 — Job Description Parser
Model: jjzha/jobbert_skill_extraction (HuggingFace)
NAACL 2022 paper, trained on SKILLSPAN dataset
Falls back to keyword extraction if NER returns no results.
"""

from transformers import pipeline

_pipe = None

SKILL_KEYWORDS = [
    "python", "sql", "machine learning", "deep learning", "nlp",
    "natural language processing", "pytorch", "tensorflow", "keras",
    "scikit-learn", "pandas", "numpy", "matplotlib", "seaborn",
    "fastapi", "flask", "django", "docker", "kubernetes", "git",
    "aws", "gcp", "azure", "spark", "hadoop", "kafka", "airflow",
    "mlflow", "mlops", "statistics", "data analysis", "data science",
    "computer vision", "transformers", "bert", "llm", "openai",
    "power bi", "tableau", "excel", "xgboost", "random forest",
    "neural network", "classification", "regression", "clustering",
    "feature engineering", "data visualization", "a/b testing",
    "hypothesis testing", "probability", "linear algebra",
]

def load_model():
    global _pipe
    if _pipe is None:
        _pipe = pipeline("token-classification",
                         model="jjzha/jobbert_skill_extraction",
                         aggregation_strategy="simple")
    return _pipe

def keyword_extract(text: str) -> list:
    text_lower = text.lower()
    return [s for s in SKILL_KEYWORDS if s in text_lower]

def parse_jd(text: str) -> dict:
    text = text[:1800]
    skills = []

    try:
        pipe = load_model()
        entities = pipe(text)
        for ent in entities:
            label = ent["entity_group"].upper()
            if "SKILL" in label or "TECH" in label:
                skills.append(ent["word"].strip())
    except Exception:
        pass

    # Fallback if NER found nothing
    if not skills:
        skills = keyword_extract(text)

    return {
        "required_skills": list(set(skills)),
        "requirements": [],
        "raw_text": text
    }
