"""
API Router — Dashboard endpoints.
GET /api/dashboard/summary  — dataset-level statistics for the dashboard.
"""
import logging
from fastapi import APIRouter, Depends, HTTPException

from app.api.dependencies import get_ml_app_service
from app.application.dtos import DashboardSummaryDTO
from app.application.services.ml_app_service import MLAppService

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])


@router.get(
    "/summary",
    response_model=DashboardSummaryDTO,
    summary="HR dataset overview statistics",
    description=(
        "Returns aggregated statistics computed directly from the CSV dataset: "
        "total employees, attrition rate, department breakdown, etc."
    ),
)
async def get_summary(
    service: MLAppService = Depends(get_ml_app_service),
):
    try:
        return service.get_dashboard_summary()
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc))
    except Exception as exc:
        logger.exception("Dashboard summary failed")
        raise HTTPException(status_code=500, detail=f"Dashboard error: {str(exc)}")
