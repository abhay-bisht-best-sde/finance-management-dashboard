"use client";

import { motion } from "framer-motion";
import { SidebarNav } from "@/components/sidebar-nav";
import { Toaster } from "sonner";
import { AddExpenseModalProvider } from "@/components/add-expense-modal-context";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <AddExpenseModalProvider>
      <div className="min-h-screen bg-background">
        <SidebarNav />
        <motion.main
          className="pt-16 md:pt-0 md:pl-64"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <motion.div
            className="mx-auto max-w-7xl p-4 md:p-8"
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.35, delay: 0.05, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </motion.main>
        <Toaster position="top-right" richColors />
      </div>
    </AddExpenseModalProvider>
  );
}
