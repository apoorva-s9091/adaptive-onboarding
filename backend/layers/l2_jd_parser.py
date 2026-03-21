"""
L2 — Job Description Parser
Model: jjzha/jobbert_skill_extraction (HuggingFace)
NAACL 2022 paper, trained on SKILLSPAN dataset
"""

from transformers import pipeline

_pipe = None

def load_model():
    global _pipe
    if _pipe is None:
        _pipe = pipeline("token-classification",
                         model="jjzha/jobbert_skill_extraction",
                         aggregation_strategy="simple")
    return _pipe


def parse_jd(text: str) -> dict:
    pipe = load_model()
    entities = pipe(text)

    skills, requirements = [], []

    for ent in entities:
        label = ent["entity_group"].upper()
        value = ent["word"].strip()
        if "SKILL" in label or "TECH" in label:
            skills.append(value)
        else:
            requirements.append(value)

    return {
        "required_skills": list(set(skills)),
        "requirements": requirements,
        "raw_text": text
    }
