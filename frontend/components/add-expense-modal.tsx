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

interface AddExpenseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddExpenseModal({ open, onOpenChange }: AddExpenseModalProps) {
  const queryClient = useQueryClient();

  function handleSuccess() {
    onOpenChange(false);
    queryClient.invalidateQueries({ queryKey: ["expenses"] });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl" showCloseButton={true}>
        <DialogHeader>
          <DialogTitle>Create New Expense</DialogTitle>
        </DialogHeader>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.05 }}
        >
        <ExpenseForm
          mode="create"
          onSuccess={handleSuccess}
          onCancel={() => onOpenChange(false)}
          hideCardTitle
        />
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
