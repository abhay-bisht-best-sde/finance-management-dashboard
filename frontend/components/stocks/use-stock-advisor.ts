"use client";

import { useState, useCallback } from "react";
import { advisorStream } from "@/lib/api";
import type { StockData } from "@/lib/types";

export function useStockAdvisor(stocks: StockData[]) {
  const [budget, setBudget] = useState("100000");
  const [riskLevel, setRiskLevel] = useState("moderate");
  const [result, setResult] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);

  const handleGetAdvice = useCallback(async () => {
    const text = `Based on the current market data, suggest an investment strategy for a budget of Rs.${budget} with ${riskLevel} risk tolerance. Recommend specific stocks with allocation percentages.`;
    setResult("");
    setIsStreaming(true);
    try {
      const stream = await advisorStream({
        stocks,
        budget,
        riskLevel,
        messages: [{ role: "user", content: text }],
      });
      if (!stream) {
        setResult("Failed to get advice. Please try again.");
        return;
      }
      const reader = stream.getReader();
      const decoder = new TextDecoder();
      let full = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const payload = line.slice(6);
            if (payload === "[DONE]") continue;
            try {
              const arr = JSON.parse(payload) as Array<{ type?: string; textDelta?: string }>;
              for (const item of arr) {
                if (item.type === "text-delta" && item.textDelta) full += item.textDelta;
              }
            } catch {
            }
          }
        }
        setResult(full);
      }
    } catch {
      setResult("Failed to get advice. Please try again.");
    } finally {
      setIsStreaming(false);
    }
  }, [stocks, budget, riskLevel]);

  const handleReset = useCallback(() => {
    setResult(null);
    setBudget("100000");
    setRiskLevel("moderate");
  }, []);

  return {
    budget,
    setBudget,
    riskLevel,
    setRiskLevel,
    result,
    isStreaming,
    handleGetAdvice,
    handleReset,
  };
}
