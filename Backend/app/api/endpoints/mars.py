from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional
from datetime import date
from app.core.deps import get_db, get_current_user
from app.services.nasa_service import MarsService, NasaServiceError
from app.crud.mars_exploration import create_favorite, get_favorites, delete_favorite
from app.schemas.mars_exploration import MarsSearchResponse, MarsFavoriteCreate, MarsFavoriteResponse
from app.db.models import User

router = APIRouter(prefix="/api/mars", tags=["Mars Explorer"])

@router.get("/search", response_model=MarsSearchResponse)
async def search_mars_photos(date: Optional[date] = Query(None), rover: str = Query(..., min_length=1)):
    service = MarsService()
    try:
        result = await service.search_photos(rover=rover, earth_date=date)
        return result
    except NasaServiceError as e:
        raise HTTPException(status_code=502, detail=str(e))

@router.post("/favorites", response_model=MarsFavoriteResponse, status_code=status.HTTP_201_CREATED)
def add_favorite(
    fav_in: MarsFavoriteCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    db_fav = create_favorite(db, fav_in, owner_id=current_user.id)
    return db_fav

@router.get("/favorites", response_model=list[MarsFavoriteResponse])
def list_favorites(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_favorites(db, owner_id=current_user.id)

@router.delete("/favorites/{fav_id}", response_model=MarsFavoriteResponse)
def remove_favorite(
    fav_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    db_fav = delete_favorite(db, fav_id, owner_id=current_user.id)
    if not db_fav:
        raise HTTPException(status_code=404, detail="Favorite not found")
    return db_fav
