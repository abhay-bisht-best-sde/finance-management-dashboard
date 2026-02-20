# Pensive.ai – Smart Expense Manager

- **Backend:** Python - FastAPI 
- **Database:** Supabase - PostgreSQL
- **Frontend:** Next.js

---

## Requirements Checklist

| Requirement | Status |
|------------|--------|
| Full CRUD (UI + REST APIs) | ✅ Expenses: Create, List, View, Edit, Delete |
| Data visualization / reporting | ✅ Dashboard: summary, status/category charts, monthly trend |
| Third-party API integration | ✅ Yahoo Finance (stock quotes) + OpenAI (AI advisor) |

---

## Features Implemented

- **Expense CRUD** – Create, view list, view detail, edit, and delete expenses from the UI. Full REST API for the same operations (GET, POST, PUT, PATCH, DELETE) with pagination, filters (category, status), and search.
- **Dashboard & reporting** – Summary metrics (total expenses, amount, completed/pending), status-wise counts and amounts, category breakdown (pie chart), monthly trend chart, and top 5 categories by amount. All driven by live database data; updates when you add, edit, or delete expenses.
- **Date filters** – Dashboard supports filtering by year, year+month, or custom date range (from/to).
- **Stock Advisor** – NSE (India) stock data pulled from **Yahoo Finance API**; table shows symbol, name, sector, price, change %, P/E, market cap. Fallback data when the API is unavailable.
- **AI investment advisor** – **OpenAI** integration: set budget (Rs.) and risk level, then get streaming AI recommendations based on current stock data. Markdown-rendered response with disclaimers.
- **Responsive UI** – Sidebar navigation (collapsible on mobile), modals for add/view/edit expense, toast notifications, loading and error states.

---

## Local Setup

### Prerequisites

- Python 3.11+ (e.g. with [uv](https://docs.astral.sh/uv/))
- Node.js 18+
- Supabase account (or PostgreSQL)

### 1. Backend

```bash
cd backend
# Create virtualenv and install deps (e.g. uv)
uv sync
# Or: pip install -r requirements.txt
cp .env.example .env
# Edit .env with your SUPABASE_* and OPENAI_API_KEY
uv run uvicorn main:app --host 0.0.0.0 --port 8000 --reload
# Or: make run
```

API: http://localhost:8000  
Docs: http://localhost:8000/docs

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
# Set NEXT_PUBLIC_API_URL=http://localhost:8000 (default)
npm run dev
```

App: http://localhost:3000

### Environment Variables

**Backend** (`backend/.env`):

See `backend/.env.example`. Required:

- `SUPABASE_URL` – Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` or `SUPABASE_ANON_KEY`
- `OPENAI_API_KEY` – for AI advisor (optional for stocks-only)

**Frontend** (`frontend/.env.local`):

- `NEXT_PUBLIC_API_URL` – Backend API URL (e.g. `http://localhost:8000`)

---

## Database & Migrations

The app uses **Supabase** (PostgreSQL). The `expenses` table can be created via:

1. **Supabase Dashboard:** Table Editor → New table → name `expenses`, columns:  
   `id` (uuid, default gen_random_uuid()), `title` (text), `amount` (float8), `category` (text), `status` (text, default 'pending'), `description` (text nullable), `date` (timestamptz), `created_at` (timestamptz), `updated_at` (timestamptz).

---

## How to Run Locally (summary)

1. Start backend: `cd backend && uv run uvicorn main:app --reload --port 8000`
2. Start frontend: `cd frontend && npm run dev`
3. Open http://localhost:3000

---

## Deployment

- **Frontend:** Deploy to Vercel (or Netlify, etc.). Set `NEXT_PUBLIC_API_URL` to your deployed backend URL.
- **Backend:** Deploy to Railway, Render, Fly.io, or similar. Set env vars (SUPABASE_*, OPENAI_API_KEY). Set `CORS_ORIGINS` to your frontend URL (e.g. `https://your-app.vercel.app`).

*(Replace with your actual live frontend URL and backend URL before submission.)*

---

## How to Test

### 1. CRUD (Expenses)

- **Create:** Open **Expenses** → “Add Expense” → fill form → Save. Record appears in list.
- **View list:** **Expenses** shows paginated list; use filters/search if available.
- **View details:** Click a row or “View” to see expense details.
- **Update:** Open an expense → “Edit” → change fields → Save. List/detail reflects changes.
- **Delete:** Open an expense → “Delete” (or list action) → confirm. Record is removed.

### 2. Report / Visualization

- Go to **Dashboard** (home: `/`).
- You should see: summary cards (total expenses, amount, status breakdown), category chart, monthly trend, top categories.
- Add/edit/delete expenses and refresh or re-open Dashboard to confirm numbers and charts update.

### 3. Third-Party API Features

- **Stock data (Yahoo Finance):** Open **Stock Advisor** (`/stocks`). The table shows NSE stock data fetched from Yahoo Finance. If the API is unavailable, fallback data is shown.
- **AI Advisor (OpenAI):** On the same page, set Budget and Risk Level → **Get Advice**. Streaming AI recommendations use the stock data and OpenAI API.

---

## API Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/expenses` | List expenses (pagination, filters) |
| POST | `/api/expenses` | Create expense |
| GET | `/api/expenses/{id}` | Get one expense |
| PUT/PATCH | `/api/expenses/{id}` | Update expense |
| DELETE | `/api/expenses/{id}` | Delete expense |
| GET | `/api/dashboard` | Dashboard aggregates (year/month/date range) |
| GET | `/api/stocks` | NSE stock data (Yahoo Finance) |
| POST | `/api/stocks/advisor` | SSE stream – AI investment advice (OpenAI) |