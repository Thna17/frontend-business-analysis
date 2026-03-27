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
  useGetCartQuery,
  useAddCartItemMutation,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
  useCheckoutMutation,
  useGetOrderConfirmationQuery,
  useCheckKhqrPaymentMutation,
} = api;
