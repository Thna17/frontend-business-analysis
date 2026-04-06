import { ReportsPageActions } from "@/components/dashboard/reports-page-actions";
import { ReportsWorkspace } from "@/components/dashboard/reports-workspace";
import { FeatureGate } from "@/components/shared/feature-gate";
import { TopNavigation } from "@/components/dashboard/top-navigation";
import { topNavItems } from "@/features/owner-dashboard/dashboard-mock";

export default function ReportPage() {
  return (
    <div className="dashboard-shell pb-14">
      <TopNavigation items={topNavItems} />

      <div className="dashboard-container mt-10 space-y-7">
        <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="dashboard-title">Reports</h1>
            <p className="dashboard-subtitle mt-2 max-w-2xl">
              Generate and export business reports for analysis and decision making.
            </p>
          </div>
          <ReportsPageActions />
        </section>

        <FeatureGate feature="reports.export" className="min-h-[420px]">
          <ReportsWorkspace />
        </FeatureGate>

        <footer className="pt-10 text-center text-sm text-[#98a2b3]">© 2026 Syntrix Analytics. All rights reserved.</footer>
      </div>
    </div>
  );
}
