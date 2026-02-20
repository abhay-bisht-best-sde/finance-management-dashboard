"use client";

import type { UseQueryResult } from "@tanstack/react-query";
import { LoadingSpinner } from "@/components/loading-spinner";
import { ErrorDisplay } from "@/components/error-display";

interface QueryBoundaryProps<TData> {
  query: UseQueryResult<TData>;
  loadingMessage?: string;
  emptyMessage?: string;
  emptyCondition?: (data: TData) => boolean;
  children: (data: TData) => React.ReactNode;
}

export function QueryBoundary<TData>({
  query,
  loadingMessage = "Loading...",
  emptyMessage = "No data found.",
  emptyCondition,
  children,
}: QueryBoundaryProps<TData>) {
  const { data, error, isPending, isError, refetch } = query;

  if (isPending && data === undefined) {
    return <LoadingSpinner message={loadingMessage} />;
  }

  if (isError) {
    return (
      <ErrorDisplay
        title="Something went wrong"
        message={error?.message ?? "Failed to load data. Please try again."}
        onRetry={() => refetch()}
      />
    );
  }

  if (data === undefined || data === null) {
    return (
      <ErrorDisplay
        title="No data"
        message={emptyMessage}
        onRetry={() => refetch()}
      />
    );
  }

  if (emptyCondition?.(data)) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 py-12 text-center">
        <p className="text-sm font-medium text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return <>{children(data)}</>;
}
