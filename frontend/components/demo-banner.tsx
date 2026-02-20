"use client";

import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";

export function DemoBanner() {
  return (
    <motion.div
      className="flex items-center gap-3 rounded-lg border border-chart-3/30 bg-chart-3/5 px-4 py-3"
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <AlertCircle className="h-4 w-4 shrink-0 text-chart-3" />
      <div className="text-sm">
        <span className="font-medium text-foreground">Demo Mode</span>
        <span className="text-muted-foreground">
          {" "}
          — Viewing sample data. Connect your Supabase database (DATABASE_URL &
          DIRECT_URL) and run{" "}
          <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
            npx prisma db push
          </code>{" "}
          to enable full CRUD operations.
        </span>
      </div>
    </motion.div>
  );
}
