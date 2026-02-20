"use client";

import { motion } from "framer-motion";
import { format } from "date-fns";
import { Calendar, Tag, FileText, IndianRupee } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";
import { useExpense } from "@/lib/queries";
import { QueryBoundary } from "@/components/query-boundary";

interface ViewExpenseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expenseId: string | null;
}

export function ViewExpenseModal({
  open,
  onOpenChange,
  expenseId,
}: ViewExpenseModalProps) {
  const query = useExpense(expenseId ?? "");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg" showCloseButton={true}>
        <DialogHeader>
          <DialogTitle>Expense Details</DialogTitle>
        </DialogHeader>
        {expenseId ? (
        <QueryBoundary
          query={query}
          loadingMessage="Loading expense details..."
          children={(expense) => (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="space-y-4"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-xl font-semibold leading-tight text-foreground">
                  {expense.title}
                </h2>
                <StatusBadge status={expense.status} />
              </div>
              <Card className="border-0 shadow-none bg-transparent">
                <CardContent className="pt-0 px-0">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <IndianRupee className="h-4 w-4 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm text-muted-foreground">Amount</p>
                        <p className="font-semibold font-mono text-foreground">
                          Rs.{expense.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <Tag className="h-4 w-4 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm text-muted-foreground">Category</p>
                        <p className="font-medium text-foreground">{expense.category}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 sm:col-span-2">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <Calendar className="h-4 w-4 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm text-muted-foreground">Date</p>
                        <p className="font-medium text-foreground">
                          {format(new Date(expense.date), "MMMM dd, yyyy")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 sm:col-span-2">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <FileText className="h-4 w-4 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm text-muted-foreground">Description</p>
                        <p className="text-sm text-foreground">
                          {expense.description || "No description provided"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 border-t border-border pt-3">
                    <p className="text-xs text-muted-foreground">
                      Created: {format(new Date(expense.createdAt), "MMM dd, yyyy HH:mm")}
                      {" · "}
                      Updated: {format(new Date(expense.updatedAt), "MMM dd, yyyy HH:mm")}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
