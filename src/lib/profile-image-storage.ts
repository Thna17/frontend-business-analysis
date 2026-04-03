import type { AuthUser } from "@/store/slices/authSlice";

export function getProfileImageStorageKey(user: AuthUser | null | undefined): string | null {
  if (!user?.id) return null;
  return `profileImage:${user.role}:${user.id}`;
}
