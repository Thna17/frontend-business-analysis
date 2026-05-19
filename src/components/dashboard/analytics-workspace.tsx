"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { DashboardPanel } from "@/components/dashboard/dashboard-panel";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetOwnerAnalyticsDashboardQuery } from "@/store/api";
import { FeatureGate } from "@/components/shared/feature-gate";
import { PageSummaryStrip } from "@/components/shared/page-summary-strip";
import { StateMessage } from "@/components/shared/state-message";
import { dashboardChartPalette, dashboardHeatmapColor } from "@/components/dashboard/chart-tokens";

type PeriodKey = "6m" | "12m";

interface AnalyticsSeriesPoint {
  label: string;
  value: number;
}

interface ChartStats {
  max: number;
  min: number;
  isFlat: boolean;
}

// Small chart helpers live in this file so the dashboard can shape API data directly into SVG output.
function metricToneClass(tone: "green" | "amber" | "slate") {
  if (tone === "green") return "dashboard-status-positive";
  if (tone === "amber") return "dashboard-status-warning";
  return "dashboard-status-neutral";
}

// Convert data points into a smooth SVG path for the revenue and customer mini-charts.
function buildPath(points: AnalyticsSeriesPoint[], width: number, height: number, curve = 0.22) {
  if (points.length === 0) return "";
  const stats = getSeriesStats(points);

  const coords = points.map((point, index) => {
    const x = (index / Math.max(points.length - 1, 1)) * width;
    const y = getChartY(point.value, stats, height, 10, 20);
    return { x, y };
  });

  if (coords.length === 1) return `M ${coords[0].x} ${coords[0].y}`;

  let d = `M ${coords[0].x} ${coords[0].y}`;
  for (let i = 1; i < coords.length; i += 1) {
    const prev = coords[i - 1];
    const curr = coords[i];
    const cx1 = prev.x + (curr.x - prev.x) * curve;
    const cy1 = prev.y;
    const cx2 = curr.x - (curr.x - prev.x) * curve;
    const cy2 = curr.y;
    d += ` C ${cx1} ${cy1}, ${cx2} ${cy2}, ${curr.x} ${curr.y}`;
  }

  return d;
}

function getSeriesStats(points: AnalyticsSeriesPoint[]): ChartStats {
  if (points.length === 0) {
    return { min: 0, max: 0, isFlat: true };
  }

  const max = Math.max(...points.map((point) => point.value));
  const min = Math.min(...points.map((point) => point.value));
  return {
    min,
    max,
    isFlat: max === min,
  };
}

// Flat series need special handling so the chart does not collapse into a broken line.
function getChartY(
  value: number,
  stats: ChartStats,
  height: number,
  topPadding: number,
  bottomPadding: number,
) {
  if (stats.isFlat) {
    if (stats.max <= 0) {
      return height - bottomPadding;
    }

    return height * 0.62;
  }

  const range = Math.max(stats.max - stats.min, 1);
  return height - ((value - stats.min) / range) * (height - topPadding - bottomPadding) - topPadding;
}

function buildChartTicks(stats: ChartStats): number[] {
  if (stats.isFlat) {
    if (stats.max <= 0) {
      return [0, 0, 0];
    }

    return [stats.max, stats.max * 0.66, stats.max * 0.33];
  }

  const step = (stats.max - stats.min) / 4;
  return [stats.min + step * 3, stats.min + step * 2, stats.min + step];
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function shortMoney(value: number) {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
  return `$${value.toFixed(1)}`;
}

function formatDelta(value: number) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

function deltaTone(value: number): "green" | "amber" | "slate" {
  if (value > 0) return "green";
  if (value < 0) return "amber";
  return "slate";
}

export function AnalyticsWorkspace() {
  const [period, setPeriod] = useState<PeriodKey>("6m");
  const periodOptions: Array<{ key: PeriodKey; label: string }> = [
    { key: "6m", label: "Last 6 months" },
    { key: "12m", label: "Last 12 months" },
  ];

  const { data, isFetching, isLoading } = useGetOwnerAnalyticsDashboardQuery({ range: period });

  // Raw API payloads are reshaped once with useMemo so the chart and summary sections stay declarative.
  const revenueData = useMemo(
    () => (data?.revenue.series ?? []).map((item) => ({ label: item.label, value: item.amount })),
    [data?.revenue.series],
  );
  const revenueLinePath = useMemo(() => buildPath(revenueData, 960, 270), [revenueData]);
  const revenueAreaPath = `${revenueLinePath} L 960 280 L 0 280 Z`;

  const customerData = useMemo(
    () => (data?.customerActivity ?? []).map((item) => ({ label: item.label, value: item.value })),
    [data?.customerActivity],
  );
  const customerPath = useMemo(() => buildPath(customerData, 620, 180), [customerData]);
  const customerAreaPath = `${customerPath} L 620 200 L 0 200 Z`;

  const categoryShare = useMemo(() => data?.categoryShare ?? [], [data?.categoryShare]);
  const topProducts = useMemo(() => data?.topProducts ?? [], [data?.topProducts]);
  const heatmap = useMemo(() => data?.heatmap ?? [[], [], [], []], [data?.heatmap]);

  const totalCategoryRevenue = categoryShare.reduce((sum, item) => sum + item.revenue, 0);
  const donutCircumference = 2 * Math.PI * 70;

  const revStats = getSeriesStats(revenueData);
  const custStats = getSeriesStats(customerData);
  const revenueTicks = buildChartTicks(revStats);
  const customerTicks = buildChartTicks(custStats);
  const topRevenueMonth = revenueData.reduce<AnalyticsSeriesPoint | null>(
    (best, point) => (best === null || point.value > best.value ? point : best),
    null,
  );
  const topCustomerMonth = customerData.reduce<AnalyticsSeriesPoint | null>(
    (best, point) => (best === null || point.value > best.value ? point : best),
    null,
  );

  const parsedCategoryShares = useMemo(() => {
    return categoryShare.reduce(
      (acc, item) => {
        const percent = item.value / 100;
        const length = donutCircumference * percent;
        acc.items.push({ ...item, length, offset: acc.currentOffset });
        acc.currentOffset += length;
        return acc;
      },
      { currentOffset: 0, items: [] as (typeof categoryShare[0] & { length: number; offset: number })[] }
    ).items;
  }, [categoryShare, donutCircumference]);

  const metrics = [
    {
      label: "Revenue Growth",
      value: formatDelta(data?.kpis.revenueGrowth ?? 0),
      delta: `~${Math.abs(data?.kpis.revenueGrowth ?? 0).toFixed(1)}%`,
      tone: deltaTone(data?.kpis.revenueGrowth ?? 0),
    },
    {
      label: "Average Order Value",
      value: formatMoney(data?.kpis.averageOrderValue ?? 0),
      delta: formatDelta(data?.kpis.averageOrderValueDelta ?? 0),
      tone: deltaTone(data?.kpis.averageOrderValueDelta ?? 0),
    },
    {
      label: "Activity Growth",
      value: formatDelta(data?.kpis.customerGrowth ?? 0),
      delta: `${Math.abs(data?.kpis.salesCount ?? 0).toFixed(0)} sales`,
      tone: deltaTone(data?.kpis.customerGrowth ?? 0),
    },
    {
      label: "Sales Count",
      value: (data?.kpis.salesCount ?? 0).toLocaleString(),
      delta: `${formatDelta(data?.kpis.customerGrowth ?? 0)} vs prev`,
      tone: deltaTone(data?.kpis.customerGrowth ?? 0),
    },
  ];

  // Export actions are event-driven so page actions can trigger downloads without prop-drilling callbacks.
  const exportAnalytics = useCallback(() => {
    const header = ["Month", "Revenue"];
    const rows = revenueData.map((row) => [row.label, row.value.toString()]);
    const csv = [header, ...rows].map((line) => line.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `analytics-${period}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }, [period, revenueData]);

  const downloadReport = useCallback(() => {
    const payload = {
      period,
      exportedAt: new Date().toISOString(),
      analytics: data ?? null,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `analytics-report-${period}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, [data, period]);

  useEffect(() => {
    window.addEventListener("analytics:export", exportAnalytics);
    window.addEventListener("analytics:download", downloadReport);
    return () => {
      window.removeEventListener("analytics:export", exportAnalytics);
      window.removeEventListener("analytics:download", downloadReport);
    };
  }, [downloadReport, exportAnalytics]);

  if (isLoading || !data) {
    return (
      <div className="space-y-5 animate-pulse">
        <section className="dashboard-surface h-[380px] w-full bg-muted/60" />
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[1,2,3,4].map(idx => (
            <div key={idx} className="dashboard-kpi-card h-28 bg-muted/60" />
          ))}
        </section>
        <section className="grid gap-5 xl:grid-cols-[1fr_2fr]">
          <div className="dashboard-surface h-[300px] bg-muted/60" />
          <div className="dashboard-surface h-[300px] bg-muted/60" />
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <PageSummaryStrip
        eyebrow="Analytics Snapshot"
        title="Performance signals at a glance"
        description="Use this page to validate revenue movement, customer behavior, and category concentration before exporting or sharing findings."
        items={[
          {
            label: "Window",
            value: period === "12m" ? "12 months" : "6 months",
            helper: "Current analysis range",
          },
          {
            label: "Peak Revenue",
            value: topRevenueMonth ? formatMoney(topRevenueMonth.value) : "$0.00",
            helper: topRevenueMonth ? `${topRevenueMonth.label} performed best` : "No revenue peak yet",
          },
          {
            label: "Peak Activity Day",
            value: topCustomerMonth ? topCustomerMonth.label : "No data",
            helper: topCustomerMonth ? `${topCustomerMonth.value.toLocaleString()} sales interactions` : "Activity data is still building",
          },
          {
            label: "Category Revenue",
            value: formatMoney(totalCategoryRevenue),
            helper: "Tracked across visible segments",
          },
        ]}
      />

      <DashboardPanel
        title="Revenue Analytics"
        description="Monthly revenue trends for the selected reporting window."
        action={
          <Select value={period} onValueChange={(value) => setPeriod(value as PeriodKey)}>
            <SelectTrigger className="min-w-[170px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {periodOptions.map((item) => (
                <SelectItem key={item.key} value={item.key}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      >
        <figure className="dashboard-chart-frame h-[300px] w-full" aria-labelledby="revenue-analytics-title" aria-describedby="revenue-analytics-summary">
          <svg
            className="h-full w-full"
            viewBox="0 0 960 300"
            preserveAspectRatio="none"
            role="img"
            aria-labelledby="revenue-analytics-title revenue-analytics-summary"
          >
            <title id="revenue-analytics-title">Revenue trend for the selected reporting period</title>
            <defs>
              <linearGradient id="revenueLayer1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={dashboardChartPalette.primary} stopOpacity="0.16" />
                <stop offset="100%" stopColor={dashboardChartPalette.primary} stopOpacity="0.02" />
              </linearGradient>
              <linearGradient id="revenueLayer2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={dashboardChartPalette.primarySoftOpaque} stopOpacity="0.42" />
                <stop offset="100%" stopColor={dashboardChartPalette.primarySoft} stopOpacity="0.08" />
              </linearGradient>
            </defs>

            <line x1="0" y1="72" x2="960" y2="72" className="dashboard-chart-grid-line" />
            <line x1="0" y1="132" x2="960" y2="132" className="dashboard-chart-grid-line" />
            <line x1="0" y1="192" x2="960" y2="192" className="dashboard-chart-grid-line" />


            <path d={revenueAreaPath} fill="url(#revenueLayer1)" className="animate-in fade-in duration-1000" />
            <motion.path 
              d={revenueLinePath} 
              fill="none" 
              className="dashboard-chart-line-primary"
              strokeWidth="3.5" 
              strokeLinecap="round" 
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />

            <g className="dashboard-chart-axis-label">
              {revenueData.map((item, index) => (
                <text key={item.label} x={(index / Math.max(revenueData.length - 1, 1)) * 940 + 8} y="294">
                  {item.label}
                </text>
              ))}
            </g>
            <g className="dashboard-chart-axis-label" fontSize="11">
              <text x="4" y="66">{shortMoney(revenueTicks[0] ?? 0)}</text>
              <text x="4" y="126">{shortMoney(revenueTicks[1] ?? 0)}</text>
              <text x="4" y="186">{shortMoney(revenueTicks[2] ?? 0)}</text>
            </g>
            <g>
              {revenueData.map((item, index) => {
                const x = (index / Math.max(revenueData.length - 1, 1)) * 960;
                const y = getChartY(item.value, revStats, 270, 10, 20);
                return (
                  <circle key={`hover-${item.label}`} cx={x} cy={y} r={16} fill="transparent" className="cursor-crosshair transition-colors duration-200 hover:fill-primary/20">
                     <title>{item.label}: {formatMoney(item.value)}</title>
                  </circle>
                );
              })}
            </g>
          </svg>
        </figure>
        <div id="revenue-analytics-summary" className="dashboard-chart-summary">
          Revenue ranges from {formatMoney(revStats.min)} to {formatMoney(revStats.max)}.
          {topRevenueMonth ? ` ${topRevenueMonth.label} is the strongest visible month at ${formatMoney(topRevenueMonth.value)}.` : ""}
        </div>
        {isFetching ? (
          <StateMessage
            tone="loading"
            title="Refreshing analytics"
            message="Metrics and chart layers are updating in the background."
            className="mt-3"
          />
        ) : null}
      </DashboardPanel>

      <motion.section 
        className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
          }
        }}
      >
        {metrics.map((metric) => (
          <motion.article 
            key={metric.label} 
            className="dashboard-kpi-card p-5"
            variants={{
              hidden: { opacity: 0, y: 15 },
              show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
            }}
          >
            <p className="text-sm text-muted-foreground">{metric.label}</p>
            <div className="mt-1 flex items-center justify-between">
              <p className="text-[1.95rem] font-semibold tracking-tight text-foreground">{metric.value}</p>
              <Badge className={`px-2.5 py-1 text-xs font-semibold ${metricToneClass(metric.tone)}`}>
                {metric.delta}
              </Badge>
            </div>
          </motion.article>
        ))}
      </motion.section>

      <section className="grid gap-5 xl:grid-cols-[1fr_2fr]">
        <FeatureGate feature="analytics.trend" overlay>
        <DashboardPanel
          title="Sales by Category"
          description="Distribution of revenue across your highest-contributing categories."
        >
          <div className="dashboard-chart-frame mt-6 flex justify-center">
            <svg
              width="220"
              height="220"
              viewBox="0 0 220 220"
              role="img"
              aria-labelledby="category-share-title category-share-summary"
            >
              <title id="category-share-title">Revenue share by category</title>
              <circle cx="110" cy="110" r="70" fill="none" stroke={dashboardChartPalette.neutralTrack} strokeWidth="14" />
              {parsedCategoryShares.map((item) => {
                  const dasharray = `${item.length} ${donutCircumference}`;
                  return (
                    <circle
                      key={item.label}
                      cx="110"
                      cy="110"
                      r="70"
                      fill="none"
                      stroke={item.color}
                      strokeWidth="14"
                      className="cursor-pointer hover:opacity-80 transition-opacity"
                      strokeDasharray={dasharray}
                      strokeDashoffset={-item.offset}
                      transform="rotate(-90 110 110)"
                    >
                      <title>{item.label}: {item.value.toFixed(1)}%</title>
                    </circle>
                  );
              })}
              <circle cx="110" cy="110" r="48" fill="var(--card)" />
              <text x="110" y="112" textAnchor="middle" className="fill-foreground font-bold" style={{ fontSize: 26 }}>
                {shortMoney(totalCategoryRevenue)}
              </text>
              <text x="110" y="136" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 13 }}>
                Total Sales
              </text>
            </svg>
          </div>
          <div className="mt-2 grid gap-2 text-sm text-muted-foreground">
            {categoryShare.length > 0 ? (
              categoryShare.map((item) => (
                <p key={item.label} className="flex items-center gap-2">
                  <span className="inline-block size-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.label} ({item.value.toFixed(1)}%)
                </p>
              ))
            ) : (
              <EmptyState
                eyebrow="Category mix"
                title="Category share appears once revenue is categorized"
                description="Assign category-level sales consistently and this panel will show where revenue is concentrated."
                compact
              />
            )}
          </div>
          <div id="category-share-summary" className="dashboard-chart-summary">
            {categoryShare.length > 0
              ? `Top category: ${categoryShare[0].label} at ${categoryShare[0].value.toFixed(1)}% of revenue.`
              : "No category data is available for the selected reporting window."}
          </div>
        </DashboardPanel>
        </FeatureGate>

        <FeatureGate feature="analytics.top-products" overlay>
        <DashboardPanel
          title="Product Revenue Ranking"
          description="Compare top-selling products by revenue contribution for the selected period."
        >
          <div className="mt-6 space-y-6">
            {topProducts.length > 0 ? (
              topProducts.map((item, index) => (
                <div key={item.name}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">{item.name} <span className="text-muted-foreground font-normal ml-2">{item.percent.toFixed(1)}%</span></span>
                    <span className="font-medium text-primary">{formatMoney(item.revenue)}</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-secondary">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${item.percent}%`, opacity: Math.max(0.35, 1 - index * 0.17) }} />
                  </div>
                </div>
              ))
            ) : (
              <EmptyState
                eyebrow="Product ranking"
                title="Product leaders show up after more sales activity"
                description="Once enough product-level sales are tracked, this ranking will highlight durable revenue leaders instead of noise."
                compact
              />
            )}
          </div>
        </DashboardPanel>
        </FeatureGate>
      </section>

      <section className="grid gap-5 xl:grid-cols-2">

        <DashboardPanel
          title="Customer Activity"
          description="Monitor demand patterns and customer interaction changes across the reporting window."
        >
          <figure className="dashboard-chart-frame mt-5 h-[220px]" aria-labelledby="customer-activity-title" aria-describedby="customer-activity-summary">
            <svg
              className="h-full w-full"
              viewBox="0 0 620 220"
              preserveAspectRatio="none"
              role="img"
              aria-labelledby="customer-activity-title customer-activity-summary"
            >
              <title id="customer-activity-title">Customer activity trend for the selected reporting period</title>
              <defs>
                <linearGradient id="customerArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={dashboardChartPalette.primarySoftOpaque} stopOpacity="0.48" />
                  <stop offset="100%" stopColor={dashboardChartPalette.primarySoft} stopOpacity="0.07" />
                </linearGradient>
              </defs>
              <line x1="0" y1="56" x2="620" y2="56" className="dashboard-chart-grid-line" />
              <line x1="0" y1="108" x2="620" y2="108" className="dashboard-chart-grid-line" />
              <line x1="0" y1="160" x2="620" y2="160" className="dashboard-chart-grid-line" />
              <path d={customerAreaPath} fill="url(#customerArea)" className="animate-in fade-in duration-1000" />
              <motion.path 
                d={customerPath} 
                fill="none" 
                className="dashboard-chart-line-primary"
                strokeWidth="3" 
                strokeLinecap="round" 
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
              <g className="dashboard-chart-axis-label">
                {customerData.map((item, index) => (
                  <text key={item.label} x={(index / Math.max(customerData.length - 1, 1)) * 596 + 12} y="214">
                    {item.label}
                  </text>
                ))}
              </g>
              <g className="dashboard-chart-axis-label" fontSize="11">
              <text x="4" y="50">{Math.round(customerTicks[0] ?? 0)}</text>
              <text x="4" y="102">{Math.round(customerTicks[1] ?? 0)}</text>
              <text x="4" y="154">{Math.round(customerTicks[2] ?? 0)}</text>
            </g>
            <g>
                {customerData.map((item, index) => {
                  const x = (index / Math.max(customerData.length - 1, 1)) * 620;
                  const y = getChartY(item.value, custStats, 180, 10, 20);
                return (
                    <circle key={`hover-${item.label}`} cx={x} cy={y} r={14} fill="transparent" className="cursor-crosshair transition-colors duration-200 hover:fill-primary/20">
                       <title>{item.label}: {item.value}</title>
                    </circle>
                  );
                })}
              </g>
            </svg>
          </figure>
          <div id="customer-activity-summary" className="dashboard-chart-summary">
            Customer activity ranges from {custStats.min} to {custStats.max}.
            {topCustomerMonth ? ` ${topCustomerMonth.label} is the most active point at ${topCustomerMonth.value}.` : ""}
          </div>
        </DashboardPanel>

        <DashboardPanel
          title="Sales Activity Heatmap"
          description="Weekly intensity map showing where sales activity clusters across the business."
          action={
            <div className="text-xs text-muted-foreground">
              Low
              <span className="mx-2 inline-flex gap-1 align-middle">
                {[1, 2, 3, 4, 5].map((item) => (
                  <span
                    key={item}
                    className="inline-block h-3 w-3 rounded-sm"
                    style={{ backgroundColor: dashboardHeatmapColor(item) }}
                  />
                ))}
              </span>
              High
            </div>
          }
        >
          <div
            className="grid grid-cols-7 gap-2"
            role="img"
            aria-label="Weekly sales activity heatmap"
            aria-describedby="sales-heatmap-summary"
          >
            {heatmap.flat().map((cell, index) => (
              <div
                key={`${cell.day}-${index}`}
                className="aspect-square rounded-sm"
                style={{ backgroundColor: dashboardHeatmapColor(cell.value) }}
                title={`${cell.day}: intensity ${cell.value}`}
              />
            ))}
          </div>
          <div className="mt-3 grid grid-cols-7 text-center text-xs text-muted-foreground">
            {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
          <div id="sales-heatmap-summary" className="dashboard-chart-summary">
            The heatmap shows relative sales intensity from low to high across the week.
            {heatmap.flat().length > 0
              ? ` Highest visible intensity is ${Math.max(...heatmap.flat().map((cell) => cell.value))}.`
              : " No heatmap data is available yet."}
          </div>
        </DashboardPanel>
      </section>
    </div>
  );
}
