import type { AuthUser } from "@/store/slices/authSlice";
import type { Product } from "@/types";

export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: unknown;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  fullName: string;
  email: string;
  password: string;
}

export interface VerifyEmailOtpRequest {
  email: string;
  code: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ChangeSubscriptionPlanRequest {
  plan: "free" | "pro" | "business";
}

export interface BusinessProfile {
  id: string;
  ownerUserId: string;
  name: string;
  category: string;
  description: string | null;
  website?: string | null;
  address?: string | null;
  currency: string;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface SettingsDashboardResponse {
  account: {
    fullName: string;
    email: string;
    phone: string;
    role: string;
  };
  business: {
    exists: boolean;
    name: string;
    type: string;
    website: string;
    address: string;
    description: string;
    currency: string;
  };
  notifications: {
    emailNotifications: boolean;
    salesAlerts: boolean;
    weeklyReports: boolean;
    productUpdates: boolean;
  };
  preferences: {
    language: string;
    timezone: string;
    dateFormat: string;
    currency: string;
  };
  security: {
    twoFactorEnabled: boolean;
  };
  dangerZone: {
    deactivationRequestedAt: string | null;
    deletionRequestedAt: string | null;
  };
}

export interface UpdateSettingsAccountInput {
  fullName: string;
  phone?: string | null;
}

export interface UpdateSettingsBusinessInput {
  name: string;
  type: string;
  website?: string;
  address?: string;
  description?: string;
  currency?: string;
}

export interface UpdateSettingsNotificationsInput {
  emailNotifications: boolean;
  salesAlerts: boolean;
  weeklyReports: boolean;
  productUpdates: boolean;
}

export interface UpdateSettingsPreferencesInput {
  language: string;
  timezone: string;
  dateFormat: string;
  currency: string;
}

export interface UpdateSettingsSecurityInput {
  twoFactorEnabled: boolean;
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

export interface ReportsDashboardResponse {
  generator: {
    reportTypes: Array<"Sales" | "Revenue" | "Product" | "Customer">;
    categories: string[];
    dateRanges: Array<"Last 7 Days" | "Last 30 Days" | "This Quarter" | "This Year">;
    exportFormats: Array<"PDF" | "CSV" | "Excel">;
  };
  insights: Array<{
    title: string;
    description: string;
    tone: "amber" | "slate";
  }>;
  quickExports: string[];
  history: Array<{
    id: string;
    name: string;
    type: "Sales" | "Revenue" | "Product" | "Customer";
    status: "READY" | "PROCESSING";
    dateGenerated: string;
    format: "PDF" | "CSV" | "Excel";
  }>;
  summary: {
    generatedReports: number;
    currentRevenue: number;
    previousRevenue: number;
    productDownloads: number;
    churnDownPercentage: number;
    businessName: string;
  };
}

export interface GenerateReportRequest {
  reportType: "Sales" | "Revenue" | "Product" | "Customer";
  categoryFilter: string;
  dateRange: "Last 7 Days" | "Last 30 Days" | "This Quarter" | "This Year";
  exportFormat: "PDF" | "CSV" | "Excel";
}

export interface OwnerOverviewQuery {
  range?: "6m" | "12m";
  startDate?: string;
  endDate?: string;
}

export interface SalesListItem {
  id: string;
  businessId: string;
  ownerUserId: string;
  productName: string;
  price: number;
  quantity: number;
  category: string;
  soldAt: string;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface SalesListMeta {
  count: number;
  total: number;
  page: number;
  limit: number;
  hasNextPage: boolean;
}

export interface SalesListResponse {
  items: SalesListItem[];
  meta: SalesListMeta;
}

export interface SalesListQuery {
  search?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface SaleProductSuggestion {
  name: string;
  category: string;
  price: number;
  lastSoldAt: string;
}

export interface SaleWriteInput {
  productName: string;
  category: string;
  price: number;
  quantity: number;
  soldAt: string;
}

export interface OwnerProductItem {
  id: string;
  name: string;
  category: string;
  unitPrice: number;
  stock: number;
  isActive: boolean;
  quantitySold: number;
  revenue: number;
  lastSoldAt: string | null;
  updatedAt: string | null;
  createdAt: string | null;
}

export interface OwnerProductListMeta {
  count: number;
  total: number;
  page: number;
  limit: number;
  hasNextPage: boolean;
}

export interface OwnerProductListResponse {
  items: OwnerProductItem[];
  meta: OwnerProductListMeta;
}

export interface OwnerProductListQuery {
  search?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
  sortBy?:
    | "updatedDesc"
    | "nameAsc"
    | "nameDesc"
    | "salesHigh"
    | "revenueHigh"
    | "stockLow"
    | "stockHigh";
  page?: number;
  limit?: number;
}

export interface OwnerProductWriteInput {
  name: string;
  category: string;
  unitPrice: number;
  stock: number;
  isActive?: boolean;
}

export interface OwnerProductsOverviewResponse {
  kpi: {
    totalProducts: number;
    bestSeller: string | null;
    productRevenue: number;
    lowStockCount: number;
    revenueGrowthPercentage: number;
  };
  ranking: Array<{
    name: string;
    revenue: number;
    quantitySold: number;
    percent: number;
  }>;
}

export interface AuthSessionResponse {
  accessToken: string;
  user: AuthUser;
}

export interface RegisterResponse {
  verificationRequired: boolean;
  user: AuthUser;
}

export interface CartProductRef {
  id: string;
  name?: string;
  price?: number;
  images?: Array<{ url: string; sortOrder?: number }>;
}

export interface CartItemResponse {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  product?: CartProductRef;
  createdAt: string;
  updatedAt: string;
}

export interface CartResponse {
  id: string;
  customerId: string | null;
  guestToken: string | null;
  items: CartItemResponse[];
  subtotal: number;
  createdAt: string;
  updatedAt: string;
}

export type UnknownRecord = Record<string, unknown>;

export type ProductEntity = Product;
