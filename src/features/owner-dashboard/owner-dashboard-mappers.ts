import type { MetricItem, RankingItem, SalesTransaction } from "@/features/owner-dashboard/dashboard-mock";
import type {
  OwnerDashboardOverviewResponse,
  SalesListItem,
} from "@/store/api";

export function formatCurrency(value: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: value >= 1000 ? 0 : 2,
  }).format(value);
}

export function formatPercent(value: number): string {
  const rounded = Number.isFinite(value) ? value : 0;
  const sign = rounded > 0 ? "+" : "";
  return `${sign}${rounded.toFixed(1)}%`;
}

export function formatDateLabel(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

export function mapOverviewToMetrics(
  overview: OwnerDashboardOverviewResponse,
  currency = "USD",
): MetricItem[] {
  const growthDirection = overview.kpi.growthPercentage >= 0 ? "up" : "down";

  return [
    {
      title: "Total Revenue",
      value: formatCurrency(overview.kpi.totalRevenue, currency),
      change: formatPercent(overview.kpi.growthPercentage),
      changeDirection: growthDirection,
      compareLabel: "vs previous month",
      icon: "revenue",
    },
    {
      title: "Total Sales",
      value: overview.kpi.salesCount.toLocaleString("en-US"),
      change: "",
      changeDirection: "up",
      compareLabel: "transactions in selected range",
      icon: "users",
    },
    {
      title: "Avg Order Value",
      value: formatCurrency(overview.kpi.avgOrderValue, currency),
      change: "",
      changeDirection: "up",
      compareLabel: "average per transaction",
      icon: "aov",
    },
    {
      title: "Current Period",
      value: formatCurrency(overview.kpi.currentPeriodRevenue, currency),
      change: formatPercent(overview.kpi.growthPercentage),
      changeDirection: growthDirection,
      compareLabel: `vs ${formatCurrency(overview.kpi.previousPeriodRevenue, currency)}`,
      icon: "today",
    },
  ];
}

export function mapOverviewToRanking(
  overview: OwnerDashboardOverviewResponse,
): RankingItem[] {
  return overview.topProducts.map((item) => ({
    name: item.name,
    value: item.revenue,
    width: Math.max(8, Math.min(100, item.percent)),
  }));
}

const defaultAvatar =
  "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?auto=format&fit=crop&w=64&q=60";

export function mapSalesToTransactions(rows: SalesListItem[], currency = "USD"): SalesTransaction[] {
  return rows.map((row) => ({
    id: row.id,
    customer: row.productName,
    avatar: defaultAvatar,
    product: row.productName,
    category: row.category,
    total: formatCurrency(row.price * row.quantity, currency),
    date: formatDateLabel(row.soldAt),
    status: "Completed",
  }));
}
