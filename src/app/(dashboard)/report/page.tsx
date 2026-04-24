import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { ReportsPageActions } from "@/components/dashboard/reports-page-actions";
import { ReportsWorkspace } from "@/components/dashboard/reports-workspace";
import { FeatureGate } from "@/components/shared/feature-gate";

export default function ReportPage() {
  return (
    <DashboardPage
      eyebrow="Reporting"
      title="Reports"
      description="Generate clean exports, review report history, and turn operational data into shareable business summaries."
      actions={<ReportsPageActions />}
    >
      <FeatureGate feature="reports.export" className="min-h-[420px]">
        <ReportsWorkspace />
      </FeatureGate>
    </DashboardPage>
  );
}
