"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import Link from "next/link";
import { ArrowLeft, Calendar, Pencil, Tag, FileText, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";
import { DeleteExpenseDialog } from "@/components/delete-expense-dialog";
import { useExpense } from "@/lib/queries";
import { QueryBoundary } from "@/components/query-boundary";

interface ExpenseDetailProps {
  id: string;
}

export function ExpenseDetail({ id }: ExpenseDetailProps) {
  const router = useRouter();
  const query = useExpense(id);

  return (
    <QueryBoundary
      query={query}
      loadingMessage="Loading expense details..."
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
            <h1 className="text-2xl font-bold text-foreground text-balance">Expense Details</h1>
          </div>

          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-xl">{expense.title}</CardTitle>
                  <StatusBadge status={expense.status} />
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="gap-2" asChild>
                    <Link href={`/expenses/${expense.id}/edit`}>
                      <Pencil className="h-4 w-4" />
                      Edit
                    </Link>
                  </Button>
                  <DeleteExpenseDialog
                    expenseId={expense.id}
                    expenseTitle={expense.title}
                    onDeleted={() => router.push("/expenses")}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <IndianRupee className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Amount</p>
                    <p className="text-lg font-semibold font-mono text-foreground">
                      Rs.{expense.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Tag className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Category</p>
                    <p className="text-lg font-medium text-foreground">{expense.category}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="text-lg font-medium text-foreground">
                      {format(new Date(expense.date), "MMMM dd, yyyy")}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Description</p>
                    <p className="text-foreground">{expense.description || "No description provided"}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 border-t border-border pt-4">
                <p className="text-xs text-muted-foreground">
                  Created: {format(new Date(expense.createdAt), "MMM dd, yyyy HH:mm")}
                  {" | "}
                  Updated: {format(new Date(expense.updatedAt), "MMM dd, yyyy HH:mm")}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    />
  );
}
