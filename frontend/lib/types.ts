export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  status: "pending" | "completed" | "cancelled";
  description: string | null;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseFormData {
  title: string;
  amount: number;
  category: string;
  status: "pending" | "completed" | "cancelled";
  description?: string;
  date?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface DashboardData {
  summary: {
    totalExpenses: number;
    totalAmount: number;
    completedAmount: number;
    pendingAmount: number;
    averageExpense: number;
  };
  statusData: { status: string; count: number; amount: number }[];
  categoryData: { id: string; label: string; value: number; amount: number }[];
  monthlyTrend: { x: string; y: number; count: number }[];
  topCategories: { category: string; amount: number; count: number }[];
}

export interface StockData {
  symbol: string;
  name: string;
  sector: string;
  price: number;
  change: number;
  pe: number;
  marketCap: string;
}

export const CATEGORIES = [
  "Food & Dining",
  "Transportation",
  "Shopping",
  "Entertainment",
  "Bills & Utilities",
  "Healthcare",
  "Education",
  "Travel",
  "Groceries",
  "Subscriptions",
] as const;

export const STATUSES = ["pending", "completed", "cancelled"] as const;
