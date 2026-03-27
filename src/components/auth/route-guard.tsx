"use client";

import { useEffect, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import {
  getHomeRouteByRole,
  isPathAllowedForRole,
  sanitizeNextPath,
} from "@/features/auth/access-control";
import {
  selectAuthStatus,
  selectCurrentUser,
} from "@/redux/features/auth/authSlice";

interface RouteGuardProps {
  children: React.ReactNode;
}

function GuardFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-sm text-[#667085]">Checking session...</p>
    </div>
  );
}

export function ProtectedRouteGuard({ children }: RouteGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const status = useSelector(selectAuthStatus);
  const user = useSelector(selectCurrentUser);

  const currentPathWithQuery = useMemo(() => {
    const query = searchParams.toString();
    return query ? `${pathname}?${query}` : pathname;
  }, [pathname, searchParams]);

  useEffect(() => {
    if (status === "idle" || status === "checking") return;

    if (!user || status === "unauthenticated") {
      const next = encodeURIComponent(currentPathWithQuery);
      router.replace(`/login?next=${next}`);
      return;
    }

    if (!isPathAllowedForRole(pathname, user.role)) {
      router.replace(getHomeRouteByRole(user.role));
    }
  }, [status, user, pathname, currentPathWithQuery, router]);

  if (status === "idle" || status === "checking") {
    return <GuardFallback />;
  }

  if (!user) return null;
  if (!isPathAllowedForRole(pathname, user.role)) return null;

  return <>{children}</>;
}

export function AuthPageGuard({ children }: RouteGuardProps) {
  const router = useRouter();
  const status = useSelector(selectAuthStatus);
  const user = useSelector(selectCurrentUser);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (status === "idle" || status === "checking") return;
    if (!user || status !== "authenticated") return;

    const requested = sanitizeNextPath(searchParams.get("next"));
    if (requested && isPathAllowedForRole(requested, user.role)) {
      router.replace(requested);
      return;
    }

    router.replace(getHomeRouteByRole(user.role));
  }, [status, user, searchParams, router]);

  if (status === "idle" || status === "checking") {
    return <GuardFallback />;
  }

  if (user && status === "authenticated") return null;

  return <>{children}</>;
}
