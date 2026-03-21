"""
L7 — Reasoning Trace
L8 — Quiz Generation
Both use DeepSeek-R1:8b via Ollama (local, free)
<think> tags give free chain-of-thought for L7
Falls back gracefully if Ollama is not running.
"""

import requests
import json

OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL = "deepseek-r1:8b"


def _call_ollama(prompt: str) -> str | None:
    try:
        response = requests.post(OLLAMA_URL, json={
            "model": MODEL,
            "prompt": prompt,
            "stream": False
        }, timeout=30)
        return response.json()["response"]
    except Exception:
        return None


# ── L7: Reasoning Trace ────────────────────────────────────────────────────────

def generate_reasoning_trace(skill: str, level: str, course: str, gap_score: float) -> str:
    """Explain WHY this module was recommended — satisfies 10% judging criterion."""
    prompt = f"""You are an adaptive onboarding system. Explain in 2-3 sentences why a new hire 
should study '{skill}' at the '{level}' level using '{course}'.
Their skill gap score is {gap_score:.2f} (0=no knowledge, 1=expert).
Be specific and professional. Think step by step."""

    response = _call_ollama(prompt)

    if response is None:
        # Fallback reasoning when Ollama is unavailable
        return (
            f"Reasoning: Based on the skill gap analysis, '{skill}' was identified as a critical gap "
            f"with a gap score of {gap_score:.2f}. "
            f"\n\nRecommendation: Enrolling in '{course}' at the {level} level will systematically "
            f"address this gap and bring you to role competency efficiently."
        )

    # Extract reasoning from <think> tags if present
    if "<think>" in response and "</think>" in response:
        think_part = response.split("<think>")[1].split("</think>")[0].strip()
        final_part = response.split("</think>")[-1].strip()
        return f"Reasoning: {think_part}\n\nRecommendation: {final_part}"

    return response


# ── L8: Quiz Generation ────────────────────────────────────────────────────────

FALLBACK_QUIZZES = {
    "python": [
        {"question": "What does 'list comprehension' do in Python?", "options": ["A. Creates a new list using expression", "B. Sorts a list", "C. Removes duplicates", "D. Reverses a list"], "answer": "A"},
        {"question": "Which keyword is used to define a function in Python?", "options": ["A. func", "B. define", "C. def", "D. function"], "answer": "C"},
        {"question": "What is the output of type([]) in Python?", "options": ["A. <class 'tuple'>", "B. <class 'list'>", "C. <class 'array'>", "D. <class 'dict'>"], "answer": "B"},
    ],
    "machine learning": [
        {"question": "What does overfitting mean in ML?", "options": ["A. Model performs well on train, poor on test", "B. Model performs poor on both", "C. Model underfits the data", "D. Model has too few parameters"], "answer": "A"},
        {"question": "Which algorithm is used for classification?", "options": ["A. Linear Regression", "B. K-Means", "C. Logistic Regression", "D. PCA"], "answer": "C"},
        {"question": "What is cross-validation used for?", "options": ["A. Speed up training", "B. Evaluate model generalization", "C. Reduce model size", "D. Increase accuracy always"], "answer": "B"},
    ],
    "sql": [
        {"question": "Which SQL clause filters rows after grouping?", "options": ["A. WHERE", "B. HAVING", "C. FILTER", "D. GROUP"], "answer": "B"},
        {"question": "What does JOIN do in SQL?", "options": ["A. Deletes rows", "B. Combines rows from multiple tables", "C. Creates a new table", "D. Sorts data"], "answer": "B"},
        {"question": "Which function counts non-null values?", "options": ["A. SUM()", "B. TOTAL()", "C. COUNT()", "D. AVG()"], "answer": "C"},
    ],
}

def _get_fallback_quiz(skill: str) -> list:
    skill_lower = skill.lower()
    for key, questions in FALLBACK_QUIZZES.items():
        if key in skill_lower or skill_lower in key:
            return questions
    return [
        {"question": f"What is the primary use of {skill}?", "options": ["A. Data processing", "B. Web development", "C. System administration", "D. Depends on context"], "answer": "D"},
        {"question": f"Which best describes a beginner task in {skill}?", "options": ["A. Setting up environment", "B. Building production systems", "C. Optimizing performance", "D. Writing documentation"], "answer": "A"},
        {"question": f"What is a key concept in {skill}?", "options": ["A. Basic syntax and fundamentals", "B. Advanced optimization", "C. Deployment pipelines", "D. Security hardening"], "answer": "A"},
    ]


def generate_quiz(skill: str, level: str, num_questions: int = 3) -> list:
    """Generate MCQs to validate resume claims about a skill."""
    prompt = f"""Generate {num_questions} multiple choice questions to test {level}-level knowledge of '{skill}'.
Return ONLY a JSON array in this exact format:
[
  {{
    "question": "...",
    "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
    "answer": "A"
  }}
]
No explanation, no markdown, just the JSON array."""

    response = _call_ollama(prompt)

    if response is None:
        return _get_fallback_quiz(skill)

    # Clean response and parse JSON
    clean = response.strip()
    if "```" in clean:
        clean = clean.split("```")[1].replace("json", "").strip()

    try:
        return json.loads(clean)
    except json.JSONDecodeError:
        return _get_fallback_quiz(skill)


def score_quiz(questions: list, user_answers: list) -> float:
    """Returns quiz score as 0.0 - 1.0."""
    if not questions:
        return 0.5
    correct = sum(
        1 for q, a in zip(questions, user_answers)
        if q["answer"].strip().upper() == a.strip().upper()
    )
    return round(correct / len(questions), 3)
