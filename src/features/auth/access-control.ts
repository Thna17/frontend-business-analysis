import type { AuthUser } from "@/store/slices/authSlice";

export type AppRole = AuthUser["role"];

const OWNER_ONLY_PREFIXES = [
  "/owner",
  "/sale-record",
  "/product",
  "/analytics",
  "/subscriptions",
  "/report",
  "/settings",
] as const;

const ADMIN_ONLY_PREFIXES = [
  "/admin",
  "/admin-analytics",
  "/admin-settings",
  "/admin/subscriptions",
  "/admin/payments",
  "/admin/payments/success",
] as const;

const AUTH_PATHS = [
  "/login",
  "/signup",
  "/verify-email",
  "/forgot-password",
  "/reset-password",
] as const;

function normalizePath(path: string): string {
  if (!path) return "/";
  const [pathname] = path.split("?");
  return pathname || "/";
}

function matchesPrefix(path: string, prefix: string): boolean {
  return path === prefix || path.startsWith(`${prefix}/`);
}

export function getHomeRouteByRole(role: AppRole): string {
  return role === "admin" ? "/admin" : "/owner";
}

export function isAuthPath(path: string): boolean {
  const normalized = normalizePath(path);
  return AUTH_PATHS.some((prefix) => matchesPrefix(normalized, prefix));
}

export function getRequiredRoleForPath(path: string): AppRole | null {
  const normalized = normalizePath(path);

  if (ADMIN_ONLY_PREFIXES.some((prefix) => matchesPrefix(normalized, prefix))) {
    return "admin";
  }

  if (OWNER_ONLY_PREFIXES.some((prefix) => matchesPrefix(normalized, prefix))) {
    return "business_owner";
  }

  return null;
}

export function isPathAllowedForRole(path: string, role: AppRole): boolean {
  const requiredRole = getRequiredRoleForPath(path);
  return requiredRole === null || requiredRole === role;
}

export function sanitizeNextPath(input: string | null | undefined): string | null {
  if (!input) return null;
  const trimmed = input.trim();

  if (!trimmed.startsWith("/")) return null;
  if (trimmed.startsWith("//")) return null;
  if (trimmed.includes("://")) return null;

  const normalized = normalizePath(trimmed);
  if (isAuthPath(normalized)) return null;

  return trimmed;
}
