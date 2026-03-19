"""
Dependency Injection container.
Wires up infrastructure implementations to application services.
"""
from functools import lru_cache
from app.infrastructure.database import get_db

from app.application.services.ml_app_service import MLAppService
from app.infrastructure.database_loader import PostgresEmployeeLoader
from app.infrastructure.ml_service.sklearn_ml_service import SklearnMLService

# Singletons — created once, reused across requests
_db_loader = PostgresEmployeeLoader()
_ml_service = SklearnMLService()
_app_service = MLAppService(csv_loader=_db_loader, ml_service=_ml_service)


def get_ml_app_service() -> MLAppService:
    """FastAPI dependency that returns the shared MLAppService instance."""
    return _app_service
