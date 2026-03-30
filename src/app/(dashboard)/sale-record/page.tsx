"use client";

import { KpiCard } from "@/components/dashboard/kpi-card";
import { SalesRecordWorkspace } from "@/components/dashboard/sales-record-workspace";
import { TopNavigation } from "@/components/dashboard/top-navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { mapOverviewToMetrics } from "@/features/owner-dashboard/owner-dashboard-mappers";
import { topNavItems } from "@/features/owner-dashboard/dashboard-mock";
import {
  useGetBusinessProfileQuery,
  useGetOwnerDashboardOverviewQuery,
} from "@/store/api";

export default function SaleRecordPage() {
  const { data: business } = useGetBusinessProfileQuery();
  const { data: overview, isLoading: isOverviewLoading } = useGetOwnerDashboardOverviewQuery({
    range: "6m",
  });

  const metrics = overview
    ? mapOverviewToMetrics(overview, business?.currency || "USD")
    : [];

  return (
    <div className="dashboard-shell pb-14">
      <TopNavigation items={topNavItems} />

      <div className="dashboard-container mt-10 space-y-7">
        <section>
          <h1 className="dashboard-title">Sales Records</h1>
          <p className="dashboard-subtitle mt-2">Manage and track your business sales transactions</p>
        </section>

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {isOverviewLoading
            ? Array.from({ length: 4 }).map((_, index) => (
              <div key={`sale-metric-skeleton-${index}`} className="dashboard-kpi-card border-[#e7e9ee]">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="mt-7 h-10 w-36" />
                <Skeleton className="mt-4 h-4 w-24" />
              </div>
            ))
            : metrics.map((item) => <KpiCard key={item.title} item={item} />)}
        </section>

        <SalesRecordWorkspace currency={business?.currency || "USD"} />

        <footer className="pt-16 text-center text-sm text-[#98a2b3]">
          © 2026 Syntrix. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
