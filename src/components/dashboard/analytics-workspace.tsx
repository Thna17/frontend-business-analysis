"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  analyticsCategoryShare,
  analyticsCustomerSeries,
  analyticsHeatmap,
  analyticsMetrics,
  analyticsRevenueSeries,
  AnalyticsSeriesPoint,
  RankingItem,
} from "@/features/owner-dashboard/dashboard-mock";

type PeriodKey = "3m" | "6m" | "12m";

interface AnalyticsWorkspaceProps {
  rankingItems: RankingItem[];
}

function metricToneClass(tone: "green" | "amber" | "slate") {
  if (tone === "green") return "bg-[#d7f2e3] text-[#067647]";
  if (tone === "amber") return "bg-[#fef3d2] text-[#b67a08]";
  return "bg-[#eef1f5] text-[#667085]";
}

function buildPath(points: AnalyticsSeriesPoint[], width: number, height: number, curve = 0.22) {
  if (points.length === 0) return "";
  const max = Math.max(...points.map((p) => p.value));
  const min = Math.min(...points.map((p) => p.value));
  const range = Math.max(max - min, 1);

  const coords = points.map((point, index) => {
    const x = (index / Math.max(points.length - 1, 1)) * width;
    const y = height - ((point.value - min) / range) * (height - 20) - 10;
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

export function AnalyticsWorkspace({ rankingItems }: AnalyticsWorkspaceProps) {
  const [period, setPeriod] = useState<PeriodKey>("6m");
  const periodOptions: Array<{ key: PeriodKey; label: string }> = [
    { key: "3m", label: "Last 3 months" },
    { key: "6m", label: "Last 6 months" },
    { key: "12m", label: "Last 12 months" },
  ];

  const revenueData = analyticsRevenueSeries[period];
  const revenueLinePath = useMemo(() => buildPath(revenueData, 960, 270), [revenueData]);
  const revenueAreaPath = `${revenueLinePath} L 960 280 L 0 280 Z`;
  const customerPath = useMemo(() => buildPath(analyticsCustomerSeries, 620, 180), []);
  const customerAreaPath = `${customerPath} L 620 200 L 0 200 Z`;

  const donutCircumference = 2 * Math.PI * 70;
  const coffeePercent = analyticsCategoryShare[0].value / 100;
  const coffeeLength = donutCircumference * coffeePercent;

  const exportAnalytics = () => {
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
  };

  const downloadReport = () => {
    const payload = {
      period,
      exportedAt: new Date().toISOString(),
      metrics: analyticsMetrics,
      revenueSeries: revenueData,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `analytics-report-${period}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    window.addEventListener("analytics:export", exportAnalytics);
    window.addEventListener("analytics:download", downloadReport);
    return () => {
      window.removeEventListener("analytics:export", exportAnalytics);
      window.removeEventListener("analytics:download", downloadReport);
    };
  });

  return (
    <div className="space-y-5">
      <section className="dashboard-surface border-[#e7e9ee] p-5 shadow-none md:p-7">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h3 className="dashboard-section-title">Revenue Analytics</h3>
            <p className="mt-1 text-sm text-[#667085]">Monthly revenue trends for the current year</p>
          </div>
          <div className="relative">
            <select
              className="h-10 appearance-none rounded-xl border border-[#e4e7ec] bg-white px-4 pr-9 text-sm text-[#344054]"
              value={period}
              onChange={(event) => setPeriod(event.target.value as PeriodKey)}
            >
              {periodOptions.map((item) => (
                <option key={item.key} value={item.key}>
                  {item.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#98a2b3]" />
          </div>
        </div>

        <div className="h-[300px] w-full">
          <svg className="h-full w-full" viewBox="0 0 960 300" preserveAspectRatio="none">
            <defs>
              <linearGradient id="revenueLayer1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#d4af35" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#d4af35" stopOpacity="0.02" />
              </linearGradient>
              <linearGradient id="revenueLayer2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f2e9cc" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#f2e9cc" stopOpacity="0.08" />
              </linearGradient>
            </defs>

            <line x1="0" y1="72" x2="960" y2="72" stroke="#edf0f5" strokeDasharray="6 6" />
            <line x1="0" y1="132" x2="960" y2="132" stroke="#edf0f5" strokeDasharray="6 6" />
            <line x1="0" y1="192" x2="960" y2="192" stroke="#edf0f5" strokeDasharray="6 6" />

            <path d="M 0 228 C 150 210, 210 240, 360 168 C 500 96, 650 250, 760 212 C 850 182, 900 162, 960 140 L 960 280 L 0 280 Z" fill="url(#revenueLayer2)" />
            <path d={revenueAreaPath} fill="url(#revenueLayer1)" />
            <path d={revenueLinePath} fill="none" stroke="#cca42d" strokeWidth="3.5" strokeLinecap="round" />

            <g fill="#98a2b3" fontSize="13">
              {revenueData.map((item, index) => (
                <text key={item.label} x={(index / Math.max(revenueData.length - 1, 1)) * 940 + 8} y="294">
                  {item.label}
                </text>
              ))}
            </g>
          </svg>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {analyticsMetrics.map((metric) => (
          <article key={metric.label} className="dashboard-surface border-[#e7e9ee] p-4 shadow-none">
            <p className="text-sm text-[#667085]">{metric.label}</p>
            <div className="mt-1 flex items-center justify-between">
              <p className="text-[2rem] font-semibold tracking-tight text-[#101828]">{metric.value}</p>
              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${metricToneClass(metric.tone)}`}>
                {metric.delta}
              </span>
            </div>
          </article>
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1fr_2fr]">
        <article className="dashboard-surface border-[#e7e9ee] p-6 shadow-none">
          <h3 className="dashboard-section-title">Sales by Category</h3>
          <div className="mt-6 flex justify-center">
            <svg width="220" height="220" viewBox="0 0 220 220">
              <circle cx="110" cy="110" r="70" fill="none" stroke="#eef1f5" strokeWidth="14" />
              <circle
                cx="110"
                cy="110"
                r="70"
                fill="none"
                stroke="#d4af35"
                strokeWidth="14"
                strokeLinecap="round"
                strokeDasharray={`${coffeeLength} ${donutCircumference}`}
                transform="rotate(-90 110 110)"
              />
              <circle cx="110" cy="110" r="48" fill="white" />
              <text x="110" y="112" textAnchor="middle" className="fill-[#101828]" style={{ fontSize: 42, fontWeight: 700 }}>
                $12.5
              </text>
              <text x="110" y="136" textAnchor="middle" className="fill-[#98a2b3]" style={{ fontSize: 14 }}>
                Total Sales
              </text>
            </svg>
          </div>
          <div className="mt-2 grid gap-2 text-sm text-[#667085]">
            {analyticsCategoryShare.map((item) => (
              <p key={item.label} className="flex items-center gap-2">
                <span className="inline-block size-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                {item.label} ({item.value}%)
              </p>
            ))}
          </div>
        </article>

        <article className="dashboard-surface border-[#e7e9ee] p-6 shadow-none">
          <h3 className="dashboard-section-title">Product Revenue Ranking</h3>
          <div className="mt-6 space-y-6">
            {rankingItems.map((item, index) => (
              <div key={item.name}>
                <div className="mb-2 flex items-center justify-between text-lg">
                  <span className="font-medium text-[#344054]">{item.name}</span>
                  <span className="font-medium text-[#d4af35]">${item.value.toLocaleString()}</span>
                </div>
                <div className="h-4 rounded-full bg-[#eceff3]">
                  <div className="h-full rounded-full bg-[#d4af35]" style={{ width: `${item.width}%`, opacity: 1 - index * 0.17 }} />
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <article className="dashboard-surface border-[#e7e9ee] p-6 shadow-none">
          <h3 className="dashboard-section-title">Customer Activity</h3>
          <div className="mt-5 h-[220px]">
            <svg className="h-full w-full" viewBox="0 0 620 220" preserveAspectRatio="none">
              <defs>
                <linearGradient id="customerArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#e9ddbe" stopOpacity="0.48" />
                  <stop offset="100%" stopColor="#e9ddbe" stopOpacity="0.07" />
                </linearGradient>
              </defs>
              <line x1="0" y1="56" x2="620" y2="56" stroke="#edf0f5" strokeDasharray="6 6" />
              <line x1="0" y1="108" x2="620" y2="108" stroke="#edf0f5" strokeDasharray="6 6" />
              <line x1="0" y1="160" x2="620" y2="160" stroke="#edf0f5" strokeDasharray="6 6" />
              <path d={customerAreaPath} fill="url(#customerArea)" />
              <path d={customerPath} fill="none" stroke="#cca42d" strokeWidth="3" strokeLinecap="round" />
              <g fill="#98a2b3" fontSize="12">
                {analyticsCustomerSeries.map((item, index) => (
                  <text key={item.label} x={(index / Math.max(analyticsCustomerSeries.length - 1, 1)) * 596 + 12} y="214">
                    {item.label.toUpperCase()}
                  </text>
                ))}
              </g>
            </svg>
          </div>
        </article>

        <article className="dashboard-surface border-[#e7e9ee] p-6 shadow-none">
          <div className="mb-4 flex items-start justify-between">
            <h3 className="dashboard-section-title">Sales Activity Heatmap</h3>
            <div className="text-xs text-[#98a2b3]">
              Low
              <span className="mx-2 inline-flex gap-1 align-middle">
                {[1, 2, 3, 4, 5].map((item) => (
                  <span
                    key={item}
                    className="inline-block h-3 w-3 rounded-sm"
                    style={{ backgroundColor: `rgba(212,175,53,${0.15 + item * 0.15})` }}
                  />
                ))}
              </span>
              High
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {analyticsHeatmap.flat().map((cell, index) => (
              <div
                key={`${cell.day}-${index}`}
                className="aspect-square rounded-sm"
                style={{ backgroundColor: `rgba(212,175,53,${0.12 + cell.value * 0.14})` }}
                title={`${cell.day}: intensity ${cell.value}`}
              />
            ))}
          </div>
          <div className="mt-3 grid grid-cols-7 text-center text-xs text-[#98a2b3]">
            {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
