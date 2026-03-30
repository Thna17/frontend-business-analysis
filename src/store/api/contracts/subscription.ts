export interface ChangeSubscriptionPlanRequest {
  plan: "free" | "pro" | "business";
}

export interface SubscriptionDashboardResponse {
  currentPlan: {
    id: string;
    key: "free" | "pro" | "business";
    name: string;
    status: "active" | "expired" | "canceled";
    monthlyPrice: number;
    nextBillingDate: string | null;
    features: string[];
    description: string;
  };
  paymentMethod: {
    provider: string;
    label: string;
    merchantName: string;
    bakongId: string;
    currency: string;
  };
  usage: {
    activeUsers: { used: number; limit: number };
    reportsGenerated: { used: number; limit: number };
    analyticsQueries: { used: number; limit: number };
    storage: { usedGb: number; limitGb: number };
  };
  plans: Array<{
    id: "free" | "pro" | "business";
    tier: string;
    name: string;
    subtitle: string;
    monthlyPrice: number;
    features: string[];
  }>;
  notifications: {
    email: boolean;
  };
  billingHistory: Array<{
    id: string;
    plan: string;
    amount: number;
    currency: string;
    status: "pending" | "succeeded" | "failed";
    date: string | null;
    provider: string;
  }>;
}
