from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session
from typing import List

from app.api.dependencies import get_db
from app.application.services.employee_service import EmployeeService
from app.application.dtos import EmployeeCreateDTO, EmployeeUpdateDTO, EmployeeDetailDTO

router = APIRouter(prefix="/employees", tags=["Employees"])

@router.get("/", response_model=List[EmployeeDetailDTO])
def list_employees(db: Session = Depends(get_db)):
    service = EmployeeService(db)
    return service.get_all_employees()

@router.get("/{employee_id}", response_model=EmployeeDetailDTO)
def get_employee(employee_id: int, db: Session = Depends(get_db)):
    service = EmployeeService(db)
    employee = service.get_employee_by_id(employee_id)
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    return employee

@router.post("/", response_model=EmployeeDetailDTO, status_code=status.HTTP_201_CREATED)
def create_employee(dto: EmployeeCreateDTO, db: Session = Depends(get_db)):
    service = EmployeeService(db)
    return service.create_employee(dto)

@router.put("/{employee_id}", response_model=EmployeeDetailDTO)
def update_employee(employee_id: int, dto: EmployeeUpdateDTO, db: Session = Depends(get_db)):
    service = EmployeeService(db)
    employee = service.update_employee(employee_id, dto)
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    return employee

@router.delete("/{employee_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_employee(employee_id: int, db: Session = Depends(get_db)):
    service = EmployeeService(db)
    if not service.delete_employee(employee_id):
        raise HTTPException(status_code=404, detail="Employee not found")
    return None

@router.post("/import")
async def import_employees(file: UploadFile = File(...), db: Session = Depends(get_db)):
    service = EmployeeService(db)
    content = await file.read()
    
    try:
        if file.filename.endswith(".csv"):
            count = service.import_from_csv(content)
        elif file.filename.endswith((".xlsx", ".xls")):
            count = service.import_from_excel(content)
        else:
            raise HTTPException(status_code=400, detail="Unsupported file format. Please upload CSV or Excel.")
        
        return {"message": f"Successfully imported {count} employees", "count": count}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error during import: {str(e)}")
