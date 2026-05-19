"use client";

import { useMemo, useState } from "react";
import {
  BarChart3,
  Building2,
  ChevronRight,
  GraduationCap,
  Sparkles,
  Store,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DashboardPanel } from "@/components/dashboard/dashboard-panel";
import { DashboardChartFigure, DashboardChartRail, DashboardChartStat } from "@/components/dashboard/dashboard-chart-primitives";
import { PageSummaryStrip } from "@/components/shared/page-summary-strip";
import { useGetAdminAnalyticsQuery } from "@/store/api";
import { dashboardChartPalette } from "@/components/dashboard/chart-tokens";

type TrendKey = "6m" | "yearly";

type AnalyticsResponse = {
  stats: {
    annualRevenue: number;
    monthlyRevenue: number;
    totalSubscribers: number;
    churnRate: number;
  };
  plans: {
    Free: number;
    Pro: number;
    Business: number;
  };
  revenueByMonth: {
    month: string;
    revenue: number;
  }[];
  recentActivities: {
    id: string;
    title: string;
    description: string;
    date: string;
  }[];
};

type SegmentIconType = "building" | "sparkles" | "store" | "graduation";

type SegmentItem = {
  id: string;
  title: string;
  description: string;
  icon: SegmentIconType;
};

function buildCurvePath(values: number[], width: number, height: number) {
  if (values.length === 0) return "";

  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = Math.max(max - min, 1);

  const points = values.map((value, index) => {
    const x = (index / Math.max(values.length - 1, 1)) * width;
    const y = height - ((value - min) / range) * (height - 24) - 12;
    return { x, y };
  });

  let path = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i += 1) {
    const prev = points[i - 1];
    const curr = points[i];
    const cp1x = prev.x + (curr.x - prev.x) * 0.24;
    const cp2x = curr.x - (curr.x - prev.x) * 0.24;
    path += ` C ${cp1x} ${prev.y}, ${cp2x} ${curr.y}, ${curr.x} ${curr.y}`;
  }

  return path;
}

function SegmentIcon({ icon }: { icon: SegmentIconType }) {
  if (icon === "building") return <Building2 className="size-4 text-muted-foreground" />;
  if (icon === "sparkles") return <Sparkles className="size-4 text-muted-foreground" />;
  if (icon === "store") return <Store className="size-4 text-muted-foreground" />;
  return <GraduationCap className="size-4 text-muted-foreground" />;
}

const defaultData: AnalyticsResponse = {
  stats: {
    annualRevenue: 0,
    monthlyRevenue: 0,
    totalSubscribers: 0,
    churnRate: 0,
  },
  plans: {
    Free: 0,
    Pro: 0,
    Business: 0,
  },
  revenueByMonth: [],
  recentActivities: [],
};

export function AdminAnalyticsWorkspace() {
  const [trendKey, setTrendKey] = useState<TrendKey>("6m");
  const { data: analyticsData, isLoading } = useGetAdminAnalyticsQuery();
  const data = analyticsData ?? defaultData;

  const trendData = useMemo(() => {
    if (trendKey === "6m") {
      return data.revenueByMonth.slice(-6);
    }
    return data.revenueByMonth;
  }, [data.revenueByMonth, trendKey]);

  const trendValues = trendData.map((item) => item.revenue);
  const trendPath = useMemo(
    () => buildCurvePath(trendValues, 860, 270),
    [trendValues]
  );
  const trendAreaPath = trendPath ? `${trendPath} L 860 280 L 0 280 Z` : "";

  const yTicks = useMemo(() => {
    const max = Math.max(...trendValues, 0);
    const step = max > 0 ? Math.ceil(max / 4 / 10) * 10 : 10;
    return Array.from({ length: 5 }).map((_, index) => index * step);
  }, [trendValues]);

  const totalPlans = data.plans.Free + data.plans.Pro + data.plans.Business;

  const subscriptionDistribution = [
    {
      tier: "FREE",
      percent: totalPlans > 0 ? Math.round((data.plans.Free / totalPlans) * 100) : 0,
      valueLabel: data.plans.Free.toString(),
      color: dashboardChartPalette.neutralTrack,
    },
    {
      tier: "PRO",
      percent: totalPlans > 0 ? Math.round((data.plans.Pro / totalPlans) * 100) : 0,
      valueLabel: data.plans.Pro.toString(),
      color: dashboardChartPalette.primary,
    },
    {
      tier: "BUSINESS",
      percent: totalPlans > 0 ? Math.round((data.plans.Business / totalPlans) * 100) : 0,
      valueLabel: data.plans.Business.toString(),
      color: dashboardChartPalette.highlight,
    },
  ];

  const revenueVelocity = trendData.map((item) => {
    const maxRevenue = Math.max(...trendValues, 1);
    const width = Math.max((item.revenue / maxRevenue) * 100, item.revenue > 0 ? 8 : 0);

    return {
      month: item.month,
      valueLabel: `$${item.revenue.toLocaleString()}`,
      width,
      highlight: item.revenue === maxRevenue && item.revenue > 0,
    };
  });

  const userSegments: SegmentItem[] = [
    {
      id: "free-users",
      title: "Free Users",
      description: `${data.plans.Free} accounts currently on the Free plan`,
      icon: "store",
    },
    {
      id: "pro-users",
      title: "Pro Customers",
      description: `${data.plans.Pro} accounts currently on the Pro plan`,
      icon: "sparkles",
    },
    {
      id: "business-users",
      title: "Business Customers",
      description: `${data.plans.Business} accounts currently on the Business plan`,
      icon: "building",
    },
    {
      id: "platform-overview",
      title: "Platform Overview",
      description: `${data.stats.totalSubscribers} active subscribers across all plans`,
      icon: "graduation",
    },
  ];

  const [activeSegmentId, setActiveSegmentId] = useState("free-users");

  if (isLoading) {
      return (
        <div className="space-y-6">
        <div className="dashboard-surface p-6 text-muted-foreground shadow-none">
          Loading analytics...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageSummaryStrip
        eyebrow="Platform Analytics"
        title="Subscription and revenue intelligence"
        description="Review platform-level growth, plan distribution, and recent commercial activity from a single admin analytics surface."
        items={[
          {
            label: "Annual Revenue",
            value: `$${data.stats.annualRevenue.toLocaleString()}`,
            helper: "Estimated yearly platform revenue",
          },
          {
            label: "Monthly Revenue",
            value: `$${data.stats.monthlyRevenue.toLocaleString()}`,
            helper: "Current recurring revenue cadence",
          },
          {
            label: "Subscribers",
            value: data.stats.totalSubscribers.toLocaleString(),
            helper: "Active subscribers across plans",
          },
          {
            label: "Churn",
            value: `${data.stats.churnRate}%`,
            helper: "Cancellation-driven attrition rate",
          },
        ]}
      />

      <section className="grid gap-5 xl:grid-cols-[2.2fr_1fr]">
        <DashboardPanel
          title="Revenue Trends"
          description="Subscription revenue performance over time."
          action={
            <div className="dashboard-filter-segment">
              <button
                type="button"
                className="dashboard-filter-segment-button"
                data-active={trendKey === "6m"}
                onClick={() => setTrendKey("6m")}
              >
                Last 6 Months
              </button>

              <button
                type="button"
                className="dashboard-filter-segment-button"
                data-active={trendKey === "yearly"}
                onClick={() => setTrendKey("yearly")}
              >
                Yearly
              </button>
            </div>
          }
          className="shadow-none"
          bodyClassName="pt-5"
        >
          <div className="dashboard-chart-shell">
          <DashboardChartFigure ariaLabel="Admin revenue trends chart" frameClassName="h-[300px] w-full">
            <svg className="h-full w-full" viewBox="0 0 860 300" preserveAspectRatio="none">
              <defs>
                <linearGradient id="adminAnalyticsArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.02" />
                </linearGradient>
              </defs>

              {[64, 120, 176, 232].map((y) => (
                <line
                  key={y}
                  x1="0"
                  y1={y}
                  x2="860"
                  y2={y}
                  stroke="var(--chart-grid)"
                  strokeDasharray="5 6"
                />
              ))}

              {trendPath ? (
                <>
                  <path d={trendAreaPath} fill="url(#adminAnalyticsArea)" />
                  <path
                    d={trendPath}
                    fill="none"
                    stroke="var(--primary)"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                </>
              ) : null}

              <g fill="var(--muted-foreground)" fontSize="12">
                {trendData.map((point, index) => (
                  <text
                    key={point.month}
                    x={(index / Math.max(trendData.length - 1, 1)) * 838 + 8}
                    y="293"
                  >
                    {point.month.toUpperCase()}
                  </text>
                ))}
              </g>

              <g fill="var(--muted-foreground)" fontSize="11">
                {yTicks.map((tick, index) => (
                  <text key={tick} x="4" y={278 - index * 56}>
                    {tick}
                  </text>
                ))}
              </g>
            </svg>
          </DashboardChartFigure>
          <DashboardChartRail>
            <DashboardChartStat label="Annual revenue" value={`$${data.stats.annualRevenue.toLocaleString()}`} copy="Estimated yearly platform revenue." />
            <DashboardChartStat label="Monthly revenue" value={`$${data.stats.monthlyRevenue.toLocaleString()}`} copy="Current recurring revenue pace." />
            <DashboardChartStat label="Subscribers" value={data.stats.totalSubscribers.toLocaleString()} copy="Active accounts across visible plans." />
          </DashboardChartRail>
          </div>
        </DashboardPanel>

        <DashboardPanel
          title="Revenue Velocity"
          description="Performance per fiscal month."
          action={<BarChart3 className="size-5 text-primary" />}
          className="shadow-none"
          bodyClassName="pt-5"
        >
          <div className="mt-6 space-y-5">
            {revenueVelocity.map((item) => (
              <div key={item.month}>
                <div className="mb-2 flex items-center justify-between text-[15px]">
                  <span
                    className={cn(
                      "font-medium text-secondary-foreground",
                      item.highlight && "text-primary"
                    )}
                  >
                    {item.month}
                  </span>
                  <span
                    className={cn(
                      "font-semibold text-foreground",
                      item.highlight && "text-primary"
                    )}
                  >
                    {item.valueLabel}
                  </span>
                </div>

                <div className="h-3 rounded-full bg-muted">
                  <div
                    className={cn(
                      "h-full rounded-full bg-primary",
                      item.highlight && "bg-amber-700"
                    )}
                    style={{ width: `${item.width}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-xl border border-primary/20 bg-primary/10 p-4">
            <p className="text-sm font-semibold text-primary">Projection Insight</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Current annualized revenue is projected from active subscription performance.
            </p>
          </div>
        </DashboardPanel>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">
        <DashboardPanel className="shadow-none" bodyClassName="pt-5">
          <div className="mb-6 flex items-start justify-between">
            <h3 className="dashboard-section-title">Subscription Distribution</h3>
            <button
              type="button"
              className="text-sm font-semibold text-primary transition-colors hover:text-primary/80"
            >
              Full Audit
            </button>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {subscriptionDistribution.map((item) => {
              const circumference = 2 * Math.PI * 43;
              const progress = (item.percent / 100) * circumference;

              return (
                <div key={item.tier} className="flex flex-col items-center">
                  <svg width="124" height="124" viewBox="0 0 124 124">
                    <circle
                      cx="62"
                      cy="62"
                      r="43"
                      fill="none"
                      stroke="var(--chart-grid)"
                      strokeWidth="9"
                    />
                    <circle
                      cx="62"
                      cy="62"
                      r="43"
                      fill="none"
                      stroke={item.color}
                      strokeWidth="9"
                      strokeLinecap="round"
                      strokeDasharray={`${progress} ${circumference}`}
                      transform="rotate(-90 62 62)"
                    />
                    <text
                      x="62"
                      y="67"
                      textAnchor="middle"
                      className="fill-foreground"
                      style={{ fontSize: 22, fontWeight: 700 }}
                    >
                      {item.percent}%
                    </text>
                  </svg>
                  <p className="mt-3 text-xs font-semibold tracking-wider text-muted-foreground">
                    {item.tier}
                  </p>
                  <p className="mt-1 text-4xl font-semibold tracking-tight text-foreground">
                    {item.valueLabel}
                  </p>
                </div>
              );
            })}
          </div>
        </DashboardPanel>

        <DashboardPanel title="Active User Segments" className="shadow-none" bodyClassName="pt-5">
          <div className="mt-4 space-y-2.5">
            {userSegments.map((segment) => (
              <button
                key={segment.id}
                type="button"
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left transition-colors",
                  activeSegmentId === segment.id
                    ? "border-primary/30 bg-primary/10"
                    : "border-border bg-card hover:bg-accent/35"
                )}
                onClick={() => setActiveSegmentId(segment.id)}
              >
                <span className="inline-flex size-9 items-center justify-center rounded-full bg-surface-subtle">
                  <SegmentIcon icon={segment.icon} />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-foreground">
                    {segment.title}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {segment.description}
                  </span>
                </span>

                <ChevronRight className="size-4 text-muted-foreground" />
              </button>
            ))}
          </div>
        </DashboardPanel>
      </section>

      <DashboardPanel className="shadow-none" bodyClassName="pt-5">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h3 className="dashboard-section-title">Recent Activity</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Latest subscription-related platform updates
            </p>
          </div>
          <BarChart3 className="size-5 text-primary" />
        </div>

        <div className="space-y-4">
          {data.recentActivities.length === 0 ? (
            <p className="text-sm text-muted-foreground">No recent activity yet.</p>
          ) : (
            data.recentActivities.map((item) => (
              <div
                key={item.id}
                className="rounded-[calc(var(--radius-panel)-6px)] border border-border/80 bg-card/88 px-4 py-4 shadow-[var(--shadow-control)]"
              >
                <h3 className="font-medium text-foreground">{item.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {new Date(item.date).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      </DashboardPanel>
    </div>
  );
}
