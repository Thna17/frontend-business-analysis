export interface OwnerOverviewQuery {
  range?: "6m" | "12m";
  startDate?: string;
  endDate?: string;
}

export interface OwnerDashboardOverviewResponse {
  kpi: {
    totalRevenue: number;
    salesCount: number;
    avgOrderValue: number;
    growthPercentage: number;
    currentPeriodRevenue: number;
    previousPeriodRevenue: number;
  };
  chart: {
    range: "6m" | "12m";
    series: Array<{
      month: string;
      label: string;
      amount: number;
    }>;
  };
  topProducts: Array<{
    name: string;
    revenue: number;
    quantitySold: number;
    percent: number;
  }>;
}

export interface OwnerAnalyticsDashboardResponse {
  range: "6m" | "12m";
  kpis: {
    revenueGrowth: number;
    averageOrderValue: number;
    customerGrowth: number;
    conversionRate: number;
  };
  revenue: {
    totalRevenue: number;
    series: Array<{
      month: string;
      label: string;
      amount: number;
    }>;
  };
  categoryShare: Array<{
    label: string;
    value: number;
    revenue: number;
    color: string;
  }>;
  topProducts: Array<{
    name: string;
    revenue: number;
    quantitySold: number;
    percent: number;
  }>;
  customerActivity: Array<{
    label: string;
    value: number;
  }>;
  heatmap: Array<Array<{
    day: string;
    value: number;
  }>>;
}
