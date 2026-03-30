import { ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface RevenuePoint {
  label: string;
  amount: number;
}

interface RevenueAnalyticsCardProps {
  points: RevenuePoint[];
  range: "6m" | "12m";
  onRangeChange: (range: "6m" | "12m") => void;
  isLoading?: boolean;
}

function buildLinePath(points: RevenuePoint[]): string {
  if (points.length === 0) return "";

  const maxValue = Math.max(...points.map((point) => point.amount), 1);
  const minValue = Math.min(...points.map((point) => point.amount), 0);
  const height = 250;
  const width = 932;

  const getX = (index: number) => (index / Math.max(points.length - 1, 1)) * width;
  const getY = (value: number) => {
    const ratio = (value - minValue) / Math.max(maxValue - minValue, 1);
    return 20 + (1 - ratio) * (height - 40);
  };

  return points
    .map((point, index) => `${index === 0 ? "M" : "L"}${getX(index)},${getY(point.amount)}`)
    .join(" ");
}

function buildAreaPath(linePath: string): string {
  if (!linePath) return "";
  return `${linePath} L932,318 L0,318 Z`;
}

export function RevenueAnalyticsCard({
  points,
  range,
  onRangeChange,
  isLoading = false,
}: RevenueAnalyticsCardProps) {
  const linePath = buildLinePath(points);
  const areaPath = buildAreaPath(linePath);

  return (
    <Card className="dashboard-surface border-[#e7e9ee] shadow-none">
      <CardHeader className="flex flex-row items-start justify-between px-7 pt-7 pb-0">
        <div>
          <CardTitle className="dashboard-section-title">
            Revenue Analytics
          </CardTitle>
          <p className="mt-1 text-[15px] text-[#667085]">Monthly revenue trends for the current year</p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-xl border border-[#eaecf0] bg-[#f7f8fa] p-1">
          <button
            type="button"
            onClick={() => onRangeChange("6m")}
            className={cn(
              "rounded-lg px-3 py-1.5 text-sm font-medium",
              range === "6m" ? "bg-white text-[#101828] shadow-sm" : "text-[#667085]",
            )}
          >
            Last 6 months
          </button>
          <button
            type="button"
            onClick={() => onRangeChange("12m")}
            className={cn(
              "rounded-lg px-3 py-1.5 text-sm font-medium",
              range === "12m" ? "bg-white text-[#101828] shadow-sm" : "text-[#667085]",
            )}
          >
            Last 12 months
          </button>
          <ChevronDown className="size-4 text-[#98a2b3]" />
        </div>
      </CardHeader>

      <CardContent className="px-6 pb-7">
        <div className="mt-7 h-[350px]">
          <svg viewBox="0 0 1000 350" className="h-full w-full">
            <defs>
              <linearGradient id="rev-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#d4af35" stopOpacity="0.20" />
                <stop offset="100%" stopColor="#d4af35" stopOpacity="0.02" />
              </linearGradient>
            </defs>

            <line x1="0" y1="82" x2="1000" y2="82" stroke="#edf0f5" strokeDasharray="6 6" />
            <line x1="0" y1="162" x2="1000" y2="162" stroke="#edf0f5" strokeDasharray="6 6" />
            <line x1="0" y1="242" x2="1000" y2="242" stroke="#edf0f5" strokeDasharray="6 6" />

            {areaPath ? <path d={areaPath} fill="url(#rev-gradient)" /> : null}
            {linePath ? (
              <path
                d={linePath}
                fill="none"
                stroke="#cba52b"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : null}

            <g fill="#98a2b3" fontSize="16">
              {points.map((point, index) => {
                const x = 12 + (index / Math.max(points.length - 1, 1)) * 920;
                return (
                  <text key={`${point.label}-${index}`} x={x} y="340">
                    {point.label}
                  </text>
                );
              })}
            </g>
          </svg>

          {isLoading ? (
            <p className="mt-2 text-sm text-[#98a2b3]">Loading chart...</p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
