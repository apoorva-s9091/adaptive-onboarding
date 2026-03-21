"""
L1 — Resume Parser
Model: yashpwr/resume-ner-bert-v2 (HuggingFace)
90.87% F1, 25 entity types, 22,542 resume samples
"""

from transformers import pipeline
import re

_pipe = None

def load_model():
    global _pipe
    if _pipe is None:
        _pipe = pipeline("token-classification",
                         model="yashpwr/resume-ner-bert-v2",
                         aggregation_strategy="simple")
    return _pipe


def parse_resume(text: str) -> dict:
    pipe = load_model()
    entities = pipe(text)

    skills, experience, education = [], [], []

    for ent in entities:
        label = ent["entity_group"].upper()
        value = ent["word"].strip()
        if "SKILL" in label:
            skills.append(value)
        elif "EXP" in label or "WORK" in label:
            experience.append(value)
        elif "EDU" in label:
            education.append(value)

    # Extract years of experience from raw text
    years = 0
    matches = re.findall(r'(\d+)\+?\s*year', text, re.IGNORECASE)
    if matches:
        years = max(int(m) for m in matches)

    return {
        "skills": list(set(skills)),
        "experience": experience,
        "education": education,
        "years_experience": years
    }
