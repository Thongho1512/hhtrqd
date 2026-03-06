"""
API Router — Dashboard endpoints.
GET /api/dashboard/summary  — dataset-level statistics for the dashboard.
"""
import logging
from fastapi import APIRouter, Depends, HTTPException

from app.api.dependencies import get_ml_app_service
from app.application.dtos import DashboardSummaryDTO, EmployeeDetailDTO
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


@router.get(
    "/employee/{employee_id}",
    response_model=EmployeeDetailDTO,
    summary="Get full employee details",
    description="Returns all database fields for a specific employee by their ID.",
)
async def get_employee(
    employee_id: int,
    service: MLAppService = Depends(get_ml_app_service),
):
    try:
        return service.get_employee_detail(employee_id)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc))
    except Exception as exc:
        logger.exception("Get employee detail failed")
        raise HTTPException(status_code=500, detail=f"Error: {str(exc)}")
