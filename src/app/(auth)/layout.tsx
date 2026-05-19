"use client";

import { AuthPageGuard } from "@/components/auth/route-guard";

// Shared layout for login, signup, verification, and password recovery screens.
export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <AuthPageGuard>{children}</AuthPageGuard>;
}
