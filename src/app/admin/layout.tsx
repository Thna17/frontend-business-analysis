"use client";

import { ProtectedRouteGuard } from "@/components/auth/route-guard";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { PageTransition } from "@/components/shared/page-transition";

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ProtectedRouteGuard>
      <DashboardShell variant="admin">
        <PageTransition>{children}</PageTransition>
      </DashboardShell>
    </ProtectedRouteGuard>
  );
}
