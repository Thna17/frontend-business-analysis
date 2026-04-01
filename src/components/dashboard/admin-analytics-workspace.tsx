"use client";

import { useMemo, useState } from "react";
import {
  BarChart3,
  Building2,
  ChevronRight,
  CircleAlert,
  DollarSign,
  GraduationCap,
  Sparkles,
  Store,
  TrendingUp,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetAdminAnalyticsQuery } from "@/store/api";

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
    Plus: number;
    Pro: number;
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
  if (icon === "building") return <Building2 className="size-4 text-[#475467]" />;
  if (icon === "sparkles") return <Sparkles className="size-4 text-[#475467]" />;
  if (icon === "store") return <Store className="size-4 text-[#475467]" />;
  return <GraduationCap className="size-4 text-[#475467]" />;
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
    Plus: 0,
    Pro: 0,
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

  const totalPlans = data.plans.Free + data.plans.Plus + data.plans.Pro;

  const subscriptionDistribution = [
    {
      tier: "FREE",
      percent: totalPlans > 0 ? Math.round((data.plans.Free / totalPlans) * 100) : 0,
      valueLabel: data.plans.Free.toString(),
      color: "#d6dbe4",
    },
    {
      tier: "PLUS",
      percent: totalPlans > 0 ? Math.round((data.plans.Plus / totalPlans) * 100) : 0,
      valueLabel: data.plans.Plus.toString(),
      color: "#d4af35",
    },
    {
      tier: "PRO",
      percent: totalPlans > 0 ? Math.round((data.plans.Pro / totalPlans) * 100) : 0,
      valueLabel: data.plans.Pro.toString(),
      color: "#7a6200",
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
      id: "plus-users",
      title: "Growing Businesses",
      description: `${data.plans.Plus} accounts currently on the Plus plan`,
      icon: "sparkles",
    },
    {
      id: "pro-users",
      title: "Scaling Teams",
      description: `${data.plans.Pro} accounts currently on the Pro plan`,
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

  const analyticsMetrics = [
    {
      title: "Annual Revenue",
      value: `$${data.stats.annualRevenue.toLocaleString()}`,
      subtitle: "Estimated yearly revenue",
      icon: <DollarSign className="size-5 text-[#b08a12]" />,
    },
    {
      title: "Monthly Revenue",
      value: `$${data.stats.monthlyRevenue.toLocaleString()}`,
      subtitle: "Current monthly recurring revenue",
      icon: <TrendingUp className="size-5 text-[#b08a12]" />,
    },
    {
      title: "Total Subscribers",
      value: data.stats.totalSubscribers.toLocaleString(),
      subtitle: "Active subscribers on the platform",
      icon: <Users className="size-5 text-[#b08a12]" />,
    },
    {
      title: "Churn Rate",
      value: `${data.stats.churnRate}%`,
      subtitle: "Based on cancelled subscriptions",
      icon: <CircleAlert className="size-5 text-[#b08a12]" />,
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <section>
          <h1 className="dashboard-title">Welcome in, Admin!</h1>
          <p className="dashboard-subtitle mt-2">
            Here&apos;s what&apos;s happening across your platform today.
          </p>
        </section>

        <div className="dashboard-surface border-[#e7e9ee] p-6 shadow-none text-[#667085]">
          Loading analytics...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section>
        <h1 className="dashboard-title">Welcome in, Admin!</h1>
        <p className="dashboard-subtitle mt-2">
          Here&apos;s what&apos;s happening across your platform today.
        </p>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {analyticsMetrics.map((metric) => (
          <article
            key={metric.title}
            className="dashboard-surface border-[#e7e9ee] p-5 shadow-none"
          >
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-[#667085]">{metric.title}</p>
              {metric.icon}
            </div>
            <h3 className="text-3xl font-semibold tracking-tight text-[#101828]">
              {metric.value}
            </h3>
            <p className="mt-2 text-sm text-[#98a2b3]">{metric.subtitle}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[2.2fr_1fr]">
        <article className="dashboard-surface border-[#e7e9ee] p-6 shadow-none">
          <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="dashboard-section-title">Revenue Trends</h3>
              <p className="mt-1 text-sm text-[#667085]">
                Subscription revenue performance over time
              </p>
            </div>

            <div className="inline-flex rounded-full bg-[#f2f4f7] p-1">
              <button
                type="button"
                className={cn(
                  "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                  trendKey === "6m"
                    ? "bg-white text-[#101828] shadow-sm"
                    : "text-[#667085]"
                )}
                onClick={() => setTrendKey("6m")}
              >
                Last 6 Months
              </button>

              <button
                type="button"
                className={cn(
                  "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                  trendKey === "yearly"
                    ? "bg-white text-[#101828] shadow-sm"
                    : "text-[#667085]"
                )}
                onClick={() => setTrendKey("yearly")}
              >
                Yearly
              </button>
            </div>
          </div>

          <div className="h-[300px] w-full">
            <svg className="h-full w-full" viewBox="0 0 860 300" preserveAspectRatio="none">
              <defs>
                <linearGradient id="adminAnalyticsArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#d4af35" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#d4af35" stopOpacity="0.02" />
                </linearGradient>
              </defs>

              {[64, 120, 176, 232].map((y) => (
                <line
                  key={y}
                  x1="0"
                  y1={y}
                  x2="860"
                  y2={y}
                  stroke="#edf0f5"
                  strokeDasharray="5 6"
                />
              ))}

              {trendPath ? (
                <>
                  <path d={trendAreaPath} fill="url(#adminAnalyticsArea)" />
                  <path
                    d={trendPath}
                    fill="none"
                    stroke="#c69d24"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                </>
              ) : null}

              <g fill="#98a2b3" fontSize="12">
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

              <g fill="#98a2b3" fontSize="11">
                {yTicks.map((tick, index) => (
                  <text key={tick} x="4" y={278 - index * 56}>
                    {tick}
                  </text>
                ))}
              </g>
            </svg>
          </div>
        </article>

        <article className="dashboard-surface border-[#e7e9ee] p-6 shadow-none">
          <h3 className="dashboard-section-title">Revenue Velocity</h3>
          <p className="mt-1 text-sm text-[#667085]">Performance per fiscal month</p>

          <div className="mt-6 space-y-5">
            {revenueVelocity.map((item) => (
              <div key={item.month}>
                <div className="mb-2 flex items-center justify-between text-[15px]">
                  <span
                    className={cn(
                      "font-medium text-[#344054]",
                      item.highlight && "text-[#8a6b0b]"
                    )}
                  >
                    {item.month}
                  </span>
                  <span
                    className={cn(
                      "font-semibold text-[#101828]",
                      item.highlight && "text-[#8a6b0b]"
                    )}
                  >
                    {item.valueLabel}
                  </span>
                </div>

                <div className="h-3 rounded-full bg-[#eceff3]">
                  <div
                    className={cn(
                      "h-full rounded-full bg-[#d4af35]",
                      item.highlight && "bg-[#7a6200]"
                    )}
                    style={{ width: `${item.width}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-xl border border-[#ece6d2] bg-[#fbf9f2] p-4">
            <p className="text-sm font-semibold text-[#8a6b0b]">Projection Insight</p>
            <p className="mt-1 text-sm text-[#667085]">
              Current annualized revenue is projected from active subscription performance.
            </p>
          </div>
        </article>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">
        <article className="dashboard-surface border-[#e7e9ee] p-6 shadow-none">
          <div className="mb-6 flex items-start justify-between">
            <h3 className="dashboard-section-title">Subscription Distribution</h3>
            <button
              type="button"
              className="text-sm font-semibold text-[#8a6b0b] transition-colors hover:text-[#6f5606]"
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
                      stroke="#ecf0f5"
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
                      className="fill-[#101828]"
                      style={{ fontSize: 22, fontWeight: 700 }}
                    >
                      {item.percent}%
                    </text>
                  </svg>
                  <p className="mt-3 text-xs font-semibold tracking-wider text-[#98a2b3]">
                    {item.tier}
                  </p>
                  <p className="mt-1 text-4xl font-semibold tracking-tight text-[#101828]">
                    {item.valueLabel}
                  </p>
                </div>
              );
            })}
          </div>
        </article>

        <article className="dashboard-surface border-[#e7e9ee] p-6 shadow-none">
          <h3 className="dashboard-section-title">Active User Segments</h3>

          <div className="mt-4 space-y-2.5">
            {userSegments.map((segment) => (
              <button
                key={segment.id}
                type="button"
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left transition-colors",
                  activeSegmentId === segment.id
                    ? "border-[#d7bf6f] bg-[#fffaf0]"
                    : "border-[#eceff3] bg-white hover:bg-[#f8fafc]"
                )}
                onClick={() => setActiveSegmentId(segment.id)}
              >
                <span className="inline-flex size-9 items-center justify-center rounded-full bg-[#f2f4f7]">
                  <SegmentIcon icon={segment.icon} />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-[#101828]">
                    {segment.title}
                  </span>
                  <span className="block truncate text-xs text-[#98a2b3]">
                    {segment.description}
                  </span>
                </span>

                <ChevronRight className="size-4 text-[#98a2b3]" />
              </button>
            ))}
          </div>
        </article>
      </section>

      <section className="dashboard-surface border-[#e7e9ee] p-6 shadow-none">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h3 className="dashboard-section-title">Recent Activity</h3>
            <p className="mt-1 text-sm text-[#667085]">
              Latest subscription-related platform updates
            </p>
          </div>
          <BarChart3 className="size-5 text-[#b08a12]" />
        </div>

        <div className="space-y-4">
          {data.recentActivities.length === 0 ? (
            <p className="text-sm text-[#98a2b3]">No recent activity yet.</p>
          ) : (
            data.recentActivities.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-[#f0ece2] px-4 py-4"
              >
                <h3 className="font-medium text-[#101828]">{item.title}</h3>
                <p className="mt-1 text-sm text-[#667085]">{item.description}</p>
                <p className="mt-2 text-xs text-[#98a2b3]">
                  {new Date(item.date).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
