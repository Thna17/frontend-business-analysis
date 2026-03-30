"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { ProductRankingCard } from "@/components/dashboard/product-ranking-card";
import { RecentSalesCard } from "@/components/dashboard/recent-sales-card";
import { RevenueAnalyticsCard } from "@/components/dashboard/revenue-analytics-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  mapOverviewToMetrics,
  mapOverviewToRanking,
  mapSalesToTransactions,
} from "@/features/owner-dashboard/owner-dashboard-mappers";
import {
  useGetBusinessProfileQuery,
  useGetOwnerDashboardOverviewQuery,
  useGetSalesQuery,
} from "@/store/api";

const pageSize = 3;

function toIsoDate(value: string): string | undefined {
  if (!value) return undefined;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return undefined;
  return parsed.toISOString();
}

export function OwnerDashboardWorkspace() {
  const [range, setRange] = useState<"6m" | "12m">("6m");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);

  const { data: business, error: businessError } = useGetBusinessProfileQuery();
  const {
    data: overview,
    isLoading: isOverviewLoading,
    isFetching: isOverviewFetching,
    refetch: refetchOverview,
  } = useGetOwnerDashboardOverviewQuery({ range });

  const {
    data: salesResponse,
    isLoading: isSalesLoading,
    isFetching: isSalesFetching,
    refetch: refetchSales,
  } = useGetSalesQuery({
    search: search || undefined,
    category: category === "all" ? undefined : category,
    startDate: toIsoDate(startDate),
    endDate: toIsoDate(endDate),
    page,
    limit: pageSize,
  });

  const currency = business?.currency || "USD";

  const metrics = useMemo(
    () => (overview ? mapOverviewToMetrics(overview, currency) : []),
    [overview, currency],
  );
  const rankingItems = useMemo(
    () => (overview ? mapOverviewToRanking(overview) : []),
    [overview],
  );
  const salesRows = useMemo(
    () => mapSalesToTransactions(salesResponse?.items ?? [], currency),
    [salesResponse?.items, currency],
  );
  const categories = useMemo(() => {
    const set = new Set((salesResponse?.items ?? []).map((item) => item.category));
    return Array.from(set).sort();
  }, [salesResponse?.items]);

  const noSales = (overview?.kpi.salesCount ?? 0) === 0;
  const hasBusinessProfile = Boolean(business && !businessError);

  return (
    <div className="dashboard-container mt-10 space-y-7">
      <section>
        <h1 className="dashboard-title">Dashboard</h1>
        <p className="dashboard-subtitle mt-2">
          Welcome back. Here&apos;s what&apos;s happening in your business today.
        </p>
      </section>

      {!hasBusinessProfile ? (
        <section className="dashboard-surface border-[#e7e9ee] p-7">
          <h3 className="dashboard-section-title text-xl">Get Started</h3>
          <p className="mt-2 text-sm text-[#667085]">
            Create your business profile first to unlock full dashboard analytics.
          </p>
          <div className="mt-5 flex gap-3">
            <Button asChild className="rounded-xl bg-slate-900 text-white hover:bg-slate-800">
              <Link href="/settings">Create Business Profile</Link>
            </Button>
          </div>
        </section>
      ) : null}

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {isOverviewLoading
          ? Array.from({ length: 4 }).map((_, index) => (
            <div key={`metric-skeleton-${index}`} className="dashboard-kpi-card border-[#e7e9ee]">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="mt-7 h-10 w-36" />
              <Skeleton className="mt-4 h-4 w-24" />
            </div>
          ))
          : metrics.map((item) => (
            <KpiCard key={item.title} item={item} />
          ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <RevenueAnalyticsCard
          points={overview?.chart.series ?? []}
          range={range}
          onRangeChange={setRange}
          isLoading={isOverviewLoading || isOverviewFetching}
        />
        <ProductRankingCard items={rankingItems} />
      </section>

      {noSales ? (
        <section className="dashboard-surface border-[#e7e9ee] p-7">
          <h3 className="dashboard-section-title text-xl">No Sales Data Yet</h3>
          <p className="mt-2 text-sm text-[#667085]">
            Add your first sale record to start generating live insights for revenue trends and product performance.
          </p>
          <div className="mt-5 flex gap-3">
            <Button asChild className="rounded-xl bg-slate-900 text-white hover:bg-slate-800">
              <Link href="/sale-record">Add First Sale</Link>
            </Button>
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => {
                void refetchOverview();
                void refetchSales();
              }}
            >
              Refresh
            </Button>
          </div>
        </section>
      ) : (
        <RecentSalesCard
          rows={salesRows}
          search={search}
          onSearchChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
          category={category}
          onCategoryChange={(value) => {
            setCategory(value);
            setPage(1);
          }}
          categories={categories}
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={(value) => {
            setStartDate(value);
            setPage(1);
          }}
          onEndDateChange={(value) => {
            setEndDate(value);
            setPage(1);
          }}
          page={salesResponse?.meta.page ?? page}
          total={salesResponse?.meta.total ?? 0}
          pageSize={salesResponse?.meta.limit ?? pageSize}
          hasNextPage={Boolean(salesResponse?.meta.hasNextPage)}
          onPreviousPage={() => setPage((value) => Math.max(1, value - 1))}
          onNextPage={() => {
            if (salesResponse?.meta.hasNextPage) {
              setPage((value) => value + 1);
            }
          }}
          isLoading={isSalesLoading || isSalesFetching}
        />
      )}
    </div>
  );
}
