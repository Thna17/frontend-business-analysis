"use client";

import { ProtectedRouteGuard } from "@/components/auth/route-guard";

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <ProtectedRouteGuard>{children}</ProtectedRouteGuard>;
}
