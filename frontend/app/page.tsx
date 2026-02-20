import { DashboardContent } from "@/components/dashboard/dashboard-content";
import { AnimatedPage } from "@/components/animated-page";

export default function DashboardPage() {
  return (
    <AnimatedPage>
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Overview of your expense data with real-time insights
        </p>
      </div>
      <DashboardContent />
    </AnimatedPage>
  );
}
