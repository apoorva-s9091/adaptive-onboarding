"""
L6 — Course Grounding via RAG
ChromaDB + MiniLM semantic search over fixed catalog
Prevents hallucination — LLM only picks from real courses
"""

import chromadb
import json
import os
from sentence_transformers import SentenceTransformer

CATALOG_PATH = os.path.join(os.path.dirname(__file__), "../data/catalog.json")

_client = None
_collection = None
_model = None


def load():
    global _client, _collection, _model
    if _collection is not None:
        return _collection, _model

    _model = SentenceTransformer("all-MiniLM-L6-v2")
    _client = chromadb.Client()
    _collection = _client.get_or_create_collection("courses")

    # Ingest catalog if collection is empty
    if _collection.count() == 0:
        with open(CATALOG_PATH) as f:
            catalog = json.load(f)
        for i, course in enumerate(catalog):
            embedding = _model.encode(course["description"]).tolist()
            _collection.add(
                ids=[str(i)],
                embeddings=[embedding],
                documents=[course["description"]],
                metadatas=[{"title": course["title"], "level": course["level"], "skill": course["skill"]}]
            )

    return _collection, _model


def ground_course(skill: str, level: str, top_k: int = 3) -> list:
    """Find best matching real courses for a skill+level from the catalog."""
    collection, model = load()
    query = f"{level} course for {skill}"
    embedding = model.encode(query).tolist()

    results = collection.query(query_embeddings=[embedding], n_results=top_k)
    courses = []
    for i in range(len(results["ids"][0])):
        courses.append({
            "title": results["metadatas"][0][i]["title"],
            "skill": results["metadatas"][0][i]["skill"],
            "level": results["metadatas"][0][i]["level"],
            "score": round(1 - results["distances"][0][i], 3)
        })
    return courses
