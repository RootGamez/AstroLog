from sqlalchemy.orm import Session
from datetime import datetime
from app.db.models import MarsExploration
from app.schemas.mars_exploration import MarsFavoriteCreate

def create_favorite(db: Session, fav_in: MarsFavoriteCreate, owner_id: int):
    db_fav = MarsExploration(
        owner_id=owner_id,
        rover_name=fav_in.rover_name,
        camera_name=fav_in.camera_name,
        earth_date=fav_in.earth_date,
        sol=fav_in.sol,
        image_url=str(fav_in.image_url),
        is_favorite=True,
        created_at=datetime.utcnow()
    )
    db.add(db_fav)
    db.commit()
    db.refresh(db_fav)
    return db_fav

def get_favorites(db: Session, owner_id: int):
    return db.query(MarsExploration).filter(MarsExploration.is_favorite == True, MarsExploration.owner_id == owner_id).order_by(MarsExploration.created_at.desc()).all()

def delete_favorite(db: Session, fav_id: int, owner_id: int):
    db_fav = db.query(MarsExploration).filter(MarsExploration.id == fav_id, MarsExploration.owner_id == owner_id).first()
    if not db_fav:
        return None
    db.delete(db_fav)
    db.commit()
    return db_fav
