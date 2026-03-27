"use client";

import { useMemo, useState } from "react";
import { Building2, ChevronRight, GraduationCap, Sparkles, Store } from "lucide-react";
import { KpiCard } from "@/components/dashboard/kpi-card";
import {
  adminAnalyticsMetrics,
  adminAnalyticsTrends,
  adminRevenueVelocity,
  adminSubscriptionDistribution,
  adminUserSegments,
} from "@/features/owner-dashboard/dashboard-mock";
import { cn } from "@/lib/utils";

type TrendKey = "6m" | "yearly";

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

function SegmentIcon({ icon }: { icon: "building" | "sparkles" | "store" | "graduation" }) {
  if (icon === "building") return <Building2 className="size-4 text-[#475467]" />;
  if (icon === "sparkles") return <Sparkles className="size-4 text-[#475467]" />;
  if (icon === "store") return <Store className="size-4 text-[#475467]" />;
  return <GraduationCap className="size-4 text-[#475467]" />;
}

export function AdminAnalyticsWorkspace() {
  const [trendKey, setTrendKey] = useState<TrendKey>("6m");
  const [activeSegmentId, setActiveSegmentId] = useState(adminUserSegments[0]?.id ?? "");

  const trendData = adminAnalyticsTrends[trendKey];
  const trendPath = useMemo(() => buildCurvePath(trendData.map((item) => item.value), 860, 270), [trendData]);
  const trendAreaPath = `${trendPath} L 860 280 L 0 280 Z`;

  const yTicks = useMemo(() => {
    const max = Math.max(...trendData.map((item) => item.value));
    const step = Math.ceil(max / 4 / 10) * 10;
    return Array.from({ length: 5 }).map((_, index) => index * step);
  }, [trendData]);

  return (
    <div className="space-y-6">
      <section>
        <h1 className="dashboard-title">Welcome in, Admin!</h1>
        <p className="dashboard-subtitle mt-2">Here&apos;s what&apos;s happening across your platform today.</p>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {adminAnalyticsMetrics.map((metric) => (
          <KpiCard key={metric.title} item={metric} />
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[2.2fr_1fr]">
        <article className="dashboard-surface border-[#e7e9ee] p-6 shadow-none">
          <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="dashboard-section-title">User Growth Trends</h3>
              <p className="mt-1 text-sm text-[#667085]">Monthly active users trajectory (Jan - June)</p>
            </div>
            <div className="inline-flex rounded-full bg-[#f2f4f7] p-1">
              <button
                type="button"
                className={cn(
                  "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                  trendKey === "6m" ? "bg-white text-[#101828] shadow-sm" : "text-[#667085]",
                )}
                onClick={() => setTrendKey("6m")}
              >
                Last 6 Months
              </button>
              <button
                type="button"
                className={cn(
                  "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                  trendKey === "yearly" ? "bg-white text-[#101828] shadow-sm" : "text-[#667085]",
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
                <line key={y} x1="0" y1={y} x2="860" y2={y} stroke="#edf0f5" strokeDasharray="5 6" />
              ))}

              <path d={trendAreaPath} fill="url(#adminAnalyticsArea)" />
              <path d={trendPath} fill="none" stroke="#c69d24" strokeWidth="3.5" strokeLinecap="round" />

              <g fill="#98a2b3" fontSize="12">
                {trendData.map((point, index) => (
                  <text key={point.month} x={(index / Math.max(trendData.length - 1, 1)) * 838 + 8} y="293">
                    {point.month.toUpperCase()}
                  </text>
                ))}
              </g>

              <g fill="#98a2b3" fontSize="11">
                {yTicks.map((tick, index) => (
                  <text key={tick} x="4" y={278 - index * 56}>
                    {tick}K
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
            {adminRevenueVelocity.map((item) => (
              <div key={item.month}>
                <div className="mb-2 flex items-center justify-between text-[15px]">
                  <span className={cn("font-medium text-[#344054]", item.highlight && "text-[#8a6b0b]")}>
                    {item.month}
                  </span>
                  <span className={cn("font-semibold text-[#101828]", item.highlight && "text-[#8a6b0b]")}>{item.valueLabel}</span>
                </div>
                <div className="h-3 rounded-full bg-[#eceff3]">
                  <div
                    className={cn("h-full rounded-full bg-[#d4af35]", item.highlight && "bg-[#7a6200]")}
                    style={{ width: `${item.width}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-xl border border-[#ece6d2] bg-[#fbf9f2] p-4">
            <p className="text-sm font-semibold text-[#8a6b0b]">Projection Insight</p>
            <p className="mt-1 text-sm text-[#667085]">On track to exceed Q2 targets by 14.2% based on current velocity.</p>
          </div>
        </article>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">
        <article className="dashboard-surface border-[#e7e9ee] p-6 shadow-none">
          <div className="mb-6 flex items-start justify-between">
            <h3 className="dashboard-section-title">Subscription Distribution</h3>
            <button type="button" className="text-sm font-semibold text-[#8a6b0b] transition-colors hover:text-[#6f5606]">
              Full Audit
            </button>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {adminSubscriptionDistribution.map((item) => {
              const circumference = 2 * Math.PI * 43;
              const progress = (item.percent / 100) * circumference;
              return (
                <div key={item.label} className="flex flex-col items-center">
                  <svg width="124" height="124" viewBox="0 0 124 124">
                    <circle cx="62" cy="62" r="43" fill="none" stroke="#ecf0f5" strokeWidth="9" />
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
                    <text x="62" y="67" textAnchor="middle" className="fill-[#101828]" style={{ fontSize: 22, fontWeight: 700 }}>
                      {item.percent}%
                    </text>
                  </svg>
                  <p className="mt-3 text-xs font-semibold tracking-wider text-[#98a2b3]">
                    {item.label.toUpperCase()}
                  </p>
                  <p className="mt-1 text-4xl font-semibold tracking-tight text-[#101828]">{item.users}</p>
                </div>
              );
            })}
          </div>
        </article>

        <article className="dashboard-surface border-[#e7e9ee] p-6 shadow-none">
          <h3 className="dashboard-section-title">Active User Segments</h3>
          <div className="mt-4 space-y-2.5">
            {adminUserSegments.map((segment) => (
              <button
                key={segment.id}
                type="button"
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left transition-colors",
                  activeSegmentId === segment.id ? "border-[#d7bf6f] bg-[#fffaf0]" : "border-[#eceff3] bg-white hover:bg-[#f8fafc]",
                )}
                onClick={() => setActiveSegmentId(segment.id)}
              >
                <span className="inline-flex size-9 items-center justify-center rounded-full bg-[#f2f4f7]">
                  <SegmentIcon icon={segment.icon} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-[#101828]">{segment.title}</span>
                  <span className="block truncate text-xs text-[#98a2b3]">{segment.description}</span>
                </span>
                <ChevronRight className="size-4 text-[#98a2b3]" />
              </button>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
