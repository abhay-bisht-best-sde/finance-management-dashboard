"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { IndianRupee, Receipt, CheckCircle, Clock, BarChart3 } from "lucide-react";
import type { DashboardData } from "@/lib/types";

interface SummaryCardsProps {
  summary: DashboardData["summary"];
}

const cards = [
  {
    key: "totalAmount" as const,
    title: "Total Expenses",
    icon: IndianRupee,
    format: (v: number) => `Rs.${v.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
    color: "bg-primary/10 text-primary",
  },
  {
    key: "totalExpenses" as const,
    title: "Total Records",
    icon: Receipt,
    format: (v: number) => v.toString(),
    color: "bg-chart-2/10 text-chart-2",
  },
  {
    key: "completedAmount" as const,
    title: "Completed",
    icon: CheckCircle,
    format: (v: number) => `Rs.${v.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
    color: "bg-accent/10 text-accent",
  },
  {
    key: "pendingAmount" as const,
    title: "Pending",
    icon: Clock,
    format: (v: number) => `Rs.${v.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
    color: "bg-chart-3/10 text-chart-3",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

export function SummaryCards({ summary }: SummaryCardsProps) {
  const isEmpty = summary.totalExpenses === 0;

  if (isEmpty) {
    return (
      <motion.div variants={container} initial="hidden" animate="show">
        <Card className="border-dashed" variants={item}>
          <CardContent className="flex flex-col items-center justify-center gap-3 py-12">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-muted">
              <BarChart3 className="h-7 w-7 text-muted-foreground" />
            </div>
            <div className="text-center">
              <p className="font-medium text-foreground">No expenses in this period</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Try a different date range or add expenses to see analytics here.
              </p>
            </div>
            <div className="mt-2 grid w-full max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
              {cards.map((card) => (
                <div
                  key={card.key}
                  className="flex items-center gap-3 rounded-lg border border-dashed border-border bg-muted/30 px-4 py-3"
                >
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${card.color}`}
                  >
                    <card.icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">{card.title}</p>
                    <p className="font-mono text-sm font-medium text-muted-foreground">—</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {cards.map((card) => (
        <motion.div key={card.key} variants={item}>
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.color}`}
              >
                <card.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{card.title}</p>
                <p className="text-xl font-bold font-mono text-foreground">
                  {card.format(summary[card.key])}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}
