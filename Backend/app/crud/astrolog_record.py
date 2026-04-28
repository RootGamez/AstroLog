from sqlalchemy.orm import Session
from sqlalchemy.future import select
from sqlalchemy.exc import NoResultFound
from datetime import date
from app.db.models import AstrologRecord
from app.schemas.astrolog_record import AstrologRecordCreate, AstrologRecordUpdate
from app.services.nasa_apod import fetch_apod_data, NasaAPIError

import asyncio

async def create_record(db: Session, record_in: AstrologRecordCreate):
    try:
        apod_data = await fetch_apod_data(record_in.nasa_date)
    except NasaAPIError as e:
        raise ValueError(f"No se pudo obtener la información astronómica: {str(e)}")

    db_record = AstrologRecord(
        user_title=record_in.user_title,
        personal_note=record_in.personal_note,
        tags=record_in.tags or [],
        nasa_date=record_in.nasa_date,
        nasa_title=apod_data["title"],
        nasa_explanation=apod_data["explanation"],
        nasa_url=apod_data["url"],
        nasa_media_type=apod_data["media_type"]
    )
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    return db_record

def get_record(db: Session, record_id: int):
    return db.query(AstrologRecord).filter(AstrologRecord.id == record_id).first()

def get_records(db: Session, skip: int = 0, limit: int = 100):
    return db.query(AstrologRecord).offset(skip).limit(limit).all()

def update_record(db: Session, record_id: int, record_in: AstrologRecordUpdate):
    db_record = db.query(AstrologRecord).filter(AstrologRecord.id == record_id).first()
    if not db_record:
        return None
    if record_in.personal_note is not None:
        db_record.personal_note = record_in.personal_note
    if record_in.tags is not None:
        db_record.tags = record_in.tags
    db.commit()
    db.refresh(db_record)
    return db_record

def delete_record(db: Session, record_id: int):
    db_record = db.query(AstrologRecord).filter(AstrologRecord.id == record_id).first()
    if not db_record:
        return None
    db.delete(db_record)
    db.commit()
    return db_record
