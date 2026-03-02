"""
API Router — Machine Learning endpoints.
POST /api/ml/train    — train the model
POST /api/ml/predict  — predict attrition for an employee
GET  /api/ml/status   — check whether a model is loaded
"""
import logging
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks

from app.api.dependencies import get_ml_app_service
from app.application.dtos import PredictRequestDTO, PredictResponseDTO, TrainResponseDTO
from app.application.services.ml_app_service import MLAppService

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/ml", tags=["Machine Learning"])


@router.post(
    "/train",
    response_model=TrainResponseDTO,
    summary="Train the attrition prediction model",
    description=(
        "Reads the IBM HR CSV dataset, trains a RandomForest pipeline, "
        "evaluates on a holdout set, and returns accuracy / AUC / F1."
    ),
)
async def train_model(
    service: MLAppService = Depends(get_ml_app_service),
):
    try:
        result = service.train_model()
        return result
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc))
    except Exception as exc:
        logger.exception("Training failed")
        raise HTTPException(status_code=500, detail=f"Training error: {str(exc)}")


@router.post(
    "/predict",
    response_model=PredictResponseDTO,
    summary="Predict attrition for a single employee",
    description="Returns whether the employee is likely to attrite and the probability score.",
)
async def predict_attrition(
    request: PredictRequestDTO,
    service: MLAppService = Depends(get_ml_app_service),
):
    try:
        result = service.predict_attrition(request)
        return result
    except RuntimeError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
    except Exception as exc:
        logger.exception("Prediction failed")
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(exc)}")


@router.get(
    "/status",
    summary="Model readiness status",
    description="Returns whether a trained model is loaded and its current version.",
)
async def model_status(
    service: MLAppService = Depends(get_ml_app_service),
):
    from app.api.dependencies import _ml_service
    loaded = _ml_service.is_model_loaded()
    return {
        "modelLoaded": loaded,
        "modelVersion": _ml_service._model_version if loaded else None,
        "message": "Model is ready for predictions." if loaded else "No model loaded. Please train first.",
    }
