"use client";

import { useStocks } from "@/lib/queries";
import { QueryBoundary } from "@/components/query-boundary";
import { StocksLayout } from "@/components/stocks/stocks-layout";

export function StocksContent() {
  const query = useStocks();

  return (
    <QueryBoundary
      query={query}
      loadingMessage="Loading stock data..."
      children={(response) => <StocksLayout stocks={response.data} />}
    />
  );
}
