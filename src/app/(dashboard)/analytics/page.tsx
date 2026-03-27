import { AnalyticsPageActions } from "@/components/dashboard/analytics-page-actions";
import { AnalyticsWorkspace } from "@/components/dashboard/analytics-workspace";
import { TopNavigation } from "@/components/dashboard/top-navigation";
import { productRankingItems, topNavItems } from "@/features/owner-dashboard/dashboard-mock";

export default function AnalyticsPage() {
  return (
    <div className="dashboard-shell pb-14">
      <TopNavigation items={topNavItems} />

      <div className="dashboard-container mt-10 space-y-7">
        <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="dashboard-title">Analytics</h1>
            <p className="dashboard-subtitle mt-2 max-w-2xl">
              Analyze revenue trends, product performance, and customer behavior with real-time data integration.
            </p>
          </div>
          <AnalyticsPageActions />
        </section>

        <AnalyticsWorkspace rankingItems={productRankingItems} />

        <footer className="pt-10 text-center text-sm text-[#98a2b3]">© 2026 Syntrix Analytics. All rights reserved.</footer>
      </div>
    </div>
  );
}
