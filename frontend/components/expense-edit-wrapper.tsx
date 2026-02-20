"use client";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ExpenseForm } from "@/components/expense-form";
import { useExpense } from "@/lib/queries";
import { QueryBoundary } from "@/components/query-boundary";

interface ExpenseEditWrapperProps {
  id: string;
}

export function ExpenseEditWrapper({ id }: ExpenseEditWrapperProps) {
  const router = useRouter();
  const query = useExpense(id);

  return (
    <QueryBoundary
      query={query}
      loadingMessage="Loading expense..."
      children={(expense) => (
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Go back</span>
            </Button>
            <h1 className="text-2xl font-bold text-foreground">Edit Expense</h1>
          </div>
          <ExpenseForm expense={expense} mode="edit" />
        </motion.div>
      )}
    />
  );
}
