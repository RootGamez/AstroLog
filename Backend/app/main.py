from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import astrolog_record
from app.api.endpoints.auth import router as auth_router
from app.db.models import Base
from app.core.deps import engine
from app.core import config
import logging

# Crear tablas si no existen (solo para desarrollo)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Astrolog: Tu Bitácora Estelar")

if config.is_using_demo_key():
	logging.getLogger("uvicorn.error").warning("NASA_API_KEY not configured or using DEMO_KEY — consider setting a real key in the environment.")

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
app.include_router(auth_router)
app.include_router(mars_router)
