import { motion } from "framer-motion";
import { ChevronDown, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dashboardChartPalette } from "@/components/dashboard/chart-tokens";
import {
  DashboardChartEmptyState,
  DashboardChartFigure,
  DashboardChartLegend,
  DashboardChartRail,
  DashboardChartStat,
} from "@/components/dashboard/dashboard-chart-primitives";

export type MonthlyRevenuePoint = {
  label: string;
  value: number;
};

interface RevenueAnalyticsCardProps {
  monthlyData?: MonthlyRevenuePoint[];
  points?: Array<{
    label: string;
    amount: number;
  }>;
  range?: "6m" | "12m";
  onRangeChange?: (next: "6m" | "12m") => void;
  isLoading?: boolean;
}

export function RevenueAnalyticsCard({
  monthlyData,
  points,
  range = "6m",
  onRangeChange,
  isLoading = false,
}: RevenueAnalyticsCardProps) {
  const chartWidth = 1000;
  const chartHeight = 350;
  const leftPadding = 20;
  const rightPadding = 20;
  const topPadding = 20;
  const bottomPadding = 32;

  const normalizedData: MonthlyRevenuePoint[] =
    points?.map((item) => ({ label: item.label, value: item.amount })) ??
    monthlyData ??
    [];

  const safeData =
    normalizedData.length > 0
      ? normalizedData
      : [
          { label: "Jan", value: 0 },
          { label: "Feb", value: 0 },
          { label: "Mar", value: 0 },
          { label: "Apr", value: 0 },
          { label: "May", value: 0 },
          { label: "Jun", value: 0 },
        ];
  const hasData = normalizedData.length > 0;

  const maxValue = Math.max(...safeData.map((item) => item.value), 1);
  const latestPoint = safeData[safeData.length - 1];
  const previousPoint = safeData[safeData.length - 2];
  const delta = latestPoint && previousPoint ? latestPoint.value - previousPoint.value : 0;

  const usableWidth = chartWidth - leftPadding - rightPadding;
  const usableHeight = chartHeight - topPadding - bottomPadding;

  const chartPoints = safeData.map((item, index) => {
    const x =
      leftPadding +
      (safeData.length === 1
        ? usableWidth / 2
        : (index / (safeData.length - 1)) * usableWidth);

    const y =
      topPadding + usableHeight - (item.value / maxValue) * usableHeight;

    return { x, y, label: item.label, value: item.value };
  });

  const linePath = chartPoints
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  const areaPath =
    chartPoints.length > 0
      ? `${linePath} L ${chartPoints[chartPoints.length - 1].x} ${
          chartHeight - bottomPadding
        } L ${chartPoints[0].x} ${chartHeight - bottomPadding} Z`
      : "";

  const gridLines = [0.25, 0.5, 0.75].map((ratio) => {
    const y = topPadding + usableHeight * ratio;
    return y;
  });

  return (
    <Card className="dashboard-surface dashboard-surface-hover shadow-none">
      <CardHeader className="flex flex-row items-start justify-between px-7 pb-0 pt-7">
        <div>
          <CardTitle className="dashboard-section-title">
            Revenue Analytics
          </CardTitle>
          <p className="mt-1 text-[15px] text-muted-foreground">
            Monthly revenue trends for the {range === "12m" ? "last 12 months" : "last 6 months"}
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/70 px-3 py-1.5 text-xs font-semibold text-foreground">
            <span className={delta >= 0 ? "text-emerald-600" : "text-rose-600"}>
              {delta >= 0 ? "+" : "-"}${Math.abs(delta).toLocaleString()}
            </span>
            vs previous period point
          </div>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-1 rounded-xl border border-border bg-background/70 px-4 py-2 text-[15px] text-foreground"
          onClick={() => {
            if (!onRangeChange || isLoading) return;
            onRangeChange(range === "6m" ? "12m" : "6m");
          }}
          disabled={isLoading}
        >
          {range === "12m" ? "Last 12 months" : "Last 6 months"}
          <ChevronDown className="size-4" />
        </button>
      </CardHeader>

      <CardContent className="px-6 pb-7">
        <div className="dashboard-chart-shell mt-7">
          <DashboardChartFigure
            ariaLabel="Revenue trend line chart"
            frameClassName="min-h-[350px]"
            isLoading={isLoading}
            loadingHeightClassName="h-[350px]"
            emptyState={!hasData ? (
              <DashboardChartEmptyState
              eyebrow="Revenue signal"
              icon={<TrendingUp className="size-5" />}
              title="Revenue trend appears once sales accumulate"
              description="Add more tracked sales and this chart will surface momentum, peaks, and a steadier monthly baseline."
              className="h-[350px]"
            />
            ) : undefined}
            legend={(
              <DashboardChartLegend
                items={[
                  { label: "Revenue line", dotClassName: "bg-primary" },
                  { label: "Trend field", dotClassName: "bg-[color:var(--surface-contrast)]" },
                ]}
              />
            )}
          >
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="h-full w-full" role="img" aria-label="Revenue trend line chart">
            <defs>
              <linearGradient id="rev-gradient-dynamic" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={dashboardChartPalette.primary} stopOpacity="0.22" />
                <stop offset="100%" stopColor={dashboardChartPalette.primary} stopOpacity="0.03" />
              </linearGradient>
            </defs>

            {gridLines.map((y, index) => (
              <line
                key={index}
                x1={leftPadding}
                y1={y}
                x2={chartWidth - rightPadding}
                y2={y}
                className="dashboard-chart-grid-line"
              />
            ))}

            {areaPath ? (
              <path d={areaPath} fill="url(#rev-gradient-dynamic)" />
            ) : null}

            {linePath ? (
              <motion.path
                d={linePath}
                fill="none"
                className="dashboard-chart-line-primary"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
            ) : null}

            {chartPoints.map((point, index) => (
              <motion.circle
                key={index}
                cx={point.x}
                cy={point.y}
                r="5"
                className="dashboard-chart-point"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.24, delay: index * 0.04, ease: "easeOut" }}
              />
            ))}

            <g className="dashboard-chart-axis-label">
              {chartPoints.map((point, index) => (
                <text
                  key={index}
                  x={point.x}
                  y={chartHeight - 10}
                  textAnchor="middle"
                >
                  {point.label}
                </text>
              ))}
            </g>
          </svg>
          </DashboardChartFigure>
          <DashboardChartRail>
          <DashboardChartStat
            label="Latest"
            value={`$${latestPoint?.value.toLocaleString() ?? "0"}`}
            copy={latestPoint?.label ?? "Current period"}
          />
          <DashboardChartStat
            label="Peak"
            value={`$${Math.max(...safeData.map((item) => item.value)).toLocaleString()}`}
            copy="Highest point in the selected range"
          />
          <DashboardChartStat
            label="Average"
            value={`$${Math.round(safeData.reduce((sum, item) => sum + item.value, 0) / safeData.length).toLocaleString()}`}
            copy="Smoothed monthly baseline"
          />
          </DashboardChartRail>
        </div>
      </CardContent>
    </Card>
  );
}
