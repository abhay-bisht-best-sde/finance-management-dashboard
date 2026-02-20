import os
from pathlib import Path
from contextlib import asynccontextmanager

# Load Render build-time env (e.g. PRISMA_QUERY_ENGINE_BINARY) if present
_env_runtime = Path(__file__).resolve().parent.parent / ".env.runtime"
if _env_runtime.exists():
    with open(_env_runtime) as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, _, v = line.partition("=")
                k, v = k.strip(), v.strip().strip("'\"")
                if k and k not in os.environ:
                    os.environ[k] = v

# Render: use same path as build.sh so runtime finds the query engine (build uses .prisma)
if "PRISMA_BINARY_CACHE_DIR" not in os.environ:
    _backend_root = Path(__file__).resolve().parent.parent
    os.environ["PRISMA_BINARY_CACHE_DIR"] = str(_backend_root / ".prisma")

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.core.logging import get_logger, setup_logging
from app.database.prisma_client import PrismaClient
from app.middlewares.request_logging import RequestLoggingMiddleware
from app.middlewares.trace_id import TraceIDMiddleware
from app.routers import advisor, dashboard, expenses, stocks

# -------------------------------------------------------------------
# Setup
# -------------------------------------------------------------------

settings = get_settings()

if settings.database_url and "connection_limit" not in settings.database_url:
    sep = "&" if "?" in settings.database_url else "?"
    os.environ["DATABASE_URL"] = settings.database_url + sep + "connection_limit=1"

setup_logging()
logger = get_logger(__name__)

# -------------------------------------------------------------------
# Lifespan (Startup / Shutdown) — this is where DB connects
# -------------------------------------------------------------------

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting Pensive API...")
    logger.info("Environment: %s", settings.ENVIRONMENT)

    try:
        await PrismaClient.connect()
        logger.info("Database connection established")
    except Exception as e:
        logger.exception("Failed to connect to database")
        raise e

    yield

    logger.info("Shutting down Pensive API...")
    try:
        await PrismaClient.disconnect()
        logger.info("Database connection closed")
    except Exception:
        logger.exception("Error while disconnecting database")


# -------------------------------------------------------------------
# FastAPI App
# -------------------------------------------------------------------

app = FastAPI(
    title="Pensive API",
    version="0.1.0",
    lifespan=lifespan,
)

# -------------------------------------------------------------------
# Middlewares
# -------------------------------------------------------------------

app.add_middleware(TraceIDMiddleware)
app.add_middleware(RequestLoggingMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------------------------------------------
# Routers
# -------------------------------------------------------------------

app.include_router(expenses.router)
app.include_router(dashboard.router)
app.include_router(stocks.router)
app.include_router(advisor.router)

# -------------------------------------------------------------------
# Health Check (Render uses this implicitly)
# -------------------------------------------------------------------

@app.get("/health", tags=["Health"])
async def health():
    return {"status": "healthy"}