"use client";

import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ExpenseForm } from "@/components/expense-form";
import { useQueryClient } from "@tanstack/react-query";
import { useExpense } from "@/lib/queries";
import { QueryBoundary } from "@/components/query-boundary";

interface EditExpenseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expenseId: string | null;
}

export function EditExpenseModal({
  open,
  onOpenChange,
  expenseId,
}: EditExpenseModalProps) {
  const queryClient = useQueryClient();
  const query = useExpense(expenseId ?? "");

  function handleSuccess() {
    onOpenChange(false);
    queryClient.invalidateQueries({ queryKey: ["expenses"] });
    if (expenseId) {
      queryClient.invalidateQueries({ queryKey: ["expenses", "detail", expenseId] });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl" showCloseButton={true}>
        <DialogHeader>
          <DialogTitle>Edit Expense</DialogTitle>
        </DialogHeader>
        {expenseId ? (
          <QueryBoundary
            query={query}
            loadingMessage="Loading expense..."
            children={(expense) => (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
              >
              <ExpenseForm
                expense={expense}
                mode="edit"
                onSuccess={handleSuccess}
                onCancel={() => onOpenChange(false)}
                hideCardTitle
              />
              </motion.div>
            )}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
