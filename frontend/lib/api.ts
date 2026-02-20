import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL!;

export const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  timeout: 30000,
});

export function getApiUrl(): string {
  return baseURL;
}

export const expensesApi = {
  list: (params?: {
    page?: number;
    limit?: number;
    category?: string;
    status?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  }) =>
    api.get<{ data: unknown[]; pagination: { page: number; limit: number; total: number; totalPages: number } }>(
      "/api/expenses",
      { params }
    ),
  get: (id: string) => api.get<{ data: unknown }>(`/api/expenses/${id}`),
  create: (body: { title: string; amount: number; category: string; status?: string; description?: string; date?: string }) =>
    api.post<{ data: unknown }>("/api/expenses", body),
  update: (id: string, body: Partial<{ title: string; amount: number; category: string; status: string; description: string; date: string }>) =>
    api.put<{ data: unknown }>(`/api/expenses/${id}`, body),
  delete: (id: string) => api.delete(`/api/expenses/${id}`),
};

export interface DashboardParams {
  year?: number;
  month?: number;
  date_from?: string;
  date_to?: string;
}

export const dashboardApi = {
  get: (params?: DashboardParams) =>
    api.get<{ data: import("@/lib/types").DashboardData; demo?: boolean }>("/api/dashboard", {
      params: params ? { year: params.year, month: params.month, date_from: params.date_from, date_to: params.date_to } : undefined,
    }),
};

export const stocksApi = {
  get: () =>
    api.get<{ data: import("@/lib/types").StockData[]; source?: string }>("/api/stocks"),
};

export async function advisorStream(
  body: { stocks: unknown[]; budget?: string; riskLevel?: string; messages?: unknown[] }
): Promise<ReadableStream<Uint8Array> | null> {
  const url = `${getApiUrl()}/api/stocks/advisor`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok || !res.body) return null;
  return res.body;
}
