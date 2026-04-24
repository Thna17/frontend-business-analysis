"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { AiInsightsPanel } from "@/components/dashboard/ai-insights-panel";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { ProductRankingCard } from "@/components/dashboard/product-ranking-card";
import { RecentSalesCard } from "@/components/dashboard/recent-sales-card";
import { RevenueAnalyticsCard } from "@/components/dashboard/revenue-analytics-card";
import { FeatureGate } from "@/components/shared/feature-gate";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
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
import { selectAuthStatus } from "@/store/slices/authSlice";

// ── Animation variants ────────────────────────────────────────────────
const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

const kpiGridVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.12 } },
};

const kpiCardVariants = {
  hidden: { opacity: 0, y: 14, scale: 0.98 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.38, ease },
  },
};
// ───────────────────────────────────────────────────────────────────────

const pageSize = 3;

function toIsoDateRange(value: string): { start?: string; end?: string } {
  if (!value) return {};
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return {};

  const start = new Date(parsed);
  start.setHours(0, 0, 0, 0);
  const end = new Date(parsed);
  end.setHours(23, 59, 59, 999);

  return {
    start: start.toISOString(),
    end: end.toISOString(),
  };
}

export function OwnerDashboardWorkspace() {
  const [range, setRange] = useState<"6m" | "12m">("6m");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [selectedDate, setSelectedDate] = useState("");
  const [page, setPage] = useState(1);
  const dateRange = toIsoDateRange(selectedDate);
  const authStatus = useSelector(selectAuthStatus);
  const isAuthReady = authStatus === "authenticated";

  const {
    data: business,
    error: businessError,
  } = useGetBusinessProfileQuery(undefined, {
    skip: !isAuthReady,
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  });
  const {
    data: overview,
    isLoading: isOverviewLoading,
    isFetching: isOverviewFetching,
    isUninitialized: isOverviewUninitialized,
    refetch: refetchOverview,
  } = useGetOwnerDashboardOverviewQuery(
    { range },
    {
      skip: !isAuthReady,
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
    },
  );

  const {
    data: salesResponse,
    isLoading: isSalesLoading,
    isFetching: isSalesFetching,
    isUninitialized: isSalesUninitialized,
    refetch: refetchSales,
  } = useGetSalesQuery(
    {
      search: search || undefined,
      category: category === "all" ? undefined : category,
      startDate: dateRange.start,
      endDate: dateRange.end,
      page,
      limit: pageSize,
    },
    {
      skip: !isAuthReady,
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
    },
  );

  useEffect(() => {
    if (!isAuthReady) return;
    if (!isOverviewUninitialized || overview) return;
    void refetchOverview();
  }, [isAuthReady, isOverviewUninitialized, overview, refetchOverview]);

  useEffect(() => {
    if (!isAuthReady) return;
    if (!isSalesUninitialized || salesResponse) return;
    void refetchSales();
  }, [isAuthReady, isSalesUninitialized, salesResponse, refetchSales]);

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
  const shouldShowMetricSkeletons =
    !isAuthReady || isOverviewLoading || (isOverviewUninitialized && !overview);

  return (
    <div className="dashboard-container mt-10 space-y-10">

      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.44, ease }}
      >
        <PageHeader
          eyebrow="Overview"
          title="Dashboard"
          description="Revenue, top products, and recent activity — all in one place."
        />
      </motion.div>

      {/* ── Welcome banner ── */}
      <motion.section
        className="dashboard-premium-banner"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.46, ease, delay: 0.06 }}
      >
        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <h2 className="font-heading text-[1.6rem] font-semibold tracking-[-0.03em] text-foreground md:text-[1.88rem]">
              {hasBusinessProfile
                ? `Good to see you${business?.name ? `, ${business.name}` : ""} \u{1F44B}`
                : "Let\u2019s get your workspace ready"}
            </h2>
            <p className="max-w-md text-sm leading-7 text-muted-foreground">
              {hasBusinessProfile
                ? "Here\u2019s a live snapshot of your business. Check back anytime."
                : "Create your business profile to unlock analytics, AI insights, and revenue reports."}
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="dashboard-soft-tile min-w-[160px]">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">Revenue</p>
              <p className="mt-2 text-xl font-semibold tracking-tight text-foreground">{metrics[0]?.value ?? "\u2014"}</p>
              <p className="mt-1 text-xs text-muted-foreground">{metrics[0]?.compareLabel ?? "Waiting for first sale"}</p>
            </div>
            <div className="dashboard-soft-tile min-w-[160px]">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">Sales tracked</p>
              <p className="mt-2 text-xl font-semibold tracking-tight text-foreground">
                {noSales ? "0" : `${overview?.kpi.salesCount ?? 0}`}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {noSales ? "Add your first sale to begin" : "Updated as sales arrive"}
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ── No business profile prompt ── */}
      {!hasBusinessProfile ? (
        <motion.section
          className="dashboard-surface p-7 shadow-none"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.44, ease, delay: 0.1 }}
        >
          <h3 className="dashboard-section-title">Set up your business profile</h3>
          <p className="mt-2 max-w-xl text-sm leading-7 text-muted-foreground">
            Your business context powers the analytics, AI insights, and product-level reports. Takes less than a minute.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button asChild className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href="/settings">Create profile</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-xl">
              <Link href="/sale-record">Explore sales workflow</Link>
            </Button>
          </div>
        </motion.section>
      ) : null}

      {/* ── KPI cards — asymmetric staggered grid ── */}
      <motion.section
        className="grid gap-5 md:grid-cols-2 xl:grid-cols-4"
        variants={kpiGridVariants}
        initial="hidden"
        animate="visible"
      >
        {shouldShowMetricSkeletons
          ? Array.from({ length: 4 }).map((_, index) => (
            <motion.div
              key={`metric-skeleton-${index}`}
              variants={kpiCardVariants}
              className={cn(index === 0 && "md:col-span-2 xl:col-span-2")}
            >
              <div className={cn("dashboard-kpi-card", index === 0 && "dashboard-kpi-card-featured")}>
                <Skeleton className="h-3.5 w-24" />
                <Skeleton className={cn("mt-5 w-32", index === 0 ? "h-12" : "h-9")} />
                <Skeleton className="mt-4 h-3.5 w-20" />
              </div>
            </motion.div>
          ))
          : metrics.map((item, index) => (
            <motion.div
              key={item.title}
              variants={kpiCardVariants}
              className={cn(index === 0 && "md:col-span-2 xl:col-span-2")}
            >
              <KpiCard item={item} featured={index === 0} />
            </motion.div>
          ))}
      </motion.section>

      {/* ── Charts row ── */}
      <motion.section
        className="grid gap-6 xl:grid-cols-[2fr_1fr]"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease, delay: 0.18 }}
      >
        <RevenueAnalyticsCard
          points={overview?.chart.series ?? []}
          range={range}
          onRangeChange={setRange}
          isLoading={isOverviewLoading || isOverviewFetching}
        />
        <ProductRankingCard items={rankingItems} />
      </motion.section>

      {/* ── AI insights ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease, delay: 0.24 }}
      >
        <FeatureGate feature="insights.ai" className="min-h-[240px]">
          <AiInsightsPanel />
        </FeatureGate>
      </motion.div>

      {/* ── First-run empty state or recent sales table ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease, delay: 0.3 }}
      >
        {noSales ? (
          <section className="dashboard-surface p-7 shadow-none">
            <h3 className="dashboard-section-title">Ready for your first sale</h3>
            <p className="mt-2 max-w-xl text-sm leading-7 text-muted-foreground">
              Record a sale and watch this dashboard come alive — revenue trends, top products, and AI recommendations activate automatically.
            </p>
            <div className="mt-6 grid gap-3 md:grid-cols-3">
              <div className="dashboard-soft-tile">
                <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-primary">Step 1</p>
                <p className="mt-2.5 text-base font-semibold text-foreground">Record a sale</p>
                <p className="mt-1 text-sm text-muted-foreground">Manual entry, voice, or Telegram.</p>
              </div>
              <div className="dashboard-soft-tile">
                <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-primary">Step 2</p>
                <p className="mt-2.5 text-base font-semibold text-foreground">Insights light up</p>
                <p className="mt-1 text-sm text-muted-foreground">Analytics and product rankings activate.</p>
              </div>
              <div className="dashboard-soft-tile">
                <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-primary">Step 3</p>
                <p className="mt-2.5 text-base font-semibold text-foreground">Export & grow</p>
                <p className="mt-1 text-sm text-muted-foreground">Reports sharpen as your data grows.</p>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href="/sale-record">Add first sale</Link>
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
            date={selectedDate}
            onDateChange={(value) => {
              setSelectedDate(value);
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
      </motion.div>
    </div>
  );
}
