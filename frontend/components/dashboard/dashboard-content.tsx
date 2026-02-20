"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useDashboard, type DashboardFilters } from "@/lib/queries";
import { QueryBoundary } from "@/components/query-boundary";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import {
  StatusBarChart,
  CategoryPieChart,
  MonthlyTrendChart,
  TopCategoriesTable,
} from "@/components/dashboard/charts";
import { DemoBanner } from "@/components/demo-banner";
import { DashboardDateFilters } from "@/components/dashboard/dashboard-date-filters";

export function DashboardContent() {
  const [appliedFilters, setAppliedFilters] = useState<DashboardFilters>({});
  const [validationError, setValidationError] = useState<string | null>(null);

  const query = useDashboard(appliedFilters);

  const handleFiltersChange = useCallback((filters: DashboardFilters) => {
    setAppliedFilters(filters);
  }, []);

  return (
    <div className="space-y-6">
      <DashboardDateFilters
        value={appliedFilters}
        onChange={handleFiltersChange}
        validationError={validationError}
        onValidationError={setValidationError}
      />
      <QueryBoundary
        query={query}
        loadingMessage="Loading dashboard..."
        children={(response) => {
          const dashboard = response.data;
          const isDemo = response.demo;
          return (
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {isDemo && <DemoBanner />}
              <SummaryCards summary={dashboard.summary} />
              <motion.div
                className="grid gap-6 lg:grid-cols-2"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.35 }}
              >
                <StatusBarChart data={dashboard.statusData} />
                <CategoryPieChart data={dashboard.categoryData} />
              </motion.div>
              <motion.div
                className="grid gap-6 lg:grid-cols-3"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.35 }}
              >
                <MonthlyTrendChart data={dashboard.monthlyTrend} />
                <TopCategoriesTable data={dashboard.topCategories} />
              </motion.div>
            </motion.div>
          );
        }}
      />
    </div>
  );
}
