"use client";

import { useMemo, useState } from "react";
import { Activity, ChevronRight, Trash2 } from "lucide-react";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAdminDashboardQuery } from "@/store/api";

function buildPath(values: number[], width: number, height: number) {
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = Math.max(max - min, 1);

  const points = values.map((value, idx) => {
    const x = (idx / Math.max(values.length - 1, 1)) * width;
    const y = height - ((value - min) / range) * (height - 25) - 10;
    return { x, y };
  });

  if (points.length === 0) return "";
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i += 1) {
    const p = points[i - 1];
    const c = points[i];
    const c1x = p.x + (c.x - p.x) * 0.26;
    const c2x = c.x - (c.x - p.x) * 0.26;
    d += ` C ${c1x} ${p.y}, ${c2x} ${c.y}, ${c.x} ${c.y}`;
  }
  return d;
}

export function AdminDashboardWorkspace() {
  const [dismissedUserIds, setDismissedUserIds] = useState<string[]>([]);
  const { data, isLoading, isFetching, isError, refetch } = useGetAdminDashboardQuery();

  const users = useMemo(
    () => (data?.userDirectory ?? []).filter((user) => !dismissedUserIds.includes(user.id)),
    [data?.userDirectory, dismissedUserIds],
  );

  const growthValues = (data?.growthProjection ?? []).map((item) => item.value);
  const growthPath = useMemo(() => buildPath(growthValues, 760, 220), [growthValues]);
  const growthAreaPath = `${growthPath} L 760 230 L 0 230 Z`;

  return (
    <div className="space-y-6">
      <section>
        <h1 className="dashboard-title">Welcome in, Admin!</h1>
        <p className="dashboard-subtitle mt-2">Here&apos;s what&apos;s happening across your platform today.</p>
      </section>

      {isError ? (
        <section className="dashboard-surface border border-[#f4caca] bg-[#fff4f4] p-4 text-sm text-[#b42318]">
          Unable to load admin dashboard data. Please make sure you are logged in as admin.
        </section>
      ) : null}

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => (
            <div key={`admin-metric-skeleton-${index}`} className="dashboard-kpi-card border-[#e7e9ee]">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="mt-7 h-10 w-36" />
              <Skeleton className="mt-4 h-4 w-24" />
            </div>
          ))
          : (data?.dashboardMetrics ?? []).map((item) => <KpiCard key={item.title} item={item} />)}
      </section>

      <section className="grid gap-5 xl:grid-cols-[2fr_1fr]">
        <article className="dashboard-surface border-[#e7e9ee] p-6 shadow-none">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h3 className="dashboard-section-title">Growth Projection</h3>
              <p className="mt-1 text-sm text-[#667085]">Platform scaling performance (last 6 months)</p>
            </div>
            <span className="rounded-full border border-[#ead9a2] bg-[#fffaf0] px-3 py-1 text-xs font-semibold text-[#8a6b0b]">
              Live dashboard data
            </span>
          </div>

          <div className="h-[250px]">
            <svg viewBox="0 0 760 250" className="h-full w-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="admin-growth-area" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#d4af35" stopOpacity="0.24" />
                  <stop offset="100%" stopColor="#d4af35" stopOpacity="0.02" />
                </linearGradient>
              </defs>
              <line x1="0" y1="56" x2="760" y2="56" stroke="#edf0f5" strokeDasharray="6 6" />
              <line x1="0" y1="116" x2="760" y2="116" stroke="#edf0f5" strokeDasharray="6 6" />
              <line x1="0" y1="176" x2="760" y2="176" stroke="#edf0f5" strokeDasharray="6 6" />

              {growthPath ? <path d={growthAreaPath} fill="url(#admin-growth-area)" /> : null}
              {growthPath ? <path d={growthPath} fill="none" stroke="#cca42d" strokeWidth="3.5" strokeLinecap="round" /> : null}

              <g fill="#98a2b3" fontSize="12">
                {(data?.growthProjection ?? []).map((item, index) => (
                  <text key={item.month} x={(index / Math.max((data?.growthProjection?.length ?? 1) - 1, 1)) * 730 + 10} y="242">
                    {item.month.toUpperCase()}
                  </text>
                ))}
              </g>
            </svg>
          </div>
        </article>

        <article className="dashboard-surface border-[#e7e9ee] p-6 shadow-none">
          <h3 className="dashboard-section-title">User Directory</h3>
          <div className="mt-4 space-y-3">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between rounded-xl border border-[#e4e7ec] bg-white px-3 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-[#344054]" style={{ backgroundColor: user.color }}>
                    {user.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#101828]">{user.name}</p>
                    <p className="text-xs text-[#667085]">{user.tier}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`inline-block h-2.5 w-2.5 rounded-full ${user.status === "online" ? "bg-[#a16207]" : "bg-[#d4af37]"}`} />
                  <button type="button" onClick={() => setDismissedUserIds((prev) => [...prev, user.id])}>
                    <Trash2 className="size-4 text-[#98a2b3]" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <Button variant="outline" className="mt-4 h-11 w-full rounded-xl text-sm" onClick={() => setDismissedUserIds([])}>
            View All Users
          </Button>
        </article>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1fr_1fr]">
        <article className="dashboard-surface border-[#e7e9ee] p-6 shadow-none">
          <h3 className="dashboard-section-title">Deep Audit Logs</h3>
          <p className="mt-2 text-sm text-[#667085]">
            Review low-level system events and security access logs filtered by your current regional permissions.
          </p>
          <div className="mt-4 space-y-2">
            {(data?.auditLogs ?? []).map((log) => (
              <div key={log.id} className="flex items-center justify-between rounded-lg border border-[#eef1f4] bg-white px-3 py-3">
                <span className="text-sm text-[#1f2937]">{log.title}</span>
                <span className="text-xs text-[#98a2b3]">{new Date(log.timeAgo).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0f172a] via-[#101927] to-[#111827] p-6 shadow-[0_10px_30px_rgba(15,23,42,0.22)]">
          <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full border-[18px] border-[#d4af35]/20" />
          <h3 className="text-4xl font-semibold text-white">Platform Health</h3>
          <p className="mt-2 text-base text-white/75">Real-time infrastructure status across availability zones.</p>

          <div className="mt-8">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm text-white/80">System uptime</span>
              <span className="text-2xl font-semibold text-white">{data?.platformHealth.value ?? 0}%</span>
            </div>
            <div className="h-3 rounded-full bg-white/15">
              <div className="h-full rounded-full bg-[#d4af35]" style={{ width: `${data?.platformHealth.value ?? 0}%` }} />
            </div>
          </div>

          <Button className="mt-5 h-10 rounded-full bg-white/10 px-4 text-sm text-white hover:bg-white/20" onClick={() => void refetch()}>
            <Activity className="size-4" />
            {isFetching ? "Refreshing" : "Refresh Health"}
            <ChevronRight className="size-4" />
          </Button>
        </article>
      </section>
    </div>
  );
}