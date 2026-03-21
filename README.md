SynapseOnboard — AI-Adaptive Onboarding Engine

Upload a resume and job description. Get a personalized, prerequisite-aware learning path to reach role competency — powered by NLP, semantic similarity, and knowledge graphs.


The Problem
Corporate onboarding uses static, one-size-fits-all curricula. Experienced hires waste time on concepts they already know. Beginners get overwhelmed by advanced modules. Neither reaches competency efficiently.
The Solution
SynapseOnboard parses both resume and JD, semantically identifies skill gaps, scores confidence per skill using an original ML model, and generates an ordered knowledge-graph-based learning path — grounded in a verified course catalog with zero hallucinations.

Quick Start
Prerequisites

Python 3.11+
Node.js 18+
Ollama (optional — app works without it, quiz uses fallback MCQs)

1. Clone the repository
bashgit clone https://github.com/apoorva-s9091/adaptive-onboarding
cd adaptive-onboarding
2. Backend setup
bashpip install -r requirements.txt
uvicorn backend.main:app --reload --port 8000
3. Frontend setup (new terminal)
bashcd frontend
npm install
npm run dev
4. Open browser
http://localhost:5173

Upload a PDF resume and PDF job description to get started.


Docker (Recommended)
bash# Build
docker build -t adaptive-onboarding .

# Run
docker run -p 8000:8000 adaptive-onboarding
Then open http://localhost:8000

Note: Ollama is optional. If running for quiz/reasoning features, start it on the host before running the container:
bashdocker run -p 8000:8000 --add-host=host.docker.internal:host-gateway adaptive-onboarding


Architecture — 8-Layer AI Pipeline
Resume PDF + JD PDF
        ↓
  L1: Resume Parser     (BERT NER → keyword fallback)
  L2: JD Parser         (JobBERT → keyword fallback)
        ↓
  L3: Semantic Gap Analysis     ← Original Implementation
  L4: Confidence Scorer         ← Original ML Model
  L5: Learning Path Generator   ← Original Implementation
        ↓
  L6: Course Grounding  (ChromaDB RAG — zero hallucinations)
  L7: Reasoning Trace   (DeepSeek-R1 via Ollama)
  L8: Quiz Generation   (DeepSeek-R1 via Ollama)
        ↓
  React Frontend + D3.js Knowledge Graph
LayerPurposeModel / ToolL1Resume skill extractionyashpwr/resume-ner-bert-v2 · HuggingFace · 90.87% F1L2JD skill extractionjjzha/jobbert_skill_extraction · NAACL 2022L3Semantic gap analysisall-MiniLM-L6-v2 + O*NET weights · OriginalL4Adaptive confidence scoringLogisticRegression · sklearn · Original ML ModelL5Knowledge graph pathingNetworkX topological sort · OriginalL6Course grounding (no hallucinations)ChromaDB + all-MiniLM-L6-v2L7Reasoning traceDeepSeek-R1:8b · Ollama · MIT licenseL8Quiz generationDeepSeek-R1:8b · Ollama · prompt-based

Skill-Gap Analysis Logic (L3) — Original Implementation
Instead of exact string matching, L3 uses semantic cosine similarity via MiniLM embeddings:
pythonsimilarity = cosine_similarity(embed(resume_skill), embed(jd_skill))
gap = True if similarity < 0.65 else False
This means "data analysis" partially covers "business intelligence" (similarity ≈ 0.74) — avoiding false gaps that exact string matching would produce.
Each gap is weighted by its O*NET importance score, producing a priority_score that determines the learning order:
pythonpriority_score = (1 - semantic_similarity) * onet_importance
Skills with high importance and low coverage are learned first.

Adaptive Pathing Algorithm (L4 + L5) — Original Implementation
L4 — Confidence Scorer (Original LogisticRegression Model)
Trained on 120 synthetic samples with 4 features:
FeatureDescriptionquiz_scoreScore from L8 diagnostic quiz (0–1)years_experienceExtracted from resume, normalized to 0–1semantic_similarityBest match score from L3skill_frequencyO*NET importance weight
Output: beginner / intermediate / advanced — determines which course tier to assign.
L5 — Knowledge Graph Pathing (Original NetworkX Implementation)

Builds a directed prerequisite graph (e.g. Python → Statistics → ML → Deep Learning → NLP)
Runs topological sort to guarantee prerequisites are always learned first
Assigns difficulty-appropriate course per node based on L4 confidence output
Falls back to priority-score ordering if cycles are detected


Dependencies
Python
fastapi==0.111.0              # REST API framework
uvicorn==0.29.0               # ASGI server
pdfplumber==0.11.0            # PDF text extraction
transformers==4.41.0          # HuggingFace BERT models (L1, L2)
torch==2.3.0                  # PyTorch backend
sentence-transformers==3.0.0  # MiniLM embeddings (L3, L6)
scikit-learn==1.4.2           # LogisticRegression (L4)
networkx==3.3                 # Graph algorithms (L5)
pandas==2.2.2                 # Data handling
numpy==1.26.4                 # Numerical operations
requests==2.32.0              # Ollama API calls (L7, L8)
python-multipart==0.0.9       # File upload handling
pydantic==2.7.0               # Request validation
Frontend
react@18.3.1                  # UI framework
react-router-dom@6.23.1       # Client-side routing
d3@7.9.0                      # Knowledge graph visualization
axios@1.7.2                   # API calls
vite@5.3.1                    # Build tool
tailwindcss@3.4.4             # Styling
framer-motion@11.2.10         # Animations

Datasets Used
DatasetSourceUsed ForResume DatasetKaggle — snehaanbhawalL1 NER evaluationO*NET Skills DBonetcenter.orgL3 importance weights, L5 skill taxonomyJobs & JD DatasetKaggle — kshitizregmiL2 testing, coverage evaluation

Models Cited
ModelSourceLicenseUsed Inresume-ner-bert-v2HuggingFace — yashpwrApache 2.0L1jobbert_skill_extractionHuggingFace — jjzha · NAACL 2022MITL2all-MiniLM-L6-v2HuggingFace — sentence-transformersApache 2.0L3, L6DeepSeek-R1:8bOllama — DeepSeekMITL7, L8

Validation Metrics
MetricValueResume NER F1 Score90.87% (yashpwr/resume-ner-bert-v2)Semantic gap threshold0.65 cosine similarityL4 model training samples120 synthetic profilesHallucination rate0% (RAG-grounded course catalog)Supported job domains38 skill categoriesPrerequisite graph nodes25+ skills with defined dependency chains

Project Structure
adaptive-onboarding/
├── backend/
│   ├── layers/
│   │   ├── l1_resume_parser.py       # BERT NER + keyword fallback
│   │   ├── l2_jd_parser.py           # JobBERT + keyword fallback
│   │   ├── l3_skill_gap.py           # Original semantic gap analysis
│   │   ├── l4_confidence_scorer.py   # Original LogisticRegression model
│   │   ├── l5_path_generator.py      # Original knowledge graph pathing
│   │   ├── l6_grounding.py           # ChromaDB RAG grounding
│   │   └── l7_l8_reasoning_quiz.py   # DeepSeek-R1 reasoning + quiz
│   ├── data/
│   │   └── catalog.json              # Verified course catalog (26 courses)
│   ├── models/                       # L4 saved model (auto-generated on startup)
│   └── main.py                       # FastAPI entry point
├── frontend/
│   └── src/
│       ├── pages/                    # Home, Results, Quiz, Trace, Demo, Docs
│       ├── components/               # Navbar, Graph, Cards, DropZone etc.
│       └── api/client.js             # Axios API calls
├── Dockerfile                        # Multi-stage build (Node + Python)
├── requirements.txt
└── README.md

 
License
MIT License — see LICENSE for details.
