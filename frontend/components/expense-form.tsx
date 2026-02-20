"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { CATEGORIES, STATUSES } from "@/lib/types";
import { useCreateExpense, useUpdateExpense } from "@/lib/queries";
import { isAxiosError } from "axios";
import type { Expense } from "@/lib/types";

interface ExpenseFormProps {
  expense?: Expense;
  mode: "create" | "edit";
  onSuccess?: () => void;
  onCancel?: () => void;
  hideCardTitle?: boolean;
}

export function ExpenseForm({ expense, mode, onSuccess, onCancel, hideCardTitle }: ExpenseFormProps) {
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const createMutation = useCreateExpense();
  const updateMutation = useUpdateExpense(expense?.id ?? "");

  const [formData, setFormData] = useState({
    title: expense?.title || "",
    amount: expense?.amount?.toString() || "",
    category: expense?.category || "",
    status: expense?.status || "pending",
    description: expense?.description || "",
    date: expense?.date
      ? new Date(expense.date).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
  });

  const loading = mode === "create" ? createMutation.isPending : updateMutation.isPending;

  function validate() {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.amount || parseFloat(formData.amount) <= 0)
      newErrors.amount = "Amount must be a positive number";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.date) newErrors.date = "Date is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    const body = {
      title: formData.title.trim(),
      amount: parseFloat(formData.amount),
      category: formData.category,
      status: formData.status as "pending" | "completed" | "cancelled",
      description: formData.description || undefined,
      date: formData.date,
    };

    try {
      if (mode === "create") {
        await createMutation.mutateAsync(body);
      } else {
        await updateMutation.mutateAsync(body);
      }
      toast.success(
        mode === "create"
          ? "Expense created successfully"
          : "Expense updated successfully"
      );
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/expenses");
        router.refresh();
      }
    } catch (error) {
      const message = isAxiosError(error) && error.response?.data
        ? (typeof error.response.data === "object" && error.response.data && "detail" in error.response.data
          ? String((error.response.data as { detail: unknown }).detail)
          : "Something went wrong")
        : error instanceof Error ? error.message : "Failed to save expense";
      toast.error(message);
    }
  }

  return (
    <Card>
      {!hideCardTitle && (
        <CardHeader>
          <CardTitle>
            {mode === "create" ? "Create New Expense" : "Edit Expense"}
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className={hideCardTitle ? "pt-0" : undefined}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="e.g., Grocery shopping"
                aria-invalid={!!errors.title}
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount (Rs.)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                placeholder="0.00"
                aria-invalid={!!errors.amount}
              />
              {errors.amount && (
                <p className="text-sm text-destructive">{errors.amount}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(val) =>
                  setFormData({ ...formData, category: val })
                }
              >
                <SelectTrigger id="category" aria-invalid={!!errors.category}>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-sm text-destructive">{errors.category}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(val) =>
                  setFormData({
                    ...formData,
                    status: val as "pending" | "completed" | "cancelled",
                  })
                }
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                aria-invalid={!!errors.date}
              />
              {errors.date && (
                <p className="text-sm text-destructive">{errors.date}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Add any additional details..."
              rows={3}
            />
          </div>

          <div className="flex items-center gap-3">
            <Button type="submit" disabled={loading} className="gap-2">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {mode === "create" ? "Create Expense" : "Update Expense"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => (onCancel ? onCancel() : router.back())}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
