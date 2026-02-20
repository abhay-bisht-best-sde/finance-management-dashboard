#!/usr/bin/env bash
set -e

echo "Starting FastAPI server on port ${PORT:-8000}..."

# Single worker to avoid multiple Prisma clients and connection pool exhaustion (e.g. Supabase free tier)
exec uvicorn app.main:app \
  --host 0.0.0.0 \
  --port ${PORT:-8000} \
  --workers 1