"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
    <Badge
      variant="secondary"
      className={cn(
        "text-xs font-medium capitalize",
        status === "completed" &&
          "border-accent/30 bg-accent/10 text-accent",
        status === "pending" &&
          "border-chart-3/30 bg-chart-3/10 text-chart-3",
        status === "cancelled" &&
          "border-destructive/30 bg-destructive/10 text-destructive"
      )}
    >
      {status}
    </Badge>
    </motion.div>
  );
}
