"use client";

import { useGetAdminSubscriptionOverviewQuery } from "@/store/api";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import {
  DashboardChartEmptyState,
  DashboardChartFigure,
} from "@/components/dashboard/dashboard-chart-primitives";

type GrowthItem = {
  month: string;
  value: number;
};

export default function GrowthChart() {
  const [range, setRange] = useState<"12m" | "6m" | "3m">("12m");
  const { data: overview, isLoading, isError } = useGetAdminSubscriptionOverviewQuery();

  const fullData: GrowthItem[] = (Array.isArray(overview?.trend) ? overview.trend : []).map(
    (item) => ({
      month: item.month,
      value: Number(item.subscribers || 0),
    }),
  );
  const data = useMemo(() => {
    if (range === "3m") return fullData.slice(-3);
    if (range === "6m") return fullData.slice(-6);
    return fullData.slice(-12);
  }, [fullData, range]);

  const maxValue = Math.max(...data.map((item) => item.value), 1);
  const totalSubscribers = data.reduce((sum, item) => sum + item.value, 0);
  const latestValue = data.at(-1)?.value ?? 0;
  const peakValue = data.reduce((peak, item) => Math.max(peak, item.value), 0);
  const yTicks = useMemo(() => {
    const safeMax = Math.max(maxValue, 1);
    return [safeMax, Math.round(safeMax * 0.66), Math.round(safeMax * 0.33), 0];
  }, [maxValue]);

  const chartHeight = 252;
  const chartWidth = Math.max(data.length * 76, 320);
  const leftPad = 28;
  const rightPad = 18;
  const topPad = 18;
  const bottomPad = 56;
  const plotHeight = chartHeight - topPad - bottomPad;
  const slotWidth = (chartWidth - leftPad - rightPad) / Math.max(data.length, 1);
  const barWidth = Math.min(36, Math.max(18, slotWidth * 0.46));

  return (
    <section className="growth-chart-card">
      <div className="growth-chart-header">
        <div>
          <h2 className="dashboard-section-title">Subscriber Growth Trend</h2>
          <p className="dashboard-subtitle mt-1 text-sm">
            Subscription acquisition across the selected period
          </p>
        </div>

        <div className="chart-range-tabs">
          <button type="button" className={range === "12m" ? "active" : ""} onClick={() => setRange("12m")}>1Y</button>
          <button type="button" className={range === "6m" ? "active" : ""} onClick={() => setRange("6m")}>6M</button>
          <button type="button" className={range === "3m" ? "active" : ""} onClick={() => setRange("3m")}>3M</button>
        </div>
      </div>

      {!isLoading && !isError && data.length > 0 ? (
        <div className="growth-chart-summary">
          <div className="growth-chart-stat">
            <span className="growth-chart-stat-label">Total</span>
            <strong className="growth-chart-stat-value">{totalSubscribers.toLocaleString("en-US")}</strong>
            <span className="growth-chart-stat-copy">period subscribers</span>
          </div>
          <div className="growth-chart-stat">
            <span className="growth-chart-stat-label">Latest</span>
            <strong className="growth-chart-stat-value">{latestValue.toLocaleString("en-US")}</strong>
            <span className="growth-chart-stat-copy">{data.at(-1)?.month ?? "Current month"}</span>
          </div>
          <div className="growth-chart-stat">
            <span className="growth-chart-stat-label">Peak</span>
            <strong className="growth-chart-stat-value">{peakValue.toLocaleString("en-US")}</strong>
            <span className="growth-chart-stat-copy">best month</span>
          </div>
        </div>
      ) : null}

      <DashboardChartFigure
        ariaLabel="Subscriber growth trend chart"
        className="mt-5"
        frameClassName="growth-chart-figure"
        isLoading={isLoading}
        errorTitle="Growth data unavailable"
        errorMessage={isError ? "Subscription trend data could not be loaded. Check admin access and try again." : null}
        emptyState={!isLoading && !isError && data.length === 0 ? (
          <DashboardChartEmptyState
            eyebrow="Subscription trend"
            title="Growth appears after subscription activity starts"
            description="Once paid plans begin converting, this chart will show acquisition momentum across the visible period."
            className="h-full justify-center"
          />
        ) : undefined}
      >
        {!isLoading && !isError && data.length > 0 ? (
          <svg
            className="h-full w-full"
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            preserveAspectRatio="none"
          >
            {yTicks.map((tick, index) => {
              const y = topPad + (plotHeight / (yTicks.length - 1)) * index;

              return (
                <g key={`${tick}-${index}`}>
                  <line
                    x1={leftPad}
                    x2={chartWidth - rightPad}
                    y1={y}
                    y2={y}
                    className={index === yTicks.length - 1 ? "growth-chart-axis-line" : "growth-chart-grid-line"}
                  />
                  <text
                    x={0}
                    y={y + 4}
                    className="growth-chart-y-label"
                  >
                    {tick}
                  </text>
                </g>
              );
            })}

            {data.map((item, index) => {
              const ratio = maxValue > 0 ? item.value / maxValue : 0;
              const barHeight = Math.max(ratio * plotHeight, item.value > 0 ? 8 : 0);
              const xCenter = leftPad + slotWidth * index + slotWidth / 2;
              const xStart = xCenter - barWidth / 2;
              const yStart = topPad + plotHeight - barHeight;
              const isLast = index === data.length - 1;

              return (
                <g key={item.month}>
                  <motion.rect
                    x={xStart}
                    y={yStart}
                    width={barWidth}
                    height={barHeight}
                    rx={barWidth / 2}
                    className={isLast ? "growth-chart-bar growth-chart-bar-active" : "growth-chart-bar"}
                    initial={{ height: 0, y: topPad + plotHeight }}
                    animate={{ height: barHeight, y: yStart }}
                    transition={{ duration: 0.65, ease: "easeOut", delay: index * 0.04 }}
                  >
                    <title>{item.month}: {item.value} subscribers</title>
                  </motion.rect>
                  <text
                    x={xCenter}
                    y={chartHeight - 18}
                    textAnchor="middle"
                    className="growth-chart-x-label"
                  >
                    {item.month}
                  </text>
                </g>
              );
            })}
          </svg>
        ) : null}
      </DashboardChartFigure>
    </section>
  );
}
