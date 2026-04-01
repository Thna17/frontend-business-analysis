"use client";

import { useEffect, useMemo, useState } from "react";
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
} from "@/store/slices/authSlice";

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
  const [isMounted, setIsMounted] = useState(false);

  const currentPathWithQuery = useMemo(() => {
    const query = searchParams.toString();
    return query ? `${pathname}?${query}` : pathname;
  }, [pathname, searchParams]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    if (status === "idle" || status === "checking") return;

    if (!user || status === "unauthenticated") {
      const next = encodeURIComponent(currentPathWithQuery);
      router.replace(`/login?next=${next}`);
      return;
    }

    if (!isPathAllowedForRole(pathname, user.role)) {
      router.replace(getHomeRouteByRole(user.role));
    }
  }, [status, user, pathname, currentPathWithQuery, router, isMounted]);

  if (!isMounted || status === "idle" || status === "checking") {
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
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    if (status === "idle" || status === "checking") return;
    if (!user || status !== "authenticated") return;

    const requested = sanitizeNextPath(searchParams.get("next"));
    if (requested && isPathAllowedForRole(requested, user.role)) {
      router.replace(requested);
      return;
    }

    router.replace(getHomeRouteByRole(user.role));
  }, [status, user, searchParams, router, isMounted]);

  if (!isMounted || status === "idle" || status === "checking") {
    return <GuardFallback />;
  }

  if (user && status === "authenticated") return null;

  return <>{children}</>;
}
