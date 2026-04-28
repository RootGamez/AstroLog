from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import astrolog_record
from app.db.models import Base
from app.core.deps import engine

# Crear tablas si no existen (solo para desarrollo)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Astrolog: Tu Bitácora Estelar")

# Habilitar CORS para desarrollo
app.add_middleware(
	CORSMiddleware,
	allow_origins=["*"],  # O restringe a ["http://localhost:5173"]
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"],
)

from app.api.endpoints.mars import router as mars_router

app.include_router(astrolog_record.router)
app.include_router(mars_router)
