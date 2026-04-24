export function shouldSkipAutoRefresh(route: string): boolean {
  return route.startsWith("/auth/login")
    || route.startsWith("/auth/register")
    || route.startsWith("/auth/refresh")
    || route.startsWith("/auth/logout")
    || route.startsWith("/auth/logout-all")
    || route.startsWith("/auth/verify-email-otp")
    || route.startsWith("/auth/resend-verification-otp")
    || route.startsWith("/auth/forgot-password")
    || route.startsWith("/auth/reset-password");
}
