.PHONY: help build-backend rebuild-backend up-db start backend-shell alembic-rev alembic-upgrade frontend-dev frontend-build logs-db db-psql

help:
	@echo "Makefile - shortcuts for common tasks"
	@echo "  build-backend       Build backend Docker image"
	@echo "  rebuild-backend     Rebuild backend image (no-cache)"
	@echo "  up-db               Start only the database service"
	@echo "  start               Start db and backend (detached)"
	@echo "  alembic-rev         Create alembic revision: make alembic-rev m=\"msg\""
	@echo "  alembic-upgrade     Apply migrations (upgrade head)"
	@echo "  backend-shell       Start a shell in the backend container"
	@echo "  frontend-dev        Start frontend dev server (local)"
	@echo "  frontend-build      Build frontend (local)"
	@echo "  logs-db             Follow DB logs"
	@echo "  db-psql             Open psql shell in db container"

# Backend image build
build-backend:
	docker-compose build backend

rebuild-backend:
	docker-compose build --no-cache backend

# Start only database
up-db:
	docker-compose up -d db

# Start db + backend
start:
	docker-compose up -d db backend

# Run an interactive shell in backend
backend-shell:
	docker-compose run --rm backend /bin/sh

# Create alembic revision (use m="message")
alembic-rev:
	@if [ -z "$(m)" ]; then echo "Provide a message: make alembic-rev m=\"create table\""; exit 1; fi
	docker-compose run --rm backend alembic revision --autogenerate -m "$(m)"

# Apply migrations
alembic-upgrade:
	docker-compose run --rm backend alembic upgrade head

# Frontend helpers (run locally)
frontend-dev:
	cd Frontend && npm run dev

frontend-build:
	cd Frontend && npm run build

# Logs and DB shell
logs-db:
	docker-compose logs -f db

db-psql:
	docker-compose exec db psql -U astrolog -d astrologdb
