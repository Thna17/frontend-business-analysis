export interface BusinessAiInsightQuery {
  businessId?: string;
  lookbackDays?: number;
  focus?: string;
}

export interface BusinessAiInsightResponse {
  period: {
    startDate: string;
    endDate: string;
    lookbackDays: number;
  };
  snapshot: {
    subscription: {
      plan: string;
      status: string;
      expiresAt: string | null;
    } | null;
    business: {
      name: string;
      category: string;
      currency: string;
      description: string | null;
    } | null;
    summary: {
      totalRevenue: number;
      totalSalesCount: number;
      totalUnitsSold: number;
      averageOrderValue: number;
    };
    growth: {
      recent7DayRevenue: number;
      previous7DayRevenue: number;
      growthPercentage: number;
    };
    topProducts: Array<{
      productName: string;
      revenue: number;
      salesCount: number;
      unitsSold: number;
    }>;
  };
  insight: {
    headline: string;
    summary: string;
    opportunities: string[];
    risks: string[];
    recommendedActions: string[];
  };
  prediction: {
    source: string;
    model: string | null;
    generatedAt: string;
    forecast: Array<{
      horizonDays: 7 | 30 | 90;
      predictedRevenue: number;
      lowerBound: number;
      upperBound: number;
      confidence: "low" | "medium" | "high";
    }>;
    anomalies: Array<{
      level: "low" | "medium" | "high";
      message: string;
      metric: "revenue" | "sales" | "aov";
      direction: "up" | "down";
    }>;
    unavailableReason: string | null;
  };
  meta: {
    insightSource: string;
    insightUnavailableReason: string | null;
    predictionSource: string;
    predictionUnavailableReason: string | null;
  };
}
