"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Bell, CircleUserRound, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardNavItem } from "@/features/owner-dashboard/dashboard-mock";
import { cn } from "@/lib/utils";
import { useGetNotificationsQuery } from "@/store/api";

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
  const pathname = usePathname();
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

  useEffect(() => {
    const useAdminProfile = resolvedProfileHref.startsWith("/admin");

    const loadProfileImage = () => {
      const saved = useAdminProfile
        ? localStorage.getItem("adminProfileImage") ||
          localStorage.getItem("profileImage")
        : localStorage.getItem("profileImage") ||
          localStorage.getItem("adminProfileImage");
      setProfileImage(saved);
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
  }, [resolvedProfileHref]);

  return (
    <header className="dashboard-container pt-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-full border border-slate-400 text-slate-700">
            <span className="text-xl leading-none">◡</span>
          </div>
          <p className="font-heading text-3xl leading-none font-semibold tracking-tight text-slate-900 md:text-[2rem]">
            Syntrix
          </p>
        </div>

        <div className="hidden items-center gap-3 xl:flex">
          <nav className="rounded-full bg-white px-2 py-3">
            <ul className="flex items-center gap-1">
              {items.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href ?? "#"}
                    className={cn(
                      "rounded-full px-4 py-2 text-sm font-medium text-slate-900 transition-colors",
                      item.href && pathname === item.href && "bg-slate-800 text-white",
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
              "h-12 rounded-full bg-white px-4 text-sm text-slate-900",
              pathname === settingsHref && "bg-slate-800 text-white hover:bg-slate-700 hover:text-white",
            )}
          >
            <Link href={settingsHref}>
              <Settings className="size-5" />
              Setting
            </Link>
          </Button>
          {notificationHref ? (
            <Button
              asChild
              variant="ghost"
              size="icon"
              className={cn(
                "relative size-12 rounded-full bg-white text-slate-900",
                isNotificationActive &&
                  "bg-slate-800 text-white hover:bg-slate-700 hover:text-white",
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
              className="size-12 rounded-full bg-white text-slate-900"
            >
              <Bell className="size-5" />
            </Button>
          )}
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="size-12 rounded-full bg-white text-slate-900"
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
        </div>
      </div>
    </header>
  );
}
