import { ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

  const maxValue = Math.max(...safeData.map((item) => item.value), 1);

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
    <Card className="dashboard-surface shadow-none">
      <CardHeader className="flex flex-row items-start justify-between px-7 pb-0 pt-7">
        <div>
          <CardTitle className="dashboard-section-title">
            Revenue Analytics
          </CardTitle>
          <p className="mt-1 text-[15px] text-muted-foreground">
            Monthly revenue trends for the last 6 months
          </p>
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
        <div className="mt-7 h-[350px]">
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="h-full w-full">
            <defs>
              <linearGradient id="rev-gradient-dynamic" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#d4af35" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#d4af35" stopOpacity="0.03" />
              </linearGradient>
            </defs>

            {gridLines.map((y, index) => (
              <line
                key={index}
                x1={leftPadding}
                y1={y}
                x2={chartWidth - rightPadding}
                y2={y}
                stroke="rgba(255,255,255,0.35)"
                strokeDasharray="6 6"
              />
            ))}

            {areaPath ? (
              <path d={areaPath} fill="url(#rev-gradient-dynamic)" />
            ) : null}

            {linePath ? (
              <path
                d={linePath}
                fill="none"
                stroke="var(--primary)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : null}

            {chartPoints.map((point, index) => (
              <circle
                key={index}
                cx={point.x}
                cy={point.y}
                r="5"
                fill="var(--primary)"
              />
            ))}

            <g fill="currentColor" className="text-foreground" fontSize="18">
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
        </div>
      </CardContent>
    </Card>
  );
}
