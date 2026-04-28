from fastapi import FastAPI
from app.api import astrolog_record
from app.db.models import Base
from app.core.deps import engine

# Crear tablas si no existen (solo para desarrollo)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Astrolog: Tu Bitácora Estelar")

app.include_router(astrolog_record.router)
