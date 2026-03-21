"""
L1 — Resume Parser
Model: yashpwr/resume-ner-bert-v2 (HuggingFace)
90.87% F1, 25 entity types, 22,542 resume samples
Falls back to keyword extraction if NER returns no results.
"""

from transformers import pipeline
import re

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
                         model="yashpwr/resume-ner-bert-v2",
                         aggregation_strategy="simple")
    return _pipe

def keyword_extract(text: str) -> list:
    text_lower = text.lower()
    return [s for s in SKILL_KEYWORDS if s in text_lower]

def parse_resume(text: str) -> dict:
    text = text[:1800]
    skills = []

    try:
        pipe = load_model()
        entities = pipe(text)
        for ent in entities:
            label = ent["entity_group"].upper()
            if "SKILL" in label:
                skills.append(ent["word"].strip())
    except Exception:
        pass

    # Fallback if NER found nothing
    if not skills:
        skills = keyword_extract(text)

    years = 0
    matches = re.findall(r'(\d+)\+?\s*year', text, re.IGNORECASE)
    if matches:
        years = max(int(m) for m in matches)

    return {
        "skills": list(set(skills)),
        "experience": [],
        "education": [],
        "years_experience": years
    }
