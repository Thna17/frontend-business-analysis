import {
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import type { Product } from "@/types";
import {
  logout as clearAuthState,
  setCredentials,
  type AuthUser,
} from "@/redux/features/auth/authSlice";

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: unknown;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface SignupRequest {
  fullName: string;
  email: string;
  password: string;
}

interface VerifyEmailOtpRequest {
  email: string;
  code: string;
}

interface ForgotPasswordRequest {
  email: string;
}

interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

interface ChangeSubscriptionPlanRequest {
  plan: "free" | "pro" | "business";
}

export interface BusinessProfile {
  id: string;
  ownerUserId: string;
  name: string;
  category: string;
  description: string | null;
  currency: string;
  createdAt: string | null;
  updatedAt: string | null;
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

interface AuthSessionResponse {
  accessToken: string;
  user: AuthUser;
}

interface RegisterResponse {
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

type UnknownRecord = Record<string, unknown>;

function asRecord(value: unknown): UnknownRecord {
  if (typeof value === "object" && value !== null) {
    return value as UnknownRecord;
  }
  return {};
}

function mapRole(role: string): AuthUser["role"] {
  if (role === "admin") return "admin";
  return "business_owner";
}

function normalizeAuthUser(user: unknown): AuthUser {
  const safeUser = asRecord(user);
  return {
    id: String(safeUser.id ?? ""),
    email: String(safeUser.email ?? ""),
    fullName: String(safeUser.fullName ?? ""),
    role: mapRole(String(safeUser.role ?? "business_owner")),
    isEmailVerified: Boolean(safeUser.isEmailVerified),
  };
}

function transformAuthSession(
  response: ApiEnvelope<{ accessToken: string; user: unknown }>,
): AuthSessionResponse {
  return {
    accessToken: response.data.accessToken,
    user: normalizeAuthUser(response.data.user),
  };
}

function normalizeSalesListMeta(meta: unknown): SalesListMeta {
  const safeMeta = asRecord(meta);
  return {
    count: Number(safeMeta.count ?? 0),
    total: Number(safeMeta.total ?? 0),
    page: Number(safeMeta.page ?? 1),
    limit: Number(safeMeta.limit ?? 10),
    hasNextPage: Boolean(safeMeta.hasNextPage),
  };
}

function normalizeOwnerProductListMeta(meta: unknown): OwnerProductListMeta {
  const safeMeta = asRecord(meta);
  return {
    count: Number(safeMeta.count ?? 0),
    total: Number(safeMeta.total ?? 0),
    page: Number(safeMeta.page ?? 1),
    limit: Number(safeMeta.limit ?? 10),
    hasNextPage: Boolean(safeMeta.hasNextPage),
  };
}

function getStoredAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

function extractRouteFromArgs(args: string | FetchArgs): string {
  return typeof args === "string" ? args : args.url;
}

function shouldSkipAutoRefresh(route: string): boolean {
  return route.startsWith("/auth/login")
    || route.startsWith("/auth/register")
    || route.startsWith("/auth/refresh")
    || route.startsWith("/auth/verify-email-otp")
    || route.startsWith("/auth/resend-verification-otp")
    || route.startsWith("/auth/forgot-password")
    || route.startsWith("/auth/reset-password");
}

const rawBaseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api",
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as { auth?: { token?: string | null } };
    const token = state.auth?.token ?? getStoredAccessToken();

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
  credentials: "include",
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  const statusCode = typeof result.error?.status === "number" ? result.error.status : null;
  const route = extractRouteFromArgs(args);
  if (statusCode !== 401 || shouldSkipAutoRefresh(route)) {
    return result;
  }

  const refreshResult = await rawBaseQuery(
    {
      url: "/auth/refresh",
      method: "POST",
    },
    api,
    extraOptions,
  );

  if (refreshResult.data) {
    const session = transformAuthSession(
      refreshResult.data as ApiEnvelope<{ accessToken: string; user: unknown }>,
    );
    api.dispatch(
      setCredentials({
        token: session.accessToken,
        user: session.user,
      }),
    );

    result = await rawBaseQuery(args, api, extraOptions);
    return result;
  }

  api.dispatch(clearAuthState());
  return result;
};

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Product", "User", "Cart"],
  endpoints: (builder) => ({
    getProducts: builder.query<Product[], void>({
      query: () => "/products",
      transformResponse: (response: ApiEnvelope<Product[]>) => response.data,
      providesTags: ["Product"],
    }),
    getProductBySlug: builder.query<Product, string>({
      query: (slug) => `/products/slug/${slug}`,
      transformResponse: (response: ApiEnvelope<Product>) => response.data,
      providesTags: (_result, _error, slug) => [{ type: "Product", id: slug }],
    }),
    getProduct: builder.query<Product, string>({
      query: (id) => `/products/${id}`,
      transformResponse: (response: ApiEnvelope<Product>) => response.data,
      providesTags: (_result, _error, id) => [{ type: "Product", id }],
    }),
    getCampaignBySlug: builder.query<unknown, string>({
      query: (slug) => `/campaigns/slug/${slug}`,
      transformResponse: (response: ApiEnvelope<unknown>) => response.data,
    }),
    register: builder.mutation<RegisterResponse, SignupRequest>({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        body: userData,
      }),
      transformResponse: (response: ApiEnvelope<{ verificationRequired: boolean; user: unknown }>) => ({
        verificationRequired: Boolean(response.data.verificationRequired),
        user: normalizeAuthUser(response.data.user),
      }),
      invalidatesTags: ["User"],
    }),
    verifyEmailOtp: builder.mutation<AuthSessionResponse, VerifyEmailOtpRequest>({
      query: (data) => ({
        url: "/auth/verify-email-otp",
        method: "POST",
        body: data,
      }),
      transformResponse: transformAuthSession,
      invalidatesTags: ["User"],
    }),
    resendVerificationOtp: builder.mutation<{ message: string }, { email: string }>({
      query: (data) => ({
        url: "/auth/resend-verification-otp",
        method: "POST",
        body: data,
      }),
      transformResponse: (response: ApiEnvelope<null>) => ({
        message: response.message,
      }),
    }),
    login: builder.mutation<AuthSessionResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      transformResponse: transformAuthSession,
      invalidatesTags: ["User"],
    }),
    refresh: builder.mutation<AuthSessionResponse, void>({
      query: () => ({
        url: "/auth/refresh",
        method: "POST",
      }),
      transformResponse: transformAuthSession,
    }),
    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      transformResponse: (response: ApiEnvelope<null>) => ({ message: response.message }),
      invalidatesTags: ["User"],
    }),
    getCurrentUser: builder.query<AuthUser, void>({
      query: () => "/auth/current",
      transformResponse: (response: ApiEnvelope<unknown>) => normalizeAuthUser(response.data),
      providesTags: ["User"],
    }),
    forgotPassword: builder.mutation<{ message: string }, ForgotPasswordRequest>({
      query: (body) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiEnvelope<null>) => ({ message: response.message }),
    }),
    resetPassword: builder.mutation<{ message: string }, ResetPasswordRequest>({
      query: (body) => ({
        url: "/auth/reset-password",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiEnvelope<null>) => ({ message: response.message }),
    }),
    changePassword: builder.mutation<AuthSessionResponse, ChangePasswordRequest>({
      query: (body) => ({
        url: "/auth/change-password",
        method: "POST",
        body,
      }),
      transformResponse: transformAuthSession,
      invalidatesTags: ["User"],
    }),
    getSubscriptionDashboard: builder.query<SubscriptionDashboardResponse, { page?: number; limit?: number } | void>({
      query: (params) => ({
        url: "/subscriptions/dashboard",
        params: params ?? { page: 1, limit: 3 },
      }),
      transformResponse: (response: ApiEnvelope<SubscriptionDashboardResponse>) => response.data,
      providesTags: ["User"],
    }),
    changeSubscriptionPlan: builder.mutation<{ message: string }, ChangeSubscriptionPlanRequest>({
      query: (body) => ({
        url: "/subscriptions/plan",
        method: "PATCH",
        body,
      }),
      transformResponse: (response: ApiEnvelope<null>) => ({ message: response.message }),
      invalidatesTags: ["User"],
    }),
    cancelSubscription: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: "/subscriptions/cancel",
        method: "POST",
      }),
      transformResponse: (response: ApiEnvelope<null>) => ({ message: response.message }),
      invalidatesTags: ["User"],
    }),
    reactivateSubscription: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: "/subscriptions/reactivate",
        method: "POST",
      }),
      transformResponse: (response: ApiEnvelope<null>) => ({ message: response.message }),
      invalidatesTags: ["User"],
    }),
    getOwnerDashboardOverview: builder.query<OwnerDashboardOverviewResponse, OwnerOverviewQuery | void>({
      query: (params) => ({
        url: "/analytics/owner-overview",
        params: params ?? { range: "6m" },
      }),
      transformResponse: (response: ApiEnvelope<OwnerDashboardOverviewResponse>) => response.data,
      providesTags: ["User"],
    }),
    getOwnerAnalyticsDashboard: builder.query<OwnerAnalyticsDashboardResponse, OwnerOverviewQuery | void>({
      query: (params) => ({
        url: "/analytics/owner-dashboard",
        params: params ?? { range: "6m" },
      }),
      transformResponse: (response: ApiEnvelope<OwnerAnalyticsDashboardResponse>) => response.data,
      providesTags: ["User"],
    }),
    getSales: builder.query<SalesListResponse, SalesListQuery | void>({
      query: (params) => ({
        url: "/sales",
        params: params ?? { page: 1, limit: 3 },
      }),
      transformResponse: (response: ApiEnvelope<SalesListItem[]>) => ({
        items: response.data,
        meta: normalizeSalesListMeta(response.meta),
      }),
      providesTags: ["User"],
    }),
    getBusinessProfile: builder.query<BusinessProfile, void>({
      query: () => "/businesses/current",
      transformResponse: (response: ApiEnvelope<BusinessProfile>) => response.data,
      providesTags: ["User"],
    }),
    getSaleProductSuggestions: builder.query<SaleProductSuggestion[], { search?: string; limit?: number } | void>({
      query: (params) => ({
        url: "/sales/products",
        params: params ?? { limit: 20 },
      }),
      transformResponse: (response: ApiEnvelope<SaleProductSuggestion[]>) => response.data,
      providesTags: ["User"],
    }),
    createSale: builder.mutation<SalesListItem, SaleWriteInput>({
      query: (body) => ({
        url: "/sales",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiEnvelope<SalesListItem>) => response.data,
      invalidatesTags: ["User"],
    }),
    updateSale: builder.mutation<SalesListItem, { id: string; body: SaleWriteInput }>({
      query: ({ id, body }) => ({
        url: `/sales/${id}`,
        method: "PUT",
        body,
      }),
      transformResponse: (response: ApiEnvelope<SalesListItem>) => response.data,
      invalidatesTags: ["User"],
    }),
    deleteSale: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/sales/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: ApiEnvelope<null>) => ({ message: response.message }),
      invalidatesTags: ["User"],
    }),
    getOwnerProductsOverview: builder.query<OwnerProductsOverviewResponse, void>({
      query: () => "/owner-products/overview",
      transformResponse: (response: ApiEnvelope<OwnerProductsOverviewResponse>) => response.data,
      providesTags: ["User"],
    }),
    getOwnerProducts: builder.query<OwnerProductListResponse, OwnerProductListQuery | void>({
      query: (params) => ({
        url: "/owner-products",
        params: params ?? { page: 1, limit: 10, sortBy: "updatedDesc" },
      }),
      transformResponse: (response: ApiEnvelope<OwnerProductItem[]>) => ({
        items: response.data,
        meta: normalizeOwnerProductListMeta(response.meta),
      }),
      providesTags: ["User"],
    }),
    getOwnerProductCategories: builder.query<string[], { search?: string; limit?: number } | void>({
      query: (params) => ({
        url: "/owner-products/categories",
        params: params ?? { limit: 50 },
      }),
      transformResponse: (response: ApiEnvelope<string[]>) => response.data,
      providesTags: ["User"],
    }),
    createOwnerProduct: builder.mutation<OwnerProductItem, OwnerProductWriteInput>({
      query: (body) => ({
        url: "/owner-products",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiEnvelope<OwnerProductItem>) => response.data,
      invalidatesTags: ["User"],
    }),
    updateOwnerProduct: builder.mutation<OwnerProductItem, { id: string; body: OwnerProductWriteInput }>({
      query: ({ id, body }) => ({
        url: `/owner-products/${id}`,
        method: "PUT",
        body,
      }),
      transformResponse: (response: ApiEnvelope<OwnerProductItem>) => response.data,
      invalidatesTags: ["User"],
    }),
    deleteOwnerProduct: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/owner-products/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: ApiEnvelope<null>) => ({ message: response.message }),
      invalidatesTags: ["User"],
    }),
    getCart: builder.query<CartResponse, void>({
      query: () => "/cart",
      transformResponse: (response: ApiEnvelope<CartResponse>) => response.data,
      providesTags: ["Cart"],
    }),
    addCartItem: builder.mutation<CartResponse, { productId: string; quantity: number }>({
      query: (data) => ({
        url: "/cart/items",
        method: "POST",
        body: data,
      }),
      transformResponse: (response: ApiEnvelope<CartResponse>) => response.data,
      invalidatesTags: ["Cart"],
    }),
    updateCartItem: builder.mutation<CartResponse, { id: string; quantity: number }>({
      query: ({ id, quantity }) => ({
        url: `/cart/items/${id}`,
        method: "PATCH",
        body: { quantity },
      }),
      transformResponse: (response: ApiEnvelope<CartResponse>) => response.data,
      invalidatesTags: ["Cart"],
    }),
    removeCartItem: builder.mutation<CartResponse, string>({
      query: (id) => ({
        url: `/cart/items/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: ApiEnvelope<CartResponse>) => response.data,
      invalidatesTags: ["Cart"],
    }),
    checkout: builder.mutation<unknown, unknown>({
      query: (data) => ({
        url: "/checkout",
        method: "POST",
        body: data,
      }),
      transformResponse: (response: ApiEnvelope<unknown>) => response.data,
      invalidatesTags: ["Cart"],
    }),
    getOrderConfirmation: builder.query<unknown, { id: string; email?: string }>({
      query: ({ id, email }) => ({
        url: `/orders/confirm/${id}`,
        params: email ? { email } : undefined,
      }),
      transformResponse: (response: ApiEnvelope<unknown>) => response.data,
    }),
    checkKhqrPayment: builder.mutation<unknown, { id: string; email?: string }>({
      query: ({ id, email }) => ({
        url: `/orders/confirm/${id}/check-khqr`,
        method: "POST",
        body: email ? { email } : undefined,
      }),
      transformResponse: (response: ApiEnvelope<unknown>) => response.data,
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useGetProductBySlugQuery,
  useGetCampaignBySlugQuery,
  useRegisterMutation,
  useVerifyEmailOtpMutation,
  useResendVerificationOtpMutation,
  useLoginMutation,
  useRefreshMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useGetSubscriptionDashboardQuery,
  useChangeSubscriptionPlanMutation,
  useCancelSubscriptionMutation,
  useReactivateSubscriptionMutation,
  useGetOwnerDashboardOverviewQuery,
  useGetOwnerAnalyticsDashboardQuery,
  useGetSalesQuery,
  useGetBusinessProfileQuery,
  useGetSaleProductSuggestionsQuery,
  useCreateSaleMutation,
  useUpdateSaleMutation,
  useDeleteSaleMutation,
  useGetOwnerProductsOverviewQuery,
  useGetOwnerProductsQuery,
  useGetOwnerProductCategoriesQuery,
  useCreateOwnerProductMutation,
  useUpdateOwnerProductMutation,
  useDeleteOwnerProductMutation,
  useGetCartQuery,
  useAddCartItemMutation,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
  useCheckoutMutation,
  useGetOrderConfirmationQuery,
  useCheckKhqrPaymentMutation,
} = api;
