"use client";

import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { expensesApi, dashboardApi, stocksApi } from "./api";
import type { Expense, PaginatedResponse, DashboardData, StockData } from "./types";

export const expenseKeys = {
  all: ["expenses"] as const,
  list: (params: Record<string, unknown>) => ["expenses", "list", params] as const,
  detail: (id: string) => ["expenses", "detail", id] as const,
};

export function useExpensesList(params: {
  page?: number;
  limit?: number;
  category?: string;
  status?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
}) {
  return useQuery({
    queryKey: expenseKeys.list(params),
    queryFn: async () => {
      const { data } = await expensesApi.list(params);
      return data as PaginatedResponse<Expense>;
    },
    placeholderData: keepPreviousData,
  });
}

export function useExpense(id: string | null) {
  return useQuery({
    queryKey: expenseKeys.detail(id ?? ""),
    queryFn: async () => {
      const { data } = await expensesApi.get(id!);
      return data.data as Expense;
    },
    enabled: !!id,
  });
}

export function useCreateExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Parameters<typeof expensesApi.create>[0]) => expensesApi.create(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: expenseKeys.all });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useUpdateExpense(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Parameters<typeof expensesApi.update>[1]) => expensesApi.update(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: expenseKeys.all });
      qc.invalidateQueries({ queryKey: expenseKeys.detail(id) });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useDeleteExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => expensesApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: expenseKeys.all });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export type DashboardFilters = {
  year?: number;
  month?: number;
  date_from?: string;
  date_to?: string;
};

export const dashboardKeys = {
  all: ["dashboard"] as const,
  list: (filters: DashboardFilters) => ["dashboard", filters] as const,
};

export function useDashboard(filters: DashboardFilters = {}) {
  return useQuery({
    queryKey: dashboardKeys.list(filters),
    queryFn: async () => {
      try {
        const { data } = await dashboardApi.get(
          Object.keys(filters).length ? filters : undefined
        );
        return data as { data: DashboardData; demo?: boolean };
      } catch (err: unknown) {
        const message =
          err && typeof err === "object" && "response" in err
            ? (err as { response?: { data?: { detail?: string } } }).response?.data?.detail
            : null;
        throw new Error(
          typeof message === "string" ? message : "Failed to load dashboard. Please try again."
        );
      }
    },
    refetchInterval: 30000,
  });
}

export function useStocks() {
  return useQuery({
    queryKey: ["stocks"],
    queryFn: async () => {
      const { data } = await stocksApi.get();
      return data as { data: StockData[] };
    },
    refetchInterval: 60000,
  });
}
