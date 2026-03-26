from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.infrastructure.database import get_db
from app.infrastructure.models import Employee
from pydantic import BaseModel
from typing import List, Dict, Any, Optional

from app.application.services.ahp_service import AHPService
from app.domain.ahp_constants import AHP_ALTERNATIVE_MATRICES, STRATEGY_GROUPS

router = APIRouter(prefix="/ahp", tags=["AHP"])
ahp_service = AHPService()

class AHPComputeRequest(BaseModel):
    group_code: str
    criteria_matrix: List[List[float]]
    # Optional: user-entered alternative matrices (keys: chi_phi, thoi_gian, ...)
    alternatives_matrices: Optional[Dict[str, List[List[float]]]] = None

class AHPSaveRequest(BaseModel):
    employee_ids: List[int]
    group_code: str
    best_pa_id: str
    score: float

@router.post("/compute")
async def compute_ahp(request: AHPComputeRequest):
    """
    [BƯỚC 2+3] Computes the full AHP:
    - Step 2: Criteria weights from criteria_matrix
    - Step 3: Alternative ranking using alternatives_matrices (user-provided or default)
    """
    try:
        if request.group_code not in STRATEGY_GROUPS:
             raise HTTPException(status_code=400, detail=f"Invalid group code: {request.group_code}")
        
        # Step 2: Compute criteria weights
        criteria_results = ahp_service.compute_ahp_criteria(request.criteria_matrix)
        
        # Step 3: Resolve alternative matrices
        if request.alternatives_matrices:
            # Use user-provided matrices
            alt_matrices = request.alternatives_matrices
        else:
            # Fall back to hardcoded expert matrices
            alt_matrices = AHP_ALTERNATIVE_MATRICES.get(request.group_code)
        
        if not alt_matrices:
            n_options = len(STRATEGY_GROUPS[request.group_code]["options"])
            dummy_matrix = [[1.0] * n_options for _ in range(n_options)]
            alt_matrices = {k: dummy_matrix for k in ["ai_result", "thu_nhap", "hieu_suat", "hai_long", "can_bang", "cap_bac"]}

        final_results = ahp_service.compute_ahp_alternatives(
            criteria_results["weights"],
            alt_matrices
        )
        
        return {
            "group": STRATEGY_GROUPS[request.group_code],
            "criteria": criteria_results,
            "alternatives": final_results
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/save-results")
async def save_ahp_results(request: AHPSaveRequest, db: Session = Depends(get_db)):
    """
    [BƯỚC 5] Persist AHP scores and strategy selections to the database.
    """
    try:
        updated_count = 0
        for emp_id in request.employee_ids:
            emp = db.query(Employee).filter(Employee.employee_id == emp_id).first()
            if emp:
                emp.strategy_group = request.group_code
                emp.strategy_option_id = request.best_pa_id
                emp.ahp_score = request.score
                updated_count += 1
        
        db.commit()
        return {"status": "success", "updated_count": updated_count}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/groups")
async def get_strategy_groups():
    return STRATEGY_GROUPS
