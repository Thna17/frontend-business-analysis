export type UserRole = "BUSINESS_OWNER" | "ADMIN";

export type SubscriptionPlan = "FREE" | "PRO" | "BUSINESS";

export type SubscriptionStatus = "ACTIVE" | "EXPIRED" | "CANCELED";

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
}

export interface BusinessProfile {
  id: string;
  ownerId: string;
  businessName: string;
  phone: string;
  address: string;
}

export interface SaleRecord {
  id: string;
  productName: string;
  category: string;
  price: number;
  quantity: number;
  date: string;
}

export interface RevenueAnalytics {
  totalRevenue: number;
  growthPercentage: number;
  monthlyComparison: Array<{ month: string; amount: number }>;
  dailyTrend: Array<{ day: string; amount: number }>;
  topProducts: Array<{ name: string; revenue: number }>;
}

export interface Subscription {
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  renewDate: string;
}

export interface AdminMetrics {
  totalUsers: number;
  activeSubscriptions: number;
  platformUsageRate: number;
  newUsersThisMonth: number;
}
