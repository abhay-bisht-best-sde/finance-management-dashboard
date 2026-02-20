"use client";

import { motion } from "framer-motion";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsivePie } from "@nivo/pie";
import { ResponsiveLine } from "@nivo/line";
import { BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardData } from "@/lib/types";

const CHART_COLORS = [
  "hsl(217, 91%, 52%)",
  "hsl(217, 91%, 60%)",
  "hsl(213, 94%, 68%)",
  "hsl(214, 95%, 76%)",
];

const chartVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

function ChartEmptyState({ message = "No data available for this period." }: { message?: string }) {
  return (
    <div className="flex h-full min-h-72 flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-muted/20">
      <BarChart3 className="h-10 w-10 text-muted-foreground" />
      <p className="text-center text-sm text-muted-foreground">{message}</p>
    </div>
  );
}

interface StatusChartProps {
  data: DashboardData["statusData"];
}

export function StatusBarChart({ data }: StatusChartProps) {
  return (
    <motion.div variants={chartVariants} initial="hidden" animate="visible" transition={{ duration: 0.35 }}>
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Expenses by Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          {data.length === 0 ? (
            <ChartEmptyState message="No expenses by status in this period." />
          ) : (
            <ResponsiveBar
              data={data}
              keys={["amount"]}
              indexBy="status"
              margin={{ top: 10, right: 20, bottom: 40, left: 88 }}
              padding={0.4}
              valueScale={{ type: "linear" }}
              colors={CHART_COLORS}
              colorBy="indexValue"
              borderRadius={6}
              axisBottom={{
                tickSize: 0,
                tickPadding: 10,
              }}
              axisLeft={{
                tickSize: 0,
                tickPadding: 12,
                format: (v) => `Rs.${Number(v).toLocaleString("en-IN")}`,
              }}
              theme={{
                grid: {
                  line: {
                    stroke: "hsl(215, 20%, 90%)",
                    strokeDasharray: "4 4",
                  },
                },
                axis: {
                  ticks: {
                    text: {
                      fill: "hsl(215, 16%, 45%)",
                      fontSize: 12,
                    },
                  },
                },
                tooltip: {
                  container: {
                    background: "hsl(0, 0%, 100%)",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    padding: "8px 12px",
                    fontSize: "13px",
                  },
                },
              }}
              enableLabel={false}
              enableGridY={true}
              gridYValues={5}
              tooltip={({ data: d }) => (
                <div className="rounded-lg bg-card p-3 shadow-lg border border-border">
                  <p className="font-medium text-foreground">{d.status}</p>
                  <p className="text-sm text-muted-foreground">
                    Amount: Rs.{Number(d.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Count: {d.count}
                  </p>
                </div>
              )}
            />
          )}
        </div>
      </CardContent>
    </Card>
    </motion.div>
  );
}

interface CategoryPieChartProps {
  data: DashboardData["categoryData"];
}

export function CategoryPieChart({ data }: CategoryPieChartProps) {
  return (
    <motion.div variants={chartVariants} initial="hidden" animate="visible" transition={{ duration: 0.35 }}>
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Category Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          {data.length === 0 ? (
            <ChartEmptyState message="No category data in this period." />
          ) : (
            <ResponsivePie
              data={data}
              margin={{ top: 24, right: 140, bottom: 24, left: 140 }}
              innerRadius={0.5}
              padAngle={2}
              cornerRadius={6}
              activeOuterRadiusOffset={6}
              colors={CHART_COLORS}
              borderWidth={0}
              arcLinkLabelsSkipAngle={10}
              arcLinkLabelsTextColor="hsl(215, 16%, 45%)"
              arcLinkLabelsThickness={2}
              arcLinkLabelsColor={{ from: "color" }}
              arcLinkLabelsOffset={4}
              arcLabelsSkipAngle={10}
              arcLabelsTextColor="hsl(0, 0%, 100%)"
              theme={{
                tooltip: {
                  container: {
                    background: "hsl(0, 0%, 100%)",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    padding: "8px 12px",
                    fontSize: "13px",
                  },
                },
              }}
              tooltip={({ datum }) => (
                <div className="rounded-lg bg-card p-3 shadow-lg border border-border">
                  <p className="font-medium text-foreground">{datum.id}</p>
                  <p className="text-sm text-muted-foreground">
                    Count: {datum.value}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Amount: Rs.{Number(datum.data.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </p>
                </div>
              )}
            />
          )}
        </div>
      </CardContent>
    </Card>
    </motion.div>
  );
}

interface MonthlyTrendChartProps {
  data: DashboardData["monthlyTrend"];
}

export function MonthlyTrendChart({ data }: MonthlyTrendChartProps) {
  const lineData = [
    {
      id: "Expenses",
      data: data.map((d) => ({ x: d.x, y: d.y })),
    },
  ];

  return (
    <motion.div variants={chartVariants} initial="hidden" animate="visible" transition={{ duration: 0.35 }} className="lg:col-span-2">
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-base">Monthly Expense Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          {data.length === 0 ? (
            <ChartEmptyState message="No monthly trend data in this period." />
          ) : (
            <ResponsiveLine
              data={lineData}
              margin={{ top: 10, right: 20, bottom: 50, left: 88 }}
              xScale={{ type: "point" }}
              yScale={{ type: "linear", min: "auto", max: "auto" }}
              curve="monotoneX"
              axisBottom={{
                tickSize: 0,
                tickPadding: 10,
                tickRotation: -45,
              }}
              axisLeft={{
                tickSize: 0,
                tickPadding: 12,
                format: (v) => `Rs.${Number(v).toLocaleString("en-IN")}`,
              }}
              enableArea={true}
              areaOpacity={0.1}
              colors={[CHART_COLORS[0]]}
              lineWidth={3}
              pointSize={8}
              pointColor="hsl(0, 0%, 100%)"
              pointBorderWidth={3}
              pointBorderColor={CHART_COLORS[0]}
              enableGridX={false}
              gridYValues={5}
              theme={{
                grid: {
                  line: {
                    stroke: "hsl(215, 20%, 90%)",
                    strokeDasharray: "4 4",
                  },
                },
                axis: {
                  ticks: {
                    text: {
                      fill: "hsl(215, 16%, 45%)",
                      fontSize: 12,
                    },
                  },
                },
                crosshair: {
                  line: {
                    stroke: "hsl(217, 91%, 52%)",
                    strokeDasharray: "4 4",
                  },
                },
              }}
              useMesh={true}
              tooltip={({ point }) => (
                <div className="rounded-lg bg-card p-3 shadow-lg border border-border">
                  <p className="font-medium text-foreground">{point.data.xFormatted}</p>
                  <p className="text-sm text-muted-foreground">
                    Total: Rs.{Number(point.data.y).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </p>
                </div>
              )}
            />
          )}
        </div>
      </CardContent>
    </Card>
    </motion.div>
  );
}

interface TopCategoriesProps {
  data: DashboardData["topCategories"];
}

export function TopCategoriesTable({ data }: TopCategoriesProps) {
  return (
    <motion.div variants={chartVariants} initial="hidden" animate="visible" transition={{ duration: 0.35 }}>
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Top Categories</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <ChartEmptyState message="No top categories in this period." />
        ) : (
          <div className="space-y-4">
            {data.map((cat, i) => (
              <div key={cat.category} className="flex items-center gap-3">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold"
                  style={{
                    backgroundColor: `${CHART_COLORS[i % CHART_COLORS.length]}20`,
                    color: CHART_COLORS[i % CHART_COLORS.length],
                  }}
                >
                  {i + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{cat.category}</p>
                  <p className="text-xs text-muted-foreground">
                    {cat.count} expense{cat.count !== 1 ? "s" : ""}
                  </p>
                </div>
                <p className="font-mono text-sm font-semibold text-foreground">
                  Rs.{cat.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
    </motion.div>
  );
}
