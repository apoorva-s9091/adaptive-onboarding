<div align="center">

# 🧠 SynapseOnboard
### AI-Powered Adaptive Onboarding Engine

**Upload a resume. Upload a job description. Get a personalized learning path in seconds.**

[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://docker.com)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

</div>

---

## 🎯 The Problem

Corporate onboarding is broken.

Static, one-size-fits-all curricula force experienced hires to sit through content they already know — while beginners get overwhelmed by modules they aren't ready for. Neither group reaches competency efficiently.

**SynapseOnboard fixes this.**

---

## ✨ What It Does

Upload your resume and job description. The engine:

1. **Extracts skills** from both documents using BERT-based NER models
2. **Computes semantic gaps** — not exact matches, but *meaning-aware* similarity
3. **Scores your confidence** per skill using an original ML model (quiz + experience + similarity)
4. **Generates a learning path** ordered by prerequisite dependencies via knowledge graph
5. **Grounds every recommendation** in a verified course catalog — zero hallucinations
6. **Explains its reasoning** with an AI trace for every module recommendation
7. **Validates your knowledge** with dynamically generated diagnostic quizzes

---

## 🏗️ Architecture — 8-Layer AI Pipeline

```
┌─────────────────────────────────────────────────────────┐
│              Resume PDF  +  Job Description PDF          │
└────────────────────────┬────────────────────────────────┘
                         │
          ┌──────────────▼──────────────┐
          │  L1: Resume Parser           │  yashpwr/resume-ner-bert-v2
          │  L2: JD Parser               │  jjzha/jobbert_skill_extraction
          └──────────────┬──────────────┘
                         │
          ┌──────────────▼──────────────┐
          │  L3: Semantic Gap Analysis   │  ← ORIGINAL · all-MiniLM-L6-v2
          │  L4: Confidence Scorer       │  ← ORIGINAL · LogisticRegression
          │  L5: Path Generator          │  ← ORIGINAL · NetworkX graph
          └──────────────┬──────────────┘
                         │
          ┌──────────────▼──────────────┐
          │  L6: Course Grounding        │  ChromaDB RAG · 0% hallucination
          │  L7: Reasoning Trace         │  DeepSeek-R1:8b · Ollama
          │  L8: Quiz Generation         │  DeepSeek-R1:8b · Ollama
          └──────────────┬──────────────┘
                         │
          ┌──────────────▼──────────────┐
          │   React UI  +  D3.js Graph   │
          └─────────────────────────────┘
```

| Layer | Purpose | Model / Tool | Origin |
|---|---|---|---|
| L1 | Resume skill extraction | `yashpwr/resume-ner-bert-v2` · 90.87% F1 | HuggingFace |
| L2 | JD skill extraction | `jjzha/jobbert_skill_extraction` · NAACL 2022 | HuggingFace |
| L3 | Semantic gap analysis | `all-MiniLM-L6-v2` + O\*NET weights | ⭐ Original |
| L4 | Adaptive confidence scoring | `LogisticRegression` · sklearn | ⭐ Original ML |
| L5 | Knowledge graph pathing | `NetworkX` topological sort | ⭐ Original |
| L6 | Course grounding | `ChromaDB` + `all-MiniLM-L6-v2` | RAG |
| L7 | Reasoning trace | `DeepSeek-R1:8b` via Ollama | MIT |
| L8 | Quiz generation | `DeepSeek-R1:8b` via Ollama | MIT |

---

## 🔬 Core Logic — Skill-Gap Analysis (L3)

**The differentiator: semantic similarity, not string matching.**

```python
# Traditional approach — misses synonyms entirely
gap = resume_skill != jd_skill  # "data analysis" ≠ "business intelligence" → FALSE GAP

# Our approach — meaning-aware matching
similarity = cosine_similarity(embed(resume_skill), embed(jd_skill))
gap = similarity < 0.65  # "data analysis" ~ "business intelligence" → 0.74 → COVERED ✓
```

Each gap is then prioritized using O\*NET importance weights:

```python
priority_score = (1 - semantic_similarity) * onet_importance
# High importance + low coverage = learn first
```

---

## 🤖 Adaptive Pathing Algorithm (L4 + L5)

### L4 — Confidence Scorer ⭐ Original ML Model

Logistic Regression trained on 120 synthetic profiles with 4 features:

| Feature | Weight | Description |
|---|---|---|
| `quiz_score` | High | Diagnostic quiz result (0–1) |
| `years_experience` | Medium | From resume, normalized to 0–1 |
| `semantic_similarity` | Medium | Best match score from L3 |
| `skill_frequency` | Low | O\*NET importance weight |

**Output:** `beginner` / `intermediate` / `advanced` → selects correct course tier

### L5 — Knowledge Graph ⭐ Original Implementation

```
python ──► statistics ──► data analysis ──► machine learning ──► deep learning ──► nlp
   └──────────────────────────────────────► computer vision ──────────────────────────┘
sql ──► databases ──► data warehousing
```

- Directed prerequisite graph with 25+ skill nodes
- **Topological sort** guarantees correct learning order always
- Difficulty-appropriate course assigned per node from L4 output
- Cycle detection with fallback to priority-score ordering

---

## 🚀 Quick Start

### Option 1 — Docker (Recommended for judges)

```bash
# Clone
git clone https://github.com/apoorva-s9091/adaptive-onboarding
cd adaptive-onboarding

# Build and run
docker build -t adaptive-onboarding .
docker run -p 8000:8000 adaptive-onboarding
```

Open `http://localhost:8000` ✅

> **Ollama is optional.** The app works fully without it — quiz uses intelligent fallback MCQs. For AI-generated questions, install [Ollama](https://ollama.com) and run `ollama pull deepseek-r1:1.5b` before starting the container.

### Option 2 — Local Development

**Backend (Terminal 1):**
```bash
pip install -r requirements.txt
uvicorn backend.main:app --reload --port 8000
```

**Frontend (Terminal 2):**
```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` ✅

---

## 📁 Project Structure

```
adaptive-onboarding/
├── backend/
│   ├── layers/
│   │   ├── l1_resume_parser.py       # BERT NER + keyword fallback
│   │   ├── l2_jd_parser.py           # JobBERT + keyword fallback
│   │   ├── l3_skill_gap.py           # ⭐ Original semantic gap analysis
│   │   ├── l4_confidence_scorer.py   # ⭐ Original LogisticRegression model
│   │   ├── l5_path_generator.py      # ⭐ Original knowledge graph pathing
│   │   ├── l6_grounding.py           # ChromaDB RAG — zero hallucinations
│   │   └── l7_l8_reasoning_quiz.py   # DeepSeek-R1 reasoning + quiz
│   ├── data/
│   │   └── catalog.json              # Verified course catalog (26 courses)
│   ├── models/                       # L4 saved model (auto-generated on startup)
│   └── main.py                       # FastAPI entry point + all routes
├── frontend/
│   └── src/
│       ├── pages/                    # Home, Results, Quiz, Trace, Demo, Docs
│       ├── components/               # Navbar, Graph, Cards, DropZone
│       └── api/client.js             # Axios API layer
├── Dockerfile                        # Multi-stage build (Node + Python)
├── requirements.txt
└── README.md
```

---

## 📦 Dependencies

### Python Backend
| Package | Version | Purpose |
|---|---|---|
| `fastapi` | 0.111.0 | REST API framework |
| `uvicorn` | 0.29.0 | ASGI server |
| `pdfplumber` | 0.11.0 | PDF text extraction |
| `transformers` | 4.41.0 | HuggingFace BERT models |
| `torch` | 2.3.0 | PyTorch backend |
| `sentence-transformers` | 3.0.0 | MiniLM embeddings |
| `scikit-learn` | 1.4.2 | LogisticRegression (L4) |
| `networkx` | 3.3 | Graph algorithms (L5) |
| `pandas` | 2.2.2 | O\*NET data handling |
| `requests` | 2.32.0 | Ollama API calls |

### React Frontend
| Package | Version | Purpose |
|---|---|---|
| `react` | 18.3.1 | UI framework |
| `react-router-dom` | 6.23.1 | Client-side routing |
| `d3` | 7.9.0 | Knowledge graph visualization |
| `axios` | 1.7.2 | API calls |
| `framer-motion` | 11.2.10 | Animations |
| `tailwindcss` | 3.4.4 | Styling |

---

## 📊 Datasets Used

| Dataset | Source | Used For |
|---|---|---|
| Resume Dataset | [Kaggle — snehaanbhawal](https://www.kaggle.com/datasets/snehaanbhawal/resume-dataset) | L1 NER model evaluation |
| O\*NET Skills Database | [onetcenter.org](https://www.onetcenter.org/db_releases.html) | L3 importance weights · L5 taxonomy |
| Jobs & Job Descriptions | [Kaggle — kshitizregmi](https://www.kaggle.com/datasets/kshitizregmi/jobs-and-job-description) | L2 testing · coverage evaluation |

---

## 📜 Models Cited

| Model | Source | License | Layer |
|---|---|---|---|
| `resume-ner-bert-v2` | [HuggingFace — yashpwr](https://huggingface.co/yashpwr/resume-ner-bert-v2) | Apache 2.0 | L1 |
| `jobbert_skill_extraction` | [HuggingFace — jjzha](https://huggingface.co/jjzha/jobbert_skill_extraction) · NAACL 2022 | MIT | L2 |
| `all-MiniLM-L6-v2` | [HuggingFace — sentence-transformers](https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2) | Apache 2.0 | L3, L6 |
| `DeepSeek-R1:8b` | [Ollama — DeepSeek](https://ollama.com/library/deepseek-r1) | MIT | L7, L8 |

---

## 📈 Validation Metrics

| Metric | Value |
|---|---|
| Resume NER F1 Score | 90.87% |
| Semantic gap threshold | 0.65 cosine similarity |
| L4 training samples | 120 synthetic profiles |
| Hallucination rate | **0%** (RAG-grounded) |
| Supported skill domains | 38 categories |
| Prerequisite graph nodes | 25+ with dependency chains |

---

## 🔌 API Reference

| Endpoint | Method | Description |
|---|---|---|
| `/analyze` | POST | Full pipeline · resume + JD → learning path |
| `/quiz/generate` | POST | Generate MCQs for a skill |
| `/quiz/submit` | POST | Score answers · recalibrate confidence |
| `/health` | GET | Backend health check |

**Example:**
```bash
curl -X POST http://localhost:8000/analyze \
  -F "resume=@resume.pdf" \
  -F "jd=@job_description.pdf"
```

---

<div align="center">

**Built with ❤️ using FastAPI · React · HuggingFace · NetworkX · D3.js**

MIT License · © 2026 SynapseOnboard

</div>
