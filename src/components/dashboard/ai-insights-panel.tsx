"use client";

import { motion } from "framer-motion";
import { BrainCircuit, TrendingUp, TriangleAlert } from "lucide-react";
import { StateMessage } from "@/components/shared/state-message";
import { useGetBusinessAiInsightQuery } from "@/store/api";

function formatMoney(value: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

// AI insights panel turns analytics data into narrative opportunities, risks, and next actions.
export function AiInsightsPanel() {
  const { data, isLoading, isFetching } = useGetBusinessAiInsightQuery({ lookbackDays: 90 });

  if (isLoading) {
    return (
      <section className="dashboard-surface p-6 shadow-none">
        <div className="dashboard-workflow-stack">
          <div className="space-y-3">
            <div className="dashboard-skeleton h-5 w-28 rounded-full" />
            <div className="dashboard-skeleton h-8 w-2/3 rounded-full" />
            <div className="dashboard-skeleton h-4 w-full rounded-full" />
            <div className="dashboard-skeleton h-4 w-4/5 rounded-full" />
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            <div className="dashboard-skeleton h-28 rounded-[calc(var(--radius-panel)-6px)]" />
            <div className="dashboard-skeleton h-28 rounded-[calc(var(--radius-panel)-6px)]" />
            <div className="dashboard-skeleton h-28 rounded-[calc(var(--radius-panel)-6px)]" />
          </div>
        </div>
      </section>
    );
  }

  if (!data) {
    return (
      <section className="dashboard-surface p-6 shadow-none">
        <StateMessage
          tone="info"
          title="AI insights are unavailable"
          message="This panel is temporarily unavailable. Forecasts and recommended actions will return once the latest business snapshot is ready."
        />
      </section>
    );
  }

  const currency = data.snapshot.business?.currency ?? "USD";

  return (
    <motion.section
      className="dashboard-surface p-6 shadow-none"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: "easeOut" }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-[color:var(--surface-subtle)] px-3 py-1 text-xs font-medium text-muted-foreground">
            <BrainCircuit className="size-3.5" />
            Business AI
          </p>
          <h3 className="mt-3 text-xl font-semibold tracking-tight text-foreground">{data.insight.headline}</h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{data.insight.summary}</p>
        </div>
        <div className="dashboard-soft-tile text-right">
          <p className="text-xs font-medium text-muted-foreground">90-day revenue</p>
          <p className="mt-1 text-lg font-semibold text-foreground">
            {formatMoney(data.snapshot.summary.totalRevenue, currency)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {isFetching ? "Refreshing…" : `${data.snapshot.summary.totalSalesCount} sales`}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[1.4fr_1fr_1fr]">
        <article className="dashboard-insight-card">
          <p className="text-sm font-semibold text-foreground">Recommended Actions</p>
          <ul className="dashboard-insight-list">
            {data.insight.recommendedActions.map((item) => (
              <li key={item} className="dashboard-insight-list-item">
                {item}
              </li>
            ))}
          </ul>
        </article>

        <article className="dashboard-insight-card dashboard-insight-card-positive">
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
            <TrendingUp className="size-4 text-emerald-600" />
            Opportunities
          </p>
          <ul className="dashboard-insight-list">
            {data.insight.opportunities.map((item) => (
              <li key={item} className="dashboard-insight-list-item dashboard-insight-list-item-positive">
                {item}
              </li>
            ))}
          </ul>
        </article>

        <article className="dashboard-insight-card dashboard-insight-card-warning">
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
            <TriangleAlert className="size-4 text-amber-600" />
            Risks
          </p>
          <ul className="dashboard-insight-list">
            {data.insight.risks.map((item) => (
              <li key={item} className="dashboard-insight-list-item dashboard-insight-list-item-warning">
                {item}
              </li>
            ))}
          </ul>
        </article>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {data.prediction.forecast.map((forecast) => (
          <article key={forecast.horizonDays} className="dashboard-soft-tile">
            <p className="text-xs font-medium text-muted-foreground">
              {forecast.horizonDays}-day outlook
            </p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
              {formatMoney(forecast.predictedRevenue, currency)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {formatMoney(forecast.lowerBound, currency)} – {formatMoney(forecast.upperBound, currency)}
            </p>
            <p className="mt-3 text-xs text-muted-foreground">
              {forecast.confidence} confidence
            </p>
          </article>
        ))}
      </div>
    </motion.section>
  );
}
