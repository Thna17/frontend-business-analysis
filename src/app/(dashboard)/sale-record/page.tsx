"use client";

import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { SalesRecordWorkspace } from "@/components/dashboard/sales-record-workspace";
import { Skeleton } from "@/components/ui/skeleton";
import { mapOverviewToMetrics } from "@/features/owner-dashboard/owner-dashboard-mappers";
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
    <DashboardPage
      eyebrow="Operations"
      title="Sales Records"
      description="Capture transactions, audit recent activity, and keep operational sales data accurate across the business."
      footer="(c) 2026 Syntrix. All rights reserved."
    >
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {isOverviewLoading
          ? Array.from({ length: 4 }).map((_, index) => (
            <div key={`sale-metric-skeleton-${index}`} className="dashboard-kpi-card">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="mt-7 h-10 w-36" />
              <Skeleton className="mt-4 h-4 w-24" />
            </div>
          ))
          : metrics.map((item) => <KpiCard key={item.title} item={item} />)}
      </section>

      <SalesRecordWorkspace currency={business?.currency || "USD"} />
    </DashboardPage>
  );
}
