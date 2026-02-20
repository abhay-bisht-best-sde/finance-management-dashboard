"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Loader2, RotateCcw, Send } from "lucide-react";

interface StockAdvisorChatProps {
  budget: string;
  setBudget: (v: string) => void;
  riskLevel: string;
  setRiskLevel: (v: string) => void;
  result: string | null;
  isStreaming: boolean;
  onGetAdvice: () => void;
  onReset: () => void;
}

export function StockAdvisorChat({
  budget,
  setBudget,
  riskLevel,
  setRiskLevel,
  result,
  isStreaming,
  onGetAdvice,
  onReset,
}: StockAdvisorChatProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const hasResult = result !== null && result !== "";
  const showPlaceholder = !hasResult && !isStreaming;

  useEffect(() => {
    if (isStreaming && hasResult && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [result, isStreaming, hasResult]);

  return (
    <Card className="flex h-full min-h-0 flex-col">
      <CardHeader className="shrink-0 space-y-3 border-b border-border pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Bot className="h-5 w-5 text-primary" />
            AI Investment Advisor
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            disabled={isStreaming}
            className="gap-1.5"
            title="Reset and refill form"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>
        <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          <div className="space-y-1.5">
            <Label htmlFor="advisor-budget" className="text-xs">
              Budget (Rs.)
            </Label>
            <Input
              id="advisor-budget"
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="100000"
              className="h-9"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="advisor-risk" className="text-xs">
              Risk Level
            </Label>
            <Select value={riskLevel} onValueChange={setRiskLevel}>
              <SelectTrigger id="advisor-risk" className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="conservative">Conservative</SelectItem>
                <SelectItem value="moderate">Moderate</SelectItem>
                <SelectItem value="aggressive">Aggressive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={onGetAdvice}
            disabled={isStreaming}
            size="sm"
            className="gap-1.5 sm:w-auto"
          >
            {isStreaming ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            Get Advice
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Disclaimer: This is AI-generated advice for educational purposes only. Always consult a
          certified financial advisor before making investment decisions.
        </p>
      </CardHeader>
      <CardContent className="flex min-h-0 flex-1 flex-col p-4 pt-3">
        <div
          ref={scrollRef}
          className="min-h-0 flex-1 overflow-y-auto scroll-smooth rounded-lg border border-border bg-muted/20 p-4"
        >
          {showPlaceholder && (
            <p className="text-center text-sm text-muted-foreground">
              Select budget and risk level above, then click <strong>Get Advice</strong> to see AI
              recommendations.
            </p>
          )}
          {isStreaming && !hasResult && (
            <p className="text-sm text-muted-foreground">Generating advice...</p>
          )}
          {hasResult && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="prose prose-sm dark:prose-invert max-w-none"
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{result}</ReactMarkdown>
            </motion.div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
