.PHONY: run db-generate db-migrate db-visuals install

install:
	uv sync
run:
	uv run --active uvicorn app.main:app --host 0.0.0.0 --port 8000

db-generate:
	PATH=".venv/bin:$$PATH" prisma generate --schema=app/prisma/schema.prisma

db-migrate:
	PATH=".venv/bin:$$PATH" prisma db push --schema=app/prisma/schema.prisma

db-visuals:
	prisma studio --schema=app/prisma/schema.prisma