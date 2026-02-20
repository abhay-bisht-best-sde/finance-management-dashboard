import { StocksContent } from "@/components/stocks/stocks-content";
import { AnimatedPage } from "@/components/animated-page";

export default function StocksPage() {
  return (
    <AnimatedPage>
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Stock Investment Advisor
        </h1>
        <p className="mt-1 text-muted-foreground">
          Indian stock market data with AI-powered investment recommendations
        </p>
      </div>
      <StocksContent />
    </AnimatedPage>
  );
}
