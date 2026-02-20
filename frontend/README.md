# Pensive — Smart Expense Manager

Full-stack expense manager with **CRUD (UI + REST API)**, **nivo dashboard**, and **AI-powered Indian stock investment advisor** (OpenAI + Indian stocks API).

## Tech Stack

- **Frontend:** Next.js 16, React 19, Tailwind CSS
- **Backend:** Next.js API Routes (REST)
- **Database:** PostgreSQL via Supabase, Prisma ORM
- **Charts:** Nivo (Bar, Pie, Line)
- **Third-party:** Yahoo Finance (NSE India quotes), OpenAI (LLM advice)

---

## Local Setup

### 1. Clone and install

```bash
git clone <your-repo-url>
cd assignment
pnpm install
```

### 2. Environment variables

Copy the example env and fill in values:

```bash
cp .env.example .env
```

Edit `.env`:

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | For real DB | Supabase PostgreSQL connection string (pooled, port 6543) |
| `DIRECT_URL` | For migrations | Supabase direct connection (port 5432) |
| `OPENAI_API_KEY` | For AI advisor | OpenAI API key from [platform.openai.com](https://platform.openai.com/api-keys) |

- **Without `DATABASE_URL`:** App runs in **demo mode** (in-memory data). CRUD and dashboard still work.
- **With `DATABASE_URL`:** App uses Supabase. Run migrations and seed (see below).

### 3. Database setup (Supabase)

1. Create a project at [supabase.com](https://supabase.com).
2. In **Project Settings → Database** copy:
   - **Connection string → URI** (Transaction pooler, port 6543) → use as `DATABASE_URL`
   - **Connection string → URI** (Session mode, port 5432) → use as `DIRECT_URL`
3. In the project root:

```bash
pnpm prisma generate
pnpm prisma db push
pnpm db:seed
```

### 4. Run the app

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

- **Dashboard:** `/`
- **Expenses (list):** `/expenses` — use the **Add Expense** button to open the add-expense modal
- **Stock Advisor:** `/stocks`

---

## REST API (Expenses)

Base path: `/api/expenses`

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/expenses` | Create expense |
| `GET` | `/api/expenses` | List (query: `page`, `limit`, `search`, `category`, `status`, `sortBy`, `sortOrder`) |
| `GET` | `/api/expenses/{id}` | Get one |
| `PUT` | `/api/expenses/{id}` | Full update |
| `PATCH` | `/api/expenses/{id}` | Partial update |
| `DELETE` | `/api/expenses/{id}` | Delete |

Example (create):

```bash
curl -X POST http://localhost:3000/api/expenses \
  -H "Content-Type: application/json" \
  -d '{"title":"Lunch","amount":350,"category":"Food & Dining","status":"pending"}'
```

---

## Dashboard

- **Route:** `/` (home)
- **Charts (Nivo):** Status-wise counts (bar), Category distribution (pie), Monthly trend (line), Top categories (table)
- Data is from the database (or demo store when no DB). Charts update when you add/edit/delete expenses.

---

## Third-Party Integrations

1. **Indian stocks (NSE):** `/api/stocks` fetches live quotes from Yahoo Finance (`.NS` symbols). Falls back to static data if the API is unavailable.
2. **OpenAI (LLM):** Stock Advisor uses `OPENAI_API_KEY` to generate investment suggestions based on the stock report and user budget/risk.

---

## Deployment (Vercel + Supabase)

1. Push the repo to GitHub.
2. In [Vercel](https://vercel.com), import the project and set:
   - **Framework:** Next.js
   - **Root directory:** (leave default)
3. Add environment variables in Vercel:
   - `DATABASE_URL` — Supabase pooled URL
   - `DIRECT_URL` — Supabase direct URL (for build-time Prisma)
   - `OPENAI_API_KEY` — OpenAI key
4. Deploy. Run migrations against production DB once:

   ```bash
   DATABASE_URL="<prod-pooled-url>" DIRECT_URL="<prod-direct-url>" pnpm prisma db push
   pnpm prisma db seed   # optional
   ```

5. Use the live URL for all testing.

---

## How to Test (Step-by-Step)

### CRUD (UI)

1. Go to **Expenses** and click **Add Expense** to open the modal. Create an expense (title, amount, category, status, date). Submit.
2. On the list, open **View** (eye) and **Edit** (pencil). Change fields and save.
3. Delete an expense via the trash icon and confirm.

### CRUD (API)

1. Create:  
   `POST /api/expenses` with body  
   `{"title":"Test","amount":100,"category":"Shopping","status":"pending"}`  
   → 201 and expense in response.
2. List:  
   `GET /api/expenses` → 200 with `data` and `pagination`.
3. Get one:  
   `GET /api/expenses/<id>` → 200 with expense.
4. Update:  
   `PATCH /api/expenses/<id>` with `{"status":"completed"}` → 200.
5. Delete:  
   `DELETE /api/expenses/<id>` → 200.

### Dashboard

1. Open **Dashboard** (`/`).
2. Confirm summary cards and Nivo charts show data.
3. Add or delete an expense, refresh (or wait for refresh). Charts and totals should update.

### Stock Advisor (AI + Indian stocks)

1. Open **Stock Advisor** (`/stocks`).
2. Confirm the table shows Indian stocks (from Yahoo or fallback).
3. Set budget and risk, click **Get Advice**. If `OPENAI_API_KEY` is set, you get LLM-generated suggestions; otherwise the API returns an error (set the key to test).

---

## Scripts

| Command | Description |
|--------|-------------|
| `pnpm dev` | Start Next.js dev server |
| `pnpm build` | Production build |
| `pnpm start` | Run production server |
| `pnpm db:push` | Push Prisma schema to DB (no migrations) |
| `pnpm db:seed` | Seed expenses |

---

## License

MIT.
