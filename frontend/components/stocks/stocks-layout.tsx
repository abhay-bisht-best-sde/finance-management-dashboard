"use client";

import { motion } from "framer-motion";
import { StockTable } from "@/components/stocks/stock-table";
import { StockAdvisorChat } from "@/components/stocks/stock-advisor-chat";
import { useStockAdvisor } from "@/components/stocks/use-stock-advisor";
import type { StockData } from "@/lib/types";

interface StocksLayoutProps {
  stocks: StockData[];
}

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

export function StocksLayout({ stocks }: StocksLayoutProps) {
  const {
    budget,
    setBudget,
    riskLevel,
    setRiskLevel,
    result,
    isStreaming,
    handleGetAdvice,
    handleReset,
  } = useStockAdvisor(stocks);

  return (
    <motion.div
      className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_40%] lg:min-h-[calc(100vh-10rem)]"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.div className="flex min-h-[480px] flex-col lg:min-h-[calc(100vh-10rem)] lg:h-[calc(100vh-10rem)]" variants={item}>
        <StockTable stocks={stocks} />
      </motion.div>
      <motion.div className="flex min-h-[480px] flex-col lg:min-h-[calc(100vh-10rem)] lg:h-[calc(100vh-10rem)]" variants={item}>
        <StockAdvisorChat
          budget={budget}
          setBudget={setBudget}
          riskLevel={riskLevel}
          setRiskLevel={setRiskLevel}
          result={result}
          isStreaming={isStreaming}
          onGetAdvice={handleGetAdvice}
          onReset={handleReset}
        />
      </motion.div>
    </motion.div>
  );
}
