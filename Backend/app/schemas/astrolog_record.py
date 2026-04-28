from typing import List, Optional
from datetime import date
from pydantic import BaseModel, Field

class AstrologRecordBase(BaseModel):
    user_title: str = Field(..., max_length=100)
    personal_note: str
    tags: Optional[List[str]] = []
    nasa_date: date
    nasa_title: str
    nasa_explanation: str
    nasa_url: str
    nasa_media_type: str

class AstrologRecordCreate(BaseModel):
    user_title: str = Field(..., max_length=100)
    personal_note: str
    tags: Optional[List[str]] = []
    nasa_date: date

class AstrologRecordUpdate(BaseModel):
    personal_note: Optional[str] = None
    tags: Optional[List[str]] = None

class AstrologRecordInDB(AstrologRecordBase):
    id: int

    class Config:
        orm_mode = True

class AstrologRecordResponse(AstrologRecordInDB):
    pass
