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

## Seguridad y Autenticacion (JWT + Password Hashing)

### 1) Flujo de Autenticacion JWT

El sistema implementa autenticacion stateless usando JSON Web Tokens (JWT). Aqui esta el flujo completo:

**Registro:**
1. Usuario envia email, nombre completo y contraseña a `POST /register`
2. Backend valida que el email no exista ya
3. Contraseña se **hashea** con pbkdf2_sha256 (nunca se guarda en texto plano)
4. Se crea registro en tabla `users` con email + hash + is_active
5. Backend genera JWT token con el user_id y tiempo de expiracion (default 60 min)
6. Frontend recibe token + datos del usuario y los guarda en localStorage

**Login:**
1. Usuario envia email + contraseña a `POST /login`
2. Backend busca usuario por email
3. Verifica que contraseña coincida con el hash guardado
4. Si OK, genera nuevo JWT token
5. Frontend recibe token y lo guarda en localStorage

**Rutas Protegidas:**
1. Frontend agregua el JWT a cada request protegido en header `Authorization: Bearer <token>`
2. Backend valida que el token sea valido y no haya expirado
3. Si token no existe o es invalido → respuesta 401 Unauthorized
4. Si OK, extrae user_id del token y procesa la request

### 2) Hash de Contraseñas: pbkdf2_sha256

Las contraseñas **nunca** se guardan en texto plano. Usamos `pbkdf2_sha256`:

- **Algoritmo:** PBKDF2 (Password-Based Key Derivation Function 2) con SHA256
- **Libreria:** passlib (Python)
- **Ventajas:**
  - No hay limite de longitud de contraseña (a diferencia de bcrypt que tiene 72 bytes)
  - Iteraciones configurables para resistir ataques de fuerza bruta
  - Cada contraseña genera un salt unico (no reversible)
  - Rainbow tables son inefectivas porque cada hash es distinto

**Implementacion:**
```python
# Backend/app/core/security.py
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

# Para guardar: 
hashed_password = pwd_context.hash(user_password)

# Para verificar:
is_correct = pwd_context.verify(plain_password, hashed_password)
```

Si un atacante obtiene acceso a la base de datos, solo ve hashes, nunca contraseñas reales.

### 3) Gestion de Sesion (localStorage + Interceptores)

El frontend mantiene la sesion sin necesidad de servidor:

**Almacenamiento:**
- JWT token se guarda en `localStorage` bajo la clave `auth_token`
- Tambien se guarda objeto `user` con id, email, full_name bajo `auth_user`
- `localStorage` persiste entre refreshes de pagina

**Inyeccion de Token:**
- Axios interceptor (`Frontend/src/api/astrolog.ts` y `Frontend/src/api/mars.ts`) 
- Automaticamente agrega `Authorization: Bearer <token>` a cada request
- No necesitas agregar header manualmente en cada llamada

**Cierre de Sesion:**
- Click en "Cerrar Sesión" limpia `localStorage` 
- Limpia estado global de React Context
- Redirige a `/login`

### 4) Multiusuario Real (owner_id)

Aunque el token valida **quien** eres, la seguridad de datos se aplica en CRUD:

- Tabla `astrolog_records` tiene columna `owner_id` (FK a `users.id`)
- Tabla `mars_explorations` tambien tiene `owner_id`
- Backend SIEMPRE filtra por `owner_id = current_user.id`

**Ejemplo:**
```python
# Backend/app/crud/astrolog_record.py
def get_records(db: Session, owner_id: int):
    return db.query(AstrologRecord).filter(
        AstrologRecord.owner_id == owner_id  # <-- Solo datos del usuario actual
    ).all()
```

Esto garantiza que Usuario A no pueda ver/editar/eliminar registros del Usuario B, incluso si intenta manipular IDs en requests.

### 5) Mejores Practicas de Seguridad

**En Produccion:**

1. **JWT_SECRET_KEY**
   - Cambia el valor por defecto en `.env`
   - Usa valor aleatorio fuerte (minimo 32 caracteres)
   - Nunca lo commits al repositorio (`.env` debe estar en `.gitignore`)

2. **HTTPS Obligatorio**
   - JWT se manda en header `Authorization`
   - Sin HTTPS, token se transmite sin cifrado
   - Siempre usa HTTPS en produccion

3. **Token Expiration**
   - Token expira en `ACCESS_TOKEN_EXPIRE_MINUTES` (default 60)
   - Usuario debe reintentar login para obtener nuevo token
   - Para sesiones largas, implementa refresh token (no incluido en este proyecto)

4. **CORS Restrictivo**
   - Limita a dominio(s) conocido(s)
   - No uses `"*"` en produccion

5. **Logging**
   - Log intentos de login fallidos
   - Detecta patrones sospechosos (ej: muchos intentos rapidos)
   - Implementa rate limiting si es necesario

**Troubleshooting de Auth:**

| Error | Causa | Solucion |
|-------|-------|----------|
| 401 Unauthorized | Token expirado o invalido | Usuario debe hacer login de nuevo |
| 403 Forbidden | Usuario no tiene permisos para recurso | Verifica que sea el owner del recurso |
| "CORS blocked" + 500 backend | Error real en backend, no CORS | Revisa `docker-compose logs backend` |

## Estado esperado al finalizar setup

- Backend respondiendo en `http://localhost:8000`
- Frontend respondiendo en `http://localhost:5173`
- Registro/Login funcionando
- Astrolog y Mars mostrando datos del usuario autenticado
