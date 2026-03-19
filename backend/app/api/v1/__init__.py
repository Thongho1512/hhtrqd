from fastapi import APIRouter
from .predictions import router as predictions_router
from .ahp import router as ahp_router
from .notes import router as notes_router
from .employees import router as employees_router

router = APIRouter(prefix="/api/v1")
router.include_router(predictions_router)
router.include_router(ahp_router)
router.include_router(notes_router)
router.include_router(employees_router)
