"use client";

import { ProtectedRouteGuard } from "@/components/auth/route-guard";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { PageTransition } from "@/components/shared/page-transition";

// Every private page goes through the same guard, shell, and page transition wrapper.
export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ProtectedRouteGuard>
      <DashboardShell>
        <PageTransition>{children}</PageTransition>
      </DashboardShell>
    </ProtectedRouteGuard>
  );
}
