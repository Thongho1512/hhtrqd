"""
FastAPI application factory.
Configures middleware, CORS, routers and startup events.
"""
import logging
import logging.config
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routers import ml_router, dashboard_router
from app.api import v1

# ─── Logging Setup ──────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s — %(message)s",
)
logger = logging.getLogger(__name__)


# ─── Lifespan ───────────────────────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("🚀  HR Attrition API starting up …")
    yield
    logger.info("🛑  HR Attrition API shutting down …")


# ─── App Factory ────────────────────────────────────────────────────────────
def create_app() -> FastAPI:
    app = FastAPI(
        title="HR Attrition Prediction API",
        description=(
            "REST API for training and running an employee attrition "
            "prediction model on the IBM HR dataset. No database required."
        ),
        version="1.0.0",
        docs_url="/docs",
        redoc_url="/redoc",
        lifespan=lifespan,
    )

    # ── CORS ──────────────────────────────────────────────────────────────
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],   # Tighten in production
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # ── Routers ───────────────────────────────────────────────────────────
    app.include_router(ml_router.router)
    app.include_router(dashboard_router.router)
    app.include_router(v1.router)

    @app.get("/", tags=["Health"])
    async def root():
        return {
            "status": "ok",
            "message": "HR Attrition Prediction API is running.",
            "docs": "/docs",
        }

    @app.get("/health", tags=["Health"])
    async def health():
        return {"status": "healthy"}

    return app


app = create_app()
