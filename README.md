# TareaSeminario

Proyecto fullstack con:
- Backend en FastAPI + SQLAlchemy + Alembic + PostgreSQL
- Frontend en React + Vite + TypeScript
- Docker Compose para base de datos y backend
- Autenticacion JWT (registro/login) y rutas protegidas

## Que hace el proyecto

La aplicacion permite:
- Registrar e iniciar sesion de usuarios con JWT.
- Gestionar una bitacora astronomica (Astrolog): crear, editar, eliminar y listar registros.
- Explorar fotos de Mars de NASA y guardar favoritos.
- Trabajar en modo multiusuario real: cada usuario ve y manipula solo sus propios registros/favoritos.

## Requisitos previos

Instala esto antes de empezar:

1. Docker Desktop (incluye Docker Engine y Docker Compose).
2. Make.
3. Node.js (recomendado LTS 20+) y npm.
4. Git.

Comandos para verificar:

```bash
docker --version
docker compose version
make --version
node --version
npm --version
```

## Estructura general

- Backend: API, modelos, migraciones y servicios.
- Frontend: interfaz React.
- Makefile en la raiz con atajos para levantar y migrar.

## Flujo recomendado (paso a paso)

## 1) Entrar a la raiz del proyecto


## 2) Levantar base de datos y backend

### Opcion A (recomendada): con make

```bash
make start
```

Esto levanta:
- PostgreSQL en puerto 5432
- Backend en puerto 8000

### Opcion B: con docker compose directo

```bash
docker-compose up -d db backend
```

## 3) Ejecutar migraciones

Siempre que sea primer arranque o haya cambios de esquema, ejecuta migraciones:

### Opcion A: con make

```bash
make alembic-upgrade
```

### Opcion B: con docker compose directo

```bash
docker-compose run --rm backend alembic upgrade head
```

## 4) Levantar frontend

En otra terminal:

```bash
cd Frontend
npm install
npm run dev
```

Frontend por defecto:
- http://localhost:5173

Backend por defecto:
- http://localhost:8000

## Arranque rapido (resumen)

Terminal 1 (raiz):

```bash
make start
make alembic-upgrade
```

Terminal 2:

```bash
cd Frontend
npm install
npm run dev
```

## Variables de entorno (backend)

El backend usa archivo `.env` en la carpeta Backend.

Variables importantes:
- `NASA_API_KEY`
- `JWT_SECRET_KEY`
- `ACCESS_TOKEN_EXPIRE_MINUTES` (opcional)
- `DATABASE_URL` (en Docker ya se inyecta por compose)

Si no tienes `NASA_API_KEY`, algunas funciones de NASA pueden usar demo key o fallar segun limites.

## Comandos utiles del Makefile

```bash
make help               # lista todos los atajos
make start              # levanta db + backend
make up-db              # levanta solo db
make alembic-upgrade    # aplica migraciones
make alembic-rev m="msg" # crea nueva migracion
make logs-db            # logs de postgres
make db-psql            # consola psql en contenedor
make rebuild-backend    # rebuild backend sin cache
make frontend-dev       # arranca frontend local
make frontend-build     # build frontend local
```

## Si cambias dependencias de Python

Si editas `Backend/requirements.txt`, reconstruye la imagen del backend:

```bash
make rebuild-backend
make start
```

O con docker compose:

```bash
docker-compose build --no-cache backend
docker-compose up -d backend
```

## Troubleshooting rapido

## 1) Error CORS en navegador + 500

Muchas veces no es CORS real. Revisa logs del backend:

```bash
docker-compose logs -f backend
```

Si backend responde 500, el navegador suele mostrarlo como CORS.

## 2) Migracion aplicada pero app sigue con error de columna

Asegura que corriste:

```bash
make alembic-upgrade
```

y revisa en logs que llegue a `upgrade ... -> head`.

## 3) Puerto ocupado

Si 8000 o 5173 esta ocupado, cierra procesos previos o ajusta puertos.

## Endpoints clave (auth)

- `POST /register`
- `POST /login`

Con login/register exitoso, el frontend guarda JWT y habilita rutas protegidas.

## Estado esperado al finalizar setup

- Backend respondiendo en `http://localhost:8000`
- Frontend respondiendo en `http://localhost:5173`
- Registro/Login funcionando
- Astrolog y Mars mostrando datos del usuario autenticado
