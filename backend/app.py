"""FastAPI entrypoint for the Syngenta Track 1 MVP."""

from __future__ import annotations

import json
import logging
import sys
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

sys.path.insert(0, str(Path(__file__).parent))

from database import init_db
from routers import campaigns, farmers, predict

logging.basicConfig(level=logging.INFO, format="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s")
logger = logging.getLogger("syngenta.api")


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting Syngenta campaign intelligence API.")
    init_db()
    try:
        predict._get_predictor()
        logger.info("ML, RAG and generation services pre-warmed.")
    except Exception as exc:
        logger.warning("Could not pre-warm services: %s", exc)
    yield
    logger.info("Syngenta API shutting down.")


app = FastAPI(
    title="Syngenta Adaptive Campaign Intelligence API",
    description=(
        "Predicts farmer engagement, recommends low-bandwidth outreach channels, "
        "retrieves agronomy context, and generates hyperlocal multilingual campaigns."
    ),
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(farmers.router)
app.include_router(predict.router)
app.include_router(campaigns.router)
app.mount("/audio", StaticFiles(directory=str(Path(__file__).parent / "audio")), name="audio")


@app.get("/health", tags=["System"], summary="Health check")
def health():
    from routers.predict import _predictor

    model_ok = _predictor is not None
    return {
        "status": "ok",
        "model_loaded": model_ok,
        "n_features": len(_predictor.feature_columns) if model_ok else 0,
        "roc_auc": _predictor.metadata.get("roc_auc", 0) if model_ok else 0,
    }


@app.get("/api/segments/stats", tags=["Analytics"], summary="Segment statistics")
def segment_stats():
    path = Path(__file__).parent / "data" / "segment_stats.json"
    if not path.exists():
        raise HTTPException(404, "Segment stats file not found.")
    with open(path, encoding="utf-8") as fh:
        return json.load(fh)


@app.get("/api/model/info", tags=["System"], summary="Model metadata")
def model_info():
    from routers.predict import _predictor

    if _predictor is None:
        raise HTTPException(503, "Model not loaded.")
    return {
        **_predictor.metadata,
        "feature_columns": _predictor.feature_columns,
        "n_label_encoders": len(_predictor.label_encoders),
    }
