"""
L5 — Learning Path Generator
YOUR IMPLEMENTATION
NetworkX topological sort over a prerequisite knowledge graph
L4 confidence level determines which course tier to assign per skill
"""

import networkx as nx
from typing import List, Dict

# ── Prerequisite graph ─────────────────────────────────────────────────────────
# Defines skill learning order: edge A→B means "learn A before B"
# Extend this with more skills as needed

PREREQUISITE_GRAPH = {
    # Data / ML track
    "python":           [],
    "statistics":       ["python"],
    "data analysis":    ["python", "statistics"],
    "machine learning": ["python", "statistics", "data analysis"],
    "deep learning":    ["machine learning"],
    "nlp":              ["machine learning", "deep learning"],
    "computer vision":  ["machine learning", "deep learning"],

    # Data engineering
    "sql":              [],
    "databases":        ["sql"],
    "data warehousing": ["sql", "databases"],
    "etl":              ["sql", "databases"],
    "spark":            ["python", "sql"],

    # Web / backend
    "html css":         [],
    "javascript":       ["html css"],
    "react":            ["javascript"],
    "apis":             ["python"],
    "fastapi":          ["python", "apis"],

    # Business / analytics
    "excel":            [],
    "business intelligence": ["excel", "sql"],
    "data visualization":    ["python", "sql"],
    "tableau":               ["data visualization"],
    "power bi":              ["data visualization"],

    # DevOps / cloud
    "git":              [],
    "docker":           ["git"],
    "kubernetes":       ["docker"],
    "aws":              ["git"],
    "mlops":            ["docker", "machine learning"],
}

# Course catalog per skill per difficulty level
# Keys must match skills in PREREQUISITE_GRAPH
COURSE_CATALOG = {
    "python": {
        "beginner":     "Python for Absolute Beginners — Codecademy",
        "intermediate": "Python OOP and Data Structures — Coursera",
        "advanced":     "Advanced Python: Decorators, Generators, Async — Udemy",
    },
    "machine learning": {
        "beginner":     "ML Fundamentals — Google ML Crash Course",
        "intermediate": "Machine Learning Specialization — Andrew Ng (Coursera)",
        "advanced":     "ML Engineering for Production — MLOps Specialization",
    },
    "sql": {
        "beginner":     "SQL Basics — Mode Analytics Tutorial",
        "intermediate": "Advanced SQL for Data Analysis — Coursera",
        "advanced":     "Query Optimization and Database Design — Udemy",
    },
    "deep learning": {
        "beginner":     "Deep Learning Basics — fast.ai Part 1",
        "intermediate": "Deep Learning Specialization — Andrew Ng",
        "advanced":     "Transformers from Scratch — Andrej Karpathy",
    },
    "statistics": {
        "beginner":     "Statistics for Data Science — Khan Academy",
        "intermediate": "Statistical Learning — Stanford Online",
        "advanced":     "Bayesian Statistics — Coursera Duke",
    },
    "data analysis": {
        "beginner":     "Data Analysis with Pandas — Kaggle",
        "intermediate": "Data Wrangling and EDA — Coursera",
        "advanced":     "Advanced Analytics with Python — Udemy",
    },
    "docker": {
        "beginner":     "Docker Getting Started — Official Docs",
        "intermediate": "Docker for Developers — Udemy",
        "advanced":     "Docker and Kubernetes: The Complete Guide",
    },
    "nlp": {
        "beginner":     "NLP with Python — NLTK Book",
        "intermediate": "NLP Specialization — deeplearning.ai",
        "advanced":     "Large Language Models — Stanford CS324",
    },
}


def build_graph(skills: List[str]) -> nx.DiGraph:
    """Build a directed prerequisite graph for the given skill list."""
    G = nx.DiGraph()

    for skill in skills:
        skill_lower = skill.lower()
        G.add_node(skill_lower)

        prereqs = PREREQUISITE_GRAPH.get(skill_lower, [])
        for prereq in prereqs:
            if prereq in [s.lower() for s in skills] or prereq in PREREQUISITE_GRAPH:
                G.add_node(prereq)
                G.add_edge(prereq, skill_lower)

    return G


def get_course(skill: str, level: str) -> str:
    """Fetch course from catalog. Returns placeholder if not found."""
    skill_lower = skill.lower()
    catalog_entry = COURSE_CATALOG.get(skill_lower, {})
    return catalog_entry.get(level, f"{skill} — {level.capitalize()} course (search Coursera/Udemy)")


def generate_path(scored_gaps: List[Dict]) -> Dict:
    """
    Main function: takes scored gaps from L4 and generates ordered learning path.
    1. Build prerequisite graph
    2. Topological sort → learning order
    3. Assign course per skill based on difficulty level
    """
    if not scored_gaps:
        return {"path": [], "graph_edges": [], "graph_nodes": [], "total_modules": 0, "estimated_days": 0}

    skills = [g["skill"] for g in scored_gaps]
    level_map = {g["skill"].lower(): g["difficulty_level"] for g in scored_gaps}
    priority_map = {g["skill"].lower(): g["priority_score"] for g in scored_gaps}

    G = build_graph(skills)

    # Topological sort gives learning order respecting prerequisites
    try:
        ordered = list(nx.topological_sort(G))
    except (nx.NetworkXUnfeasible, nx.NetworkXError):
        # Fallback if cycle detected — sort by priority
        ordered = sorted(skills, key=lambda s: priority_map.get(s.lower(), 0), reverse=True)

    path = []
    step = 1
    for skill in ordered:
        level = level_map.get(skill, "intermediate")
        course = get_course(skill, level)
        path.append({
            "step": step,
            "skill": skill,
            "difficulty": level,
            "course": course,
            "priority": priority_map.get(skill, 0.5),
            "prerequisites": list(G.predecessors(skill))
        })
        step += 1

    # Graph edges for D3.js visualization
    graph_edges = [{"from": u, "to": v} for u, v in G.edges()]

    return {
        "path": path,
        "graph_edges": graph_edges,
        "graph_nodes": list(G.nodes()),
        "total_modules": len(path),
        "estimated_days": len(path) * 3  # rough estimate
    }


if __name__ == "__main__":
    # Quick test
    test_gaps = [
        {"skill": "machine learning", "similarity": 0.3, "onet_importance": 0.9,
         "priority_score": 0.63, "difficulty_level": "beginner"},
        {"skill": "python", "similarity": 0.5, "onet_importance": 0.8,
         "priority_score": 0.4, "difficulty_level": "intermediate"},
        {"skill": "deep learning", "similarity": 0.2, "onet_importance": 0.7,
         "priority_score": 0.56, "difficulty_level": "beginner"},
    ]
    result = generate_path(test_gaps)
    for step in result["path"]:
        print(f"Step {step['step']}: {step['skill']} ({step['difficulty']}) → {step['course']}")
