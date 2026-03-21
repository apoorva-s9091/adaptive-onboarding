"""
FastAPI Backend — main entry point
Connects all layers L1 → L8
"""

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pdfplumber
import io

from backend.layers.l1_resume_parser import parse_resume
from backend.layers.l2_jd_parser import parse_jd
from backend.layers.l3_skill_gap import compute_gap
from backend.layers.l4_confidence_scorer import score_all_gaps, train_and_save, MODEL_PATH
from backend.layers.l5_path_generator import generate_path
from backend.layers.l7_l8_reasoning_quiz import generate_quiz, score_quiz, generate_reasoning_trace

app = FastAPI(title="Adaptive Onboarding Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Startup ────────────────────────────────────────────────────────────────────

@app.on_event("startup")
def startup():
    """Pre-train L4 model on startup if not saved."""
    import os
    if not os.path.exists(MODEL_PATH):
        print("Training L4 confidence model...")
        train_and_save()


# ── Helpers ────────────────────────────────────────────────────────────────────

def extract_text_from_pdf(file_bytes: bytes) -> str:
    with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
        return "\n".join(page.extract_text() or "" for page in pdf.pages)


# ── Routes ─────────────────────────────────────────────────────────────────────

@app.post("/analyze")
async def analyze(
    resume: UploadFile = File(...),
    jd: UploadFile = File(...)
):
    """Full pipeline: upload resume + JD → get personalized learning path."""
    try:
        resume_text = extract_text_from_pdf(await resume.read())
        jd_text = extract_text_from_pdf(await jd.read())
    except Exception:
        raise HTTPException(400, "Could not read uploaded files. Use PDF format.")

    # L1 + L2
    resume_data = parse_resume(resume_text)
    jd_data = parse_jd(jd_text)

    # L3
    gap_result = compute_gap(resume_data["skills"], jd_data["required_skills"])

    # L4
    scored_gaps = score_all_gaps(gap_result["gaps"], resume_data["years_experience"])

    # L5
    path_result = generate_path(scored_gaps)

    return {
        "resume_skills": resume_data["skills"],
        "jd_skills": jd_data["required_skills"],
        "coverage_percent": gap_result["coverage_percent"],
        "gap_count": gap_result["gap_count"],
        "gaps": scored_gaps,
        "path": path_result["path"],
        "graph_nodes": path_result["graph_nodes"],
        "graph_edges": path_result["graph_edges"],
        "total_modules": path_result["total_modules"],
        "estimated_days": path_result["estimated_days"]
    }


class QuizRequest(BaseModel):
    skill: str
    level: str


class QuizAnswerRequest(BaseModel):
    skill: str
    level: str
    questions: list
    answers: list
    years_experience: float = 0
    semantic_similarity: float = 0.5
    onet_importance: float = 0.5
    priority_score: float = 0.5


@app.post("/quiz/generate")
def quiz_generate(req: QuizRequest):
    """L8: Generate quiz for a skill."""
    questions = generate_quiz(req.skill, req.level)
    return {"questions": questions}


@app.post("/quiz/submit")
def quiz_submit(req: QuizAnswerRequest):
    """Score quiz answers and re-run L4 with actual quiz score."""
    quiz_score = score_quiz(req.questions, req.answers)

    from backend.layers.l4_confidence_scorer import compute_confidence
    updated = compute_confidence(
        quiz_score=quiz_score,
        years_experience=req.years_experience,
        semantic_similarity=req.semantic_similarity,
        skill_frequency=req.onet_importance
    )

    reasoning = generate_reasoning_trace(
        skill=req.skill,
        level=updated["level"],
        course=f"{req.skill} {updated['level']} course",
        gap_score=1 - req.semantic_similarity
    )

    return {
        "quiz_score": quiz_score,
        "updated_level": updated["level"],
        "confidence": updated["confidence"],
        "reasoning": reasoning
    }


@app.get("/health")
def health():
    return {"status": "ok"}


# Serve frontend static files in production
import os
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

frontend_dist = os.path.join(os.path.dirname(__file__), "../frontend/dist")
if os.path.exists(frontend_dist):
    app.mount("/assets", StaticFiles(directory=os.path.join(frontend_dist, "assets")), name="assets")

    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        index = os.path.join(frontend_dist, "index.html")
        return FileResponse(index)
