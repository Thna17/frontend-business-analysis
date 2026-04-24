import { AnalyticsPageActions } from "@/components/dashboard/analytics-page-actions";
import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { AnalyticsWorkspace } from "@/components/dashboard/analytics-workspace";
import { FeatureGate } from "@/components/shared/feature-gate";

export default function AnalyticsPage() {
  return (
    <DashboardPage
      eyebrow="Performance"
      title="Analytics"
      description="Analyze revenue trends, product performance, and customer behavior with real-time business data."
      actions={<AnalyticsPageActions />}
    >
      <FeatureGate feature="analytics.trend" className="min-h-[420px]">
        <AnalyticsWorkspace />
      </FeatureGate>
    </DashboardPage>
  );
}
