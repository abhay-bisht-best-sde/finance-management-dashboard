#!/usr/bin/env bash
set -e

echo "Installing uv..."
pip install uv

echo "Installing dependencies..."
uv sync --frozen --active

# Store prisma engines INSIDE project (Render runtime can access this)
PRISMA_DIR="$(pwd)/.prisma"
mkdir -p "$PRISMA_DIR"

export PRISMA_HOME="$PRISMA_DIR"
export PRISMA_BINARY_CACHE_DIR="$PRISMA_DIR"

echo "Fetching Prisma query engine for Render (debian)..."
uv run --active prisma py fetch

echo "Locating downloaded query engine..."
ENGINE_PATH=$(find "$PRISMA_DIR" -name "query-engine*" | head -n 1)

echo "Engine found at: $ENGINE_PATH"

# Save path for runtime
echo "PRISMA_QUERY_ENGINE_BINARY=$ENGINE_PATH" >> .env.runtime

echo "Generating Prisma client..."
uv run --active prisma generate --schema=app/prisma/schema.prisma

echo "Build finished."