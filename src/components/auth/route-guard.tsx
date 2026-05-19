"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { LoadingScreen } from "@/components/shared/loading-screen";
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

// Shared loading state while the app decides whether to render or redirect.
function GuardFallback() {
  return (
    <LoadingScreen
      title="Checking your session"
      description="Restoring access and routing you to the right workspace."
    />
  );
}

// Protects dashboard pages and routes users into the workspace allowed by their role.
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
    // eslint-disable-next-line react-hooks/set-state-in-effect
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

// Keeps signed-in users out of login and recovery screens.
export function AuthPageGuard({ children }: RouteGuardProps) {
  const router = useRouter();
  const status = useSelector(selectAuthStatus);
  const user = useSelector(selectCurrentUser);
  const searchParams = useSearchParams();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
