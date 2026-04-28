from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.schemas.astrolog_record import AstrologRecordCreate, AstrologRecordUpdate, AstrologRecordResponse
from app.db.models import User
from app.crud.astrolog_record import create_record, get_record, get_records, update_record, delete_record
from app.core.deps import get_db, get_current_user

router = APIRouter(prefix="/records", tags=["Astrolog Records"])

@router.post("/", response_model=AstrologRecordResponse, status_code=status.HTTP_201_CREATED)
async def create_astrolog_record(
    record_in: AstrologRecordCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        db_record = await create_record(db, record_in, owner_id=current_user.id)
        return db_record
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/", response_model=List[AstrologRecordResponse])
def list_astrolog_records(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_records(db, owner_id=current_user.id, skip=skip, limit=limit)

@router.get("/{record_id}", response_model=AstrologRecordResponse)
def get_astrolog_record(
    record_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    db_record = get_record(db, record_id, owner_id=current_user.id)
    if not db_record:
        raise HTTPException(status_code=404, detail="Registro no encontrado")
    return db_record

@router.put("/{record_id}", response_model=AstrologRecordResponse)
def update_astrolog_record(
    record_id: int,
    record_in: AstrologRecordUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    db_record = update_record(db, record_id, owner_id=current_user.id, record_in=record_in)
    if not db_record:
        raise HTTPException(status_code=404, detail="Registro no encontrado")
    return db_record

@router.delete("/{record_id}", response_model=AstrologRecordResponse)
def delete_astrolog_record(
    record_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    db_record = delete_record(db, record_id, owner_id=current_user.id)
    if not db_record:
        raise HTTPException(status_code=404, detail="Registro no encontrado")
    return db_record
