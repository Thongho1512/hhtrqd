from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

from app.infrastructure.database import get_db
from app.infrastructure.models import Note, Employee

router = APIRouter(prefix="/notes", tags=["Notes"])

class NoteCreate(BaseModel):
    employee_id: int
    content: str
    author: Optional[str] = "User"

class AttentionUpdate(BaseModel):
    employee_id: int
    attention_level: int

@router.post("/")
async def create_note(request: NoteCreate, db: Session = Depends(get_db)):
    """[BƯỚC 6] Add a note to an employee profile."""
    try:
        note = Note(
            employee_id=request.employee_id,
            content=request.content,
            author=request.author
        )
        db.add(note)
        db.commit()
        db.refresh(note)
        return note
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{employee_id}")
async def get_notes(employee_id: int, db: Session = Depends(get_db)):
    """Fetch all notes for a specific employee."""
    return db.query(Note).filter(Note.employee_id == employee_id).order_by(Note.created_at.desc()).all()

@router.put("/attention")
async def update_attention(request: AttentionUpdate, db: Session = Depends(get_db)):
    """[BƯỚC 6] Update attention level for an employee."""
    try:
        emp = db.query(Employee).filter(Employee.employee_id == request.employee_id).first()
        if not emp:
            raise HTTPException(status_code=404, detail="Employee not found")
        
        emp.attention_level = request.attention_level
        db.commit()
        return {"status": "success", "attention_level": emp.attention_level}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
