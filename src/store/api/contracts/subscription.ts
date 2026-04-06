export type SubscriptionPlanKey = "free" | "pro" | "business";
export type BillingCycle = "monthly" | "annual";

// ─── Plan Configuration ───────────────────────────────────────────────────────

export interface PlanLimits {
  seats: number | null;          // null = unlimited
  productsLimit: number | null;
  salesRecordsPerMonth: number | null;
  reportsPerMonth: number | null;
  analyticsQueriesPerMonth: number | null;
  storageGb: number;
  unlimited: boolean;
}

export interface PlanFeature {
  text: string;
  disabled: boolean;
}

export interface SubscriptionPlanConfig {
  id: SubscriptionPlanKey;
  tier: string;
  name: string;
  subtitle: string;
  description: string;
  badge: string;
  highlighted: boolean;
  rank: number;
  monthlyPrice: number;
  annualPrice: number;
  annualSavings: number;
  featureKeys: string[];
  features: PlanFeature[];
  limits: {
    seats: number;              // -1 = unlimited
    productsLimit: number;
    salesRecordsPerMonth: number;
    reportsPerMonth: number;
    analyticsQueriesPerMonth: number;
    storageGb: number;
  };
}

// ─── Current Plan ─────────────────────────────────────────────────────────────

export interface CurrentPlan {
  id: string;
  key: SubscriptionPlanKey;
  name: string;
  status: "active" | "expired" | "canceled";
  billingCycle: BillingCycle;
  monthlyPrice: number;
  annualPrice: number;
  effectivePrice: number;
  nextBillingDate: string | null;
  features: string[];
  featureLabels: string[];
  description: string;
  badge: string;
  highlighted: boolean;
}

// ─── Usage ────────────────────────────────────────────────────────────────────

export interface UsageMetric {
  used: number;
  limit: number | null;
  unlimited: boolean;
}

export interface SubscriptionUsage {
  activeUsers: UsageMetric;
  reportsGenerated: UsageMetric;
  analyticsQueries: UsageMetric;
  storage: {
    usedGb: number;
    limitGb: number;
    unlimited: boolean;
  };
}

// ─── Dashboard Response ───────────────────────────────────────────────────────

export interface SubscriptionDashboardResponse {
  currentPlan: CurrentPlan;
  paymentMethod: {
    provider: string;
    label: string;
    merchantName: string;
    bakongId: string;
    currency: string;
  };
  usage: SubscriptionUsage;
  plans: SubscriptionPlanConfig[];
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

// ─── Mutations ────────────────────────────────────────────────────────────────

export interface ChangeSubscriptionPlanRequest {
  plan: SubscriptionPlanKey;
  billingCycle?: BillingCycle;
}

// ─── Payment Checkout ─────────────────────────────────────────────────────────

export interface CreatePaymentCheckoutRequest {
  plan: Exclude<SubscriptionPlanKey, "free">;
  billingCycle: BillingCycle;
  provider: "bakong";
  currency?: string;
}

export interface PaymentCheckoutResponse {
  transactionId: string;
  provider: string;
  status: "pending" | "succeeded" | "failed";
  amount: number;
  currency: string;
  billingCycle: BillingCycle;
  qrCode: string | null;
  qrMd5: string | null;
  qrExpirationAt: string | null;
  checkoutUrl: string | null;
  externalReference: string | null;
}

export interface CheckBakongPaymentRequest {
  transactionId: string;
}

export interface CheckBakongPaymentResponse {
  id: string;
  status: "pending" | "succeeded" | "failed";
  qrExpirationAt: string | null;
  completedAt: string | null;
  subscriptionPlan: string;
  amount: number;
  currency: string;
}
