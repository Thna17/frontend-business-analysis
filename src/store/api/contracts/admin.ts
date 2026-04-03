export interface AdminMetricCard {
  title: string;
  value: string;
  change: string;
  changeDirection: "up" | "down";
  compareLabel: string;
  icon:
    | "revenue"
    | "users"
    | "churn"
    | "aov"
    | "today"
    | "product"
    | "star"
    | "alert"
    | "calendar"
    | "business";
}

export interface AdminDashboardResponse {
  dashboardMetrics: AdminMetricCard[];
  growthProjection: Array<{
    month: string;
    value: number;
  }>;
  userDirectory: Array<{
    id: string;
    name: string;
    tier: string;
    initials: string;
    color: string;
    status: "online" | "idle";
  }>;
  auditLogs: Array<{
    id: string;
    title: string;
    timeAgo: string;
  }>;
  platformHealth: {
    value: number;
    activeSubscriptions: number;
    pendingSubscriptions: number;
    cancelledSubscriptions: number;
  };
  adminName: string;
}

export interface AdminAnalyticsResponse {
  stats: {
    annualRevenue: number;
    monthlyRevenue: number;
    totalSubscribers: number;
    churnRate: number;
  };
  plans: {
    Free: number;
    Plus: number;
    Pro: number;
  };
  revenueByMonth: Array<{
    month: string;
    revenue: number;
  }>;
  recentActivities: Array<{
    id: string;
    title: string;
    description: string;
    date: string;
  }>;
}

export interface AdminSubscriptionOverviewResponse {
  summary: {
    totalSubscribers: number;
    activeSubscribers: number;
    pendingSubscribers: number;
    canceledSubscribers: number;
    activeRate: number;
    churnRate: number;
    totalRevenue: number;
    monthlyRevenue: number;
  };
  trend: Array<{
    month: string;
    subscribers: number;
    revenue: number;
  }>;
  planBreakdown: Array<{
    id: "free" | "pro" | "business";
    name: string;
    totalSubscribers: number;
    activeSubscribers: number;
    marketSharePercent: number;
  }>;
  recentBillingEvents: Array<{
    id: string;
    subscriberName: string;
    subscriberEmail: string;
    plan: "free" | "pro" | "business";
    amount: number;
    status: "pending" | "succeeded" | "failed";
    createdAt: string;
  }>;
}

export interface AdminSubscriptionPlanConfig {
  id: string;
  planKey: string;
  name: string;
  subtitle: string;
  price: string;
  suffix: string;
  badge: string;
  highlighted: boolean;
  rank: number;
  features: Array<{
    text: string;
    disabled: boolean;
  }>;
  createdAt: string | null;
  updatedAt: string | null;
}

export type AdminSubscriptionPlanConfigListResponse = AdminSubscriptionPlanConfig[];

export interface UpsertAdminSubscriptionPlanConfigInput {
  name: string;
  subtitle: string;
  price: string;
  suffix: string;
  badge: string;
  highlighted: boolean;
  features: Array<{
    text: string;
    disabled: boolean;
  }>;
}

export interface AdminPaymentListItem {
  id: string;
  userId: string;
  userEmail: string | null;
  userFullName: string | null;
  subscriptionPlan: string;
  provider: string;
  status: string;
  amount: number;
  currency: string;
  externalReference: string | null;
  checkoutUrl: string | null;
  qrCode: string | null;
  completedAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface AdminPaymentsListResponse {
  items: AdminPaymentListItem[];
  meta: {
    count: number;
    total: number;
    page: number;
    limit: number;
    hasNextPage: boolean;
    pendingCount: number;
    succeededCount: number;
    failedCount: number;
    bakongCount: number;
    succeededUsdAmount: number;
  };
}

export interface AdminSubscriptionListItem {
  id: string;
  userId: string;
  userEmail: string | null;
  userFullName: string | null;
  userRole: string | null;
  plan: string;
  status: string;
  expiresAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface AdminSubscriptionsListResponse {
  items: AdminSubscriptionListItem[];
  meta: {
    count: number;
    total: number;
    page: number;
    limit: number;
    hasNextPage: boolean;
    activeCount: number;
  };
}

export type AdminRoleAccess = "full" | "limited" | "tickets";

export interface AdminSettingsResponse {
  branding: {
    brandName: string;
    accentColor: string;
  };
  security: {
    mfaEnforced: boolean;
  };
  operations: {
    maintenanceMode: boolean;
  };
  health: {
    apiServices: string;
    mainDatabase: string;
    serverLoad: string;
  };
  roles: Array<{
    id: string;
    role: string;
    members: number;
    access: AdminRoleAccess;
  }>;
  meta: {
    totalUsers: number;
    activeSubscriptions: number;
    lastUpdatedAt: string;
  };
}

export interface UpdateAdminBrandingInput {
  brandName: string;
  accentColor: string;
}

export interface UpdateAdminSecurityInput {
  mfaEnforced: boolean;
}

export interface UpdateAdminMaintenanceInput {
  maintenanceMode: boolean;
}

export interface UpdateAdminRolesInput {
  roles: Array<{
    id: "role-admin" | "role-owner" | "role-support";
    access: AdminRoleAccess;
  }>;
}

export interface AdminProfileResponse {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
}

export interface UpdateAdminProfileInput {
  fullName: string;
  phone?: string | null;
}
