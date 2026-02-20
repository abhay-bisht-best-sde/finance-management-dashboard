"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { StockData } from "@/lib/types";

interface StockTableProps {
  stocks: StockData[];
}

export function StockTable({ stocks }: StockTableProps) {
  return (
    <motion.div
      className="h-full"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle className="text-base">NSE Top Stocks (India)</CardTitle>
      </CardHeader>
      <CardContent className="min-h-0 flex-1 overflow-hidden">
        <div className="h-full overflow-auto rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Symbol</TableHead>
                <TableHead className="hidden sm:table-cell">Company</TableHead>
                <TableHead>Sector</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Change</TableHead>
                <TableHead className="text-right hidden sm:table-cell">P/E</TableHead>
                <TableHead className="text-right hidden md:table-cell">Market Cap</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stocks.map((stock) => (
                <TableRow key={stock.symbol}>
                  <TableCell className="font-mono font-semibold text-foreground">
                    {stock.symbol}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                    {stock.name}
                  </TableCell>
                  <TableCell>
                    <span className="rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                      {stock.sector}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-mono font-medium text-foreground">
                    Rs.{stock.price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell className="text-right">
                    <span
                      className={`inline-flex items-center gap-1 font-mono text-sm font-medium ${
                        stock.change >= 0 ? "text-accent" : "text-destructive"
                      }`}
                    >
                      {stock.change >= 0 ? (
                        <TrendingUp className="h-3.5 w-3.5" />
                      ) : (
                        <TrendingDown className="h-3.5 w-3.5" />
                      )}
                      {stock.change >= 0 ? "+" : ""}
                      {stock.change.toFixed(2)}%
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm hidden sm:table-cell text-muted-foreground">
                    {stock.pe.toFixed(1)}
                  </TableCell>
                  <TableCell className="text-right text-sm hidden md:table-cell text-muted-foreground">
                    {stock.marketCap}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
    </motion.div>
  );
}
