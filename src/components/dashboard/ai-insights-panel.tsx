"use client";

import { BrainCircuit, TrendingUp, TriangleAlert } from "lucide-react";
import { useGetBusinessAiInsightQuery } from "@/store/api";

function formatMoney(value: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

export function AiInsightsPanel() {
  const { data, isLoading, isFetching } = useGetBusinessAiInsightQuery({ lookbackDays: 90 });

  if (isLoading) {
    return (
      <section className="dashboard-surface border-[#e7e9ee] p-6 shadow-none">
        <p className="text-sm text-[#667085]">Generating AI insights...</p>
      </section>
    );
  }

  if (!data) {
    return (
      <section className="dashboard-surface border-[#e7e9ee] p-6 shadow-none">
        <p className="text-sm text-[#667085]">AI insights are unavailable right now.</p>
      </section>
    );
  }

  const currency = data.snapshot.business?.currency ?? "USD";

  return (
    <section className="dashboard-surface border-[#e7e9ee] p-6 shadow-none">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-[#f5efe0] px-3 py-1 text-xs font-semibold tracking-[0.08em] text-[#8a6b0b] uppercase">
            <BrainCircuit className="size-3.5" />
            Business AI
          </p>
          <h3 className="mt-3 text-2xl font-semibold text-[#101828]">{data.insight.headline}</h3>
          <p className="mt-2 max-w-3xl text-sm text-[#667085]">{data.insight.summary}</p>
        </div>
        <div className="rounded-2xl border border-[#e4e7ec] bg-[#f8fafc] px-4 py-3 text-right">
          <p className="text-xs uppercase tracking-[0.08em] text-[#98a2b3]">90-day revenue</p>
          <p className="mt-1 text-lg font-semibold text-[#101828]">
            {formatMoney(data.snapshot.summary.totalRevenue, currency)}
          </p>
          <p className="mt-1 text-xs text-[#667085]">
            {isFetching ? "Refreshing..." : `${data.snapshot.summary.totalSalesCount} sales`}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[1.4fr_1fr_1fr]">
        <article className="rounded-3xl border border-[#e4e7ec] bg-white p-5">
          <p className="text-sm font-semibold text-[#344054]">Recommended Actions</p>
          <ul className="mt-3 space-y-3 text-sm text-[#475467]">
            {data.insight.recommendedActions.map((item) => (
              <li key={item} className="rounded-2xl bg-[#f8fafc] px-4 py-3">
                {item}
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-3xl border border-[#e4e7ec] bg-white p-5">
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-[#344054]">
            <TrendingUp className="size-4 text-[#067647]" />
            Opportunities
          </p>
          <ul className="mt-3 space-y-3 text-sm text-[#475467]">
            {data.insight.opportunities.map((item) => (
              <li key={item} className="rounded-2xl bg-[#ecfdf3] px-4 py-3 text-[#067647]">
                {item}
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-3xl border border-[#e4e7ec] bg-white p-5">
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-[#344054]">
            <TriangleAlert className="size-4 text-[#b54708]" />
            Risks
          </p>
          <ul className="mt-3 space-y-3 text-sm text-[#475467]">
            {data.insight.risks.map((item) => (
              <li key={item} className="rounded-2xl bg-[#fffaeb] px-4 py-3 text-[#b54708]">
                {item}
              </li>
            ))}
          </ul>
        </article>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {data.prediction.forecast.map((forecast) => (
          <article key={forecast.horizonDays} className="rounded-3xl border border-[#e4e7ec] bg-[#f8fafc] p-5">
            <p className="text-xs uppercase tracking-[0.08em] text-[#98a2b3]">
              Forecast {forecast.horizonDays} Days
            </p>
            <p className="mt-2 text-2xl font-semibold text-[#101828]">
              {formatMoney(forecast.predictedRevenue, currency)}
            </p>
            <p className="mt-1 text-sm text-[#667085]">
              Range {formatMoney(forecast.lowerBound, currency)} - {formatMoney(forecast.upperBound, currency)}
            </p>
            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#8a6b0b]">
              Confidence {forecast.confidence}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
