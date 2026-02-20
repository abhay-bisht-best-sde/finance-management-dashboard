import { ExpenseTable } from "@/components/expense-table";
import { AnimatedPage } from "@/components/animated-page";

export default function ExpensesPage() {
  return (
    <AnimatedPage>
      <div>
        <h1 className="text-3xl font-bold text-foreground">Expenses</h1>
        <p className="mt-1 text-muted-foreground">
          Manage all your expenses in one place
        </p>
      </div>
      <ExpenseTable />
    </AnimatedPage>
  );
}
