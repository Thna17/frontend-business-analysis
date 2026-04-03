"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Bell, CircleUserRound, LogOut, Settings } from "lucide-react";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { DashboardNavItem } from "@/features/owner-dashboard/dashboard-mock";
import { getProfileImageStorageKey } from "@/lib/profile-image-storage";
import { cn } from "@/lib/utils";
import { type AppDispatch } from "@/store";
import { useGetCurrentUserQuery, useGetNotificationsQuery, useLogoutMutation } from "@/store/api";
import { logout as clearAuthState } from "@/store/slices/authSlice";

interface TopNavigationProps {
  items: DashboardNavItem[];
  settingsHref?: string;
  profileHref?: string;
  notificationHref?: string;
  notificationCount?: number;
}

export function TopNavigation({
  items,
  settingsHref = "/settings",
  profileHref,
  notificationHref = "/notification",
  notificationCount = 0,
}: TopNavigationProps) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const pathname = usePathname();
  const [triggerLogout, { isLoading: isLoggingOut }] = useLogoutMutation();
  const { data: currentUser } = useGetCurrentUserQuery();
  const resolvedProfileHref = profileHref ?? "/profile";
  const isNotificationActive = Boolean(
    notificationHref && pathname.startsWith(notificationHref),
  );
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const { data: notificationsData } = useGetNotificationsQuery(
    { page: 1, limit: 1, archived: false },
    { skip: !notificationHref },
  );
  const resolvedNotificationCount =
    notificationsData?.meta.unreadCount ?? notificationCount;
  const profileImageStorageKey = getProfileImageStorageKey(currentUser);

  useEffect(() => {
    const loadProfileImage = () => {
      if (!profileImageStorageKey) {
        setProfileImage(null);
        return;
      }
      setProfileImage(localStorage.getItem(profileImageStorageKey));
    };

    loadProfileImage();
    window.addEventListener("storage", loadProfileImage);
    window.addEventListener("admin-profile-updated", loadProfileImage);
    window.addEventListener("owner-profile-updated", loadProfileImage);

    return () => {
      window.removeEventListener("storage", loadProfileImage);
      window.removeEventListener("admin-profile-updated", loadProfileImage);
      window.removeEventListener("owner-profile-updated", loadProfileImage);
    };
  }, [profileImageStorageKey, resolvedProfileHref]);

  const handleLogout = async () => {
    try {
      await triggerLogout().unwrap();
    } catch {
      // Continue local logout even when server logout fails.
    } finally {
      dispatch(clearAuthState());
      router.replace("/login");
    }
  };

  return (
    <header className="dashboard-container top-navigation-shell pt-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Syntrix logo"
            width={180}
            height={88}
            className="h-[88px] w-auto object-contain"
            priority
          />
        </div>

        <div className="hidden items-center gap-3 xl:flex">
          <nav className="rounded-full border border-border bg-card px-2 py-3">
            <ul className="flex items-center gap-1">
              {items.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href ?? "#"}
                    className={cn(
                      "whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium text-foreground transition-colors",
                      item.href && pathname === item.href && "bg-foreground text-background",
                      !item.href && "cursor-default opacity-90",
                    )}
                    aria-disabled={!item.href}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <Button
            asChild
            variant="ghost"
            className={cn(
              "h-12 rounded-full border border-border bg-card px-4 text-sm text-foreground",
              pathname === settingsHref &&
                "bg-foreground text-background hover:bg-foreground/90 hover:text-background",
            )}
          >
            <Link href={settingsHref}>
              <Settings className="size-5" />
              Setting
            </Link>
          </Button>
          <ThemeToggle />
          {notificationHref ? (
            <Button
              asChild
              variant="ghost"
              size="icon"
              className={cn(
                "relative size-12 rounded-full border border-border bg-card text-foreground",
                isNotificationActive &&
                  "bg-foreground text-background hover:bg-foreground/90 hover:text-background",
              )}
            >
              <Link href={notificationHref} aria-label="Notifications">
                <Bell className="size-5" />
                {resolvedNotificationCount > 0 && (
                  <span className="absolute right-2 top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#f0c533] px-1 text-[10px] font-bold text-slate-900">
                    {resolvedNotificationCount}
                  </span>
                )}
              </Link>
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="size-12 rounded-full border border-border bg-card text-foreground"
            >
              <Bell className="size-5" />
            </Button>
          )}
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="size-12 rounded-full border border-border bg-card text-foreground"
          >
            <Link href={resolvedProfileHref} aria-label="Profile">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="size-10 rounded-full object-cover"
                />
              ) : (
                <CircleUserRound className="size-5" />
              )}
            </Link>
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="h-12 rounded-full border border-border bg-card px-4 text-sm text-foreground hover:bg-accent hover:text-accent-foreground"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            <LogOut className="size-5" />
            {isLoggingOut ? "Logging out..." : "Logout"}
          </Button>
        </div>
      </div>
    </header>
  );
}
