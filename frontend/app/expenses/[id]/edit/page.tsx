import { ExpenseEditWrapper } from "@/components/expense-edit-wrapper";

export default async function EditExpensePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ExpenseEditWrapper id={id} />;
}
