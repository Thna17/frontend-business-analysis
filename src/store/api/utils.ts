import type { FetchArgs } from "@reduxjs/toolkit/query/react";
import type { AuthUser } from "@/store/slices/authSlice";
import type {
  ApiEnvelope,
  AuthSessionResponse,
  OwnerProductListMeta,
  SalesListMeta,
  UnknownRecord,
} from "@/store/api/types";

export function asRecord(value: unknown): UnknownRecord {
  if (typeof value === "object" && value !== null) {
    return value as UnknownRecord;
  }
  return {};
}

export function mapRole(role: string): AuthUser["role"] {
  if (role === "admin") return "admin";
  return "business_owner";
}

export function normalizeAuthUser(user: unknown): AuthUser {
  const safeUser = asRecord(user);
  return {
    id: String(safeUser.id ?? ""),
    email: String(safeUser.email ?? ""),
    fullName: String(safeUser.fullName ?? ""),
    role: mapRole(String(safeUser.role ?? "business_owner")),
    isEmailVerified: Boolean(safeUser.isEmailVerified),
  };
}

export function transformAuthSession(
  response: ApiEnvelope<{ accessToken: string; user: unknown }>,
): AuthSessionResponse {
  return {
    accessToken: response.data.accessToken,
    user: normalizeAuthUser(response.data.user),
  };
}

export function normalizeSalesListMeta(meta: unknown): SalesListMeta {
  const safeMeta = asRecord(meta);
  return {
    count: Number(safeMeta.count ?? 0),
    total: Number(safeMeta.total ?? 0),
    page: Number(safeMeta.page ?? 1),
    limit: Number(safeMeta.limit ?? 10),
    hasNextPage: Boolean(safeMeta.hasNextPage),
  };
}

export function normalizeOwnerProductListMeta(meta: unknown): OwnerProductListMeta {
  const safeMeta = asRecord(meta);
  return {
    count: Number(safeMeta.count ?? 0),
    total: Number(safeMeta.total ?? 0),
    page: Number(safeMeta.page ?? 1),
    limit: Number(safeMeta.limit ?? 10),
    hasNextPage: Boolean(safeMeta.hasNextPage),
  };
}

export function extractRouteFromArgs(args: string | FetchArgs): string {
  return typeof args === "string" ? args : args.url;
}

export function shouldSkipAutoRefresh(route: string): boolean {
  return route.startsWith("/auth/login")
    || route.startsWith("/auth/register")
    || route.startsWith("/auth/refresh")
    || route.startsWith("/auth/verify-email-otp")
    || route.startsWith("/auth/resend-verification-otp")
    || route.startsWith("/auth/forgot-password")
    || route.startsWith("/auth/reset-password");
}
