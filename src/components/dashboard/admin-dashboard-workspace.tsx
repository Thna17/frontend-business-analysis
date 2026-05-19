"use client";

import { useMemo, useState } from "react";
import { Activity, ChevronRight, Trash2 } from "lucide-react";
import { DashboardPanel } from "@/components/dashboard/dashboard-panel";
import { DashboardChartFigure, DashboardChartRail, DashboardChartStat } from "@/components/dashboard/dashboard-chart-primitives";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { PageSummaryStrip } from "@/components/shared/page-summary-strip";
import { StateMessage } from "@/components/shared/state-message";
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

// Admin dashboard workspace summarizes platform health, growth, and recent user activity.
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
      <PageSummaryStrip
        eyebrow="Platform Command"
        title="Admin operating overview"
        description="Use this page to watch platform momentum, keep an eye on account activity, and quickly jump on anything that needs admin attention."
        items={[
          {
            label: "Platform Health",
            value: `${data?.platformHealth.value ?? 0}%`,
            helper: "Real-time infrastructure readiness",
          },
          {
            label: "Directory",
            value: `${users.length}`,
            helper: "Visible user profiles in the active list",
          },
          {
            label: "Audit Events",
            value: `${data?.auditLogs.length ?? 0}`,
            helper: "Recent logs available for review",
          },
        ]}
      />

      {isError ? (
        <StateMessage
          tone="danger"
          title="Unable to load admin dashboard"
          message="Admin metrics could not be loaded. Verify the admin session and try refreshing the page."
        />
      ) : null}

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => (
            <div key={`admin-metric-skeleton-${index}`} className="dashboard-kpi-card">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="mt-7 h-10 w-36" />
              <Skeleton className="mt-4 h-4 w-24" />
            </div>
          ))
          : (data?.dashboardMetrics ?? []).map((item) => <KpiCard key={item.title} item={item} />)}
      </section>

      <section className="grid gap-5 xl:grid-cols-[2fr_1fr]">
        <DashboardPanel
          title="Growth Projection"
          description="Platform scaling performance over the last 6 months."
          action={<span className="dashboard-eyebrow">Live dashboard data</span>}
          className="shadow-none"
          bodyClassName="pt-5"
        >
          <div className="dashboard-chart-shell">
          <DashboardChartFigure ariaLabel="Platform growth projection chart" frameClassName="h-[250px]">
            <svg viewBox="0 0 760 250" className="h-full w-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="admin-growth-area" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.24" />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.02" />
                </linearGradient>
              </defs>
              <line x1="0" y1="56" x2="760" y2="56" stroke="var(--chart-grid)" strokeDasharray="6 6" />
              <line x1="0" y1="116" x2="760" y2="116" stroke="var(--chart-grid)" strokeDasharray="6 6" />
              <line x1="0" y1="176" x2="760" y2="176" stroke="var(--chart-grid)" strokeDasharray="6 6" />

              {growthPath ? <path d={growthAreaPath} fill="url(#admin-growth-area)" /> : null}
              {growthPath ? <path d={growthPath} fill="none" stroke="var(--primary)" strokeWidth="3.5" strokeLinecap="round" /> : null}

              <g fill="var(--muted-foreground)" fontSize="12">
                {(data?.growthProjection ?? []).map((item, index) => (
                  <text key={item.month} x={(index / Math.max((data?.growthProjection?.length ?? 1) - 1, 1)) * 730 + 10} y="242">
                    {item.month.toUpperCase()}
                  </text>
                ))}
              </g>
            </svg>
          </DashboardChartFigure>
          <DashboardChartRail>
            <DashboardChartStat label="Directory" value={users.length} copy="Profiles visible in the active list." />
            <DashboardChartStat label="Audit events" value={data?.auditLogs.length ?? 0} copy="Recent logs ready for review." />
            <DashboardChartStat label="Health" value={`${data?.platformHealth.value ?? 0}%`} copy="Current infrastructure readiness." />
          </DashboardChartRail>
          </div>
        </DashboardPanel>

        <DashboardPanel
          title="User Directory"
          description="A quick operational slice of the current active user list."
          className="shadow-none"
          bodyClassName="pt-5"
        >
          <div className="mt-4 space-y-3">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between rounded-[calc(var(--radius-panel)-6px)] border border-border bg-card/88 px-3 py-3 shadow-[var(--shadow-control)]">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-secondary-foreground" style={{ backgroundColor: user.color }}>
                    {user.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.tier}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`inline-block h-2.5 w-2.5 rounded-full ${user.status === "online" ? "bg-amber-700" : "bg-primary"}`} />
                  <button type="button" className="dashboard-icon-button dashboard-icon-button-danger" onClick={() => setDismissedUserIds((prev) => [...prev, user.id])}>
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <Button variant="outline" className="mt-4 h-11 w-full rounded-xl text-sm" onClick={() => setDismissedUserIds([])}>
            View All Users
          </Button>
        </DashboardPanel>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1fr_1fr]">
        <DashboardPanel
          title="Deep Audit Logs"
          description="Review low-level system events and security access logs filtered by your current regional permissions."
          className="shadow-none"
          bodyClassName="pt-5"
        >
          <div className="mt-4 space-y-2">
            {(data?.auditLogs ?? []).map((log) => (
              <div key={log.id} className="flex items-center justify-between rounded-[calc(var(--radius-panel)-8px)] border border-border bg-card/88 px-3 py-3">
                <span className="text-sm text-secondary-foreground">{log.title}</span>
                <span className="text-xs text-muted-foreground">{new Date(log.timeAgo).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </DashboardPanel>

        <article className="relative overflow-hidden rounded-[calc(var(--radius-panel)+2px)] border border-white/10 bg-[linear-gradient(120deg,#101827_0%,#111c2f_48%,#162640_100%)] p-6 shadow-[0_14px_34px_rgba(15,23,42,0.24)]">
          <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full border-[18px] border-primary/20" />
          <h3 className="font-heading text-4xl font-semibold tracking-[-0.04em] text-white">Platform Health</h3>
          <p className="mt-2 text-base text-white/75">Real-time infrastructure status across availability zones.</p>

          <div className="mt-8">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm text-white/80">System uptime</span>
              <span className="text-2xl font-semibold text-white">{data?.platformHealth.value ?? 0}%</span>
            </div>
            <div className="h-3 rounded-full bg-white/15">
              <div className="h-full rounded-full bg-primary" style={{ width: `${data?.platformHealth.value ?? 0}%` }} />
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
