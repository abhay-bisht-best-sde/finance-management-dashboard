"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { AddExpenseModal } from "@/components/add-expense-modal";

const AddExpenseModalContext = createContext<{
  openAddExpenseModal: () => void;
} | null>(null);

export function AddExpenseModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const openAddExpenseModal = useCallback(() => setOpen(true), []);

  return (
    <AddExpenseModalContext.Provider value={{ openAddExpenseModal }}>
      {children}
      <AddExpenseModal open={open} onOpenChange={setOpen} />
    </AddExpenseModalContext.Provider>
  );
}

export function useAddExpenseModal() {
  const ctx = useContext(AddExpenseModalContext);
  if (!ctx) {
    throw new Error("useAddExpenseModal must be used within AddExpenseModalProvider");
  }
  return ctx;
}
