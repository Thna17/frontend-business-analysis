"use client";

import { AuthPageGuard } from "@/components/auth/route-guard";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <AuthPageGuard>{children}</AuthPageGuard>;
}
