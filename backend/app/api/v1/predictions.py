from fastapi import APIRouter, Depends, HTTPException
from typing import Optional
from app.api.dependencies import get_ml_app_service
from app.application.services.ml_app_service import MLAppService
from app.application.dtos import DepartmentPredictResponseDTO

router = APIRouter(prefix="/predictions", tags=["Predictions"])

@router.post("/department", response_model=DepartmentPredictResponseDTO)
async def predict_department(
    department_id: str,
    service: MLAppService = Depends(get_ml_app_service)
):
    """
    [BƯỚC 1] Predict attrition for a department and classify into strategy groups.
    """
    try:
        # Note: the prompt says 'department_id' but our current logic uses 'department_name'
        # I'll use it as the name for now.
        return service.predict_department(department_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
