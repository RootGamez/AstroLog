from pydantic import BaseModel, Field, HttpUrl
from typing import Optional, List
from datetime import date, datetime

class MarsPhoto(BaseModel):
    id: int
    sol: int
    camera: dict
    img_src: HttpUrl
    earth_date: date
    rover: dict

class MarsSearchResponse(BaseModel):
    photos: List[MarsPhoto]

class MarsFavoriteCreate(BaseModel):
    rover_name: str
    camera_name: Optional[str] = None
    earth_date: date
    sol: Optional[int] = None
    image_url: HttpUrl

class MarsFavoriteInDB(MarsFavoriteCreate):
    id: int
    is_favorite: bool
    created_at: datetime

    class Config:
        orm_mode = True

class MarsFavoriteResponse(MarsFavoriteInDB):
    pass
