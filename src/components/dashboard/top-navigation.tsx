"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Bell, ChevronRight, LogOut, Menu, Settings } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/shared/brand-logo";
import { CommandMenu } from "@/components/shared/command-menu";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { type DashboardNavItem } from "@/features/navigation/dashboard-shell-config";
import { useEntitlements } from "@/features/subscriptions/use-entitlements";
import { cn } from "@/lib/utils";
import { type AppDispatch } from "@/store";
import {
  useGetCurrentUserQuery,
  useGetNotificationsQuery,
  useGetSettingsProfileQuery,
  useLogoutMutation,
} from "@/store/api";
import { logout as clearAuthState } from "@/store/slices/authSlice";

const PROFILE_PLACEHOLDER_IMAGE =
  "https://ui-avatars.com/api/?name=User&background=e5e7eb&color=111827&bold=true&size=128";
const NAV_TOP_VISIBLE_Y = 36;
const NAV_HIDE_AFTER_Y = 180;
const NAV_SHOW_AFTER_Y = 120;
const NAV_MIN_DELTA = 10;
const NAV_RESHOW_TRAVEL = 44;

type NavRowMode = "docked" | "floating" | "hidden";

function resolveProfileImage(image?: string | null): string {
  if (!image) return PROFILE_PLACEHOLDER_IMAGE;
  const normalized = image.trim();
  return normalized.length > 0 ? normalized : PROFILE_PLACEHOLDER_IMAGE;
}

interface TopNavigationProps {
  items: DashboardNavItem[];
  workspaceLabel: string;
  homeHref: string;
  settingsHref?: string;
  profileHref?: string;
  notificationHref?: string;
  notificationCount?: number;
}

function isItemActive(pathname: string, href?: string) {
  if (!href) return false;
  if (pathname === href) return true;
  if (href === "/owner" || href === "/admin") return false;
  return pathname.startsWith(`${href}/`);
}

// Shared top navigation adapts links and actions to the active dashboard shell.
export function TopNavigation({
  items,
  workspaceLabel,
  homeHref,
  settingsHref = "/settings",
  profileHref,
  notificationHref = "/notification",
  notificationCount = 0,
}: TopNavigationProps) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const pathname = usePathname();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [navRowMode, setNavRowMode] = useState<NavRowMode>("docked");
  const [triggerLogout, { isLoading: isLoggingOut }] = useLogoutMutation();
  const lastScrollYRef = useRef(0);
  const upwardTravelRef = useRef(0);
  const downwardTravelRef = useRef(0);
  const entitlements = useEntitlements();
  const { data: currentUser } = useGetCurrentUserQuery();
  const { data: profile } = useGetSettingsProfileQuery();

  const resolvedProfileHref = profileHref ?? "/profile";
  const isNotificationActive = Boolean(notificationHref && pathname.startsWith(notificationHref));
  const { data: notificationsData } = useGetNotificationsQuery(
    { page: 1, limit: 1, archived: false },
    { skip: !notificationHref },
  );

  const resolvedNotificationCount = notificationsData?.meta.unreadCount ?? notificationCount;
  const profileImage = profile?.profileImage ?? null;

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

  const resolvedImage = resolveProfileImage(profile?.profileImage ?? profileImage);
  const visibleItems = items.filter((item) => {
    if (!entitlements.canAccess(item.requiredFeature)) {
      return false;
    }

    if (currentUser?.role === "business_member" && item.href === "/subscriptions") {
      return false;
    }

    return true;
  });
  const commandLinks = visibleItems
    .filter((item): item is DashboardNavItem & { href: string } => Boolean(item.href))
    .filter((item) => item.href !== settingsHref)
    .slice(0, 3)
    .map((item) => ({ label: item.label, href: item.href }));
  useEffect(() => {
    let ticking = false;

    const updateNavVisibility = () => {
      const currentY = window.scrollY;
      const lastY = lastScrollYRef.current;
      const delta = currentY - lastY;

      if (currentY <= NAV_TOP_VISIBLE_Y) {
        upwardTravelRef.current = 0;
        downwardTravelRef.current = 0;
        setNavRowMode("docked");
      } else if (delta >= NAV_MIN_DELTA) {
        downwardTravelRef.current += delta;
        upwardTravelRef.current = 0;

        if (currentY >= NAV_HIDE_AFTER_Y && downwardTravelRef.current >= NAV_RESHOW_TRAVEL) {
          setNavRowMode("hidden");
          downwardTravelRef.current = 0;
        }
      } else if (delta <= -NAV_MIN_DELTA) {
        upwardTravelRef.current += Math.abs(delta);
        downwardTravelRef.current = 0;

        if (
          currentY <= NAV_SHOW_AFTER_Y ||
          upwardTravelRef.current >= NAV_RESHOW_TRAVEL
        ) {
          setNavRowMode(currentY <= NAV_TOP_VISIBLE_Y ? "docked" : "floating");
          upwardTravelRef.current = 0;
        }
      }

      lastScrollYRef.current = currentY;
      ticking = false;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(updateNavVisibility);
    };

    lastScrollYRef.current = window.scrollY;
    upwardTravelRef.current = 0;
    downwardTravelRef.current = 0;
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    lastScrollYRef.current = window.scrollY;
    upwardTravelRef.current = 0;
    downwardTravelRef.current = 0;
    setNavRowMode(window.scrollY <= NAV_TOP_VISIBLE_Y ? "docked" : "floating");
  }, [pathname]);

  return (
    <header className="dashboard-topbar">
      <div className="dashboard-container">
        <div className="dashboard-topbar-row">
          <div className="dashboard-topbar-brand">
            <BrandLogo
              href={homeHref}
              size="md"
              priority
              linkClassName="dashboard-brand-link"
              iconClassName="rounded-[16px]"
              nameClassName="text-[1.18rem] text-[color:var(--topbar-foreground)]"
            />
          </div>

          <div className="hidden min-w-0 flex-1 items-center justify-end gap-3 xl:flex">
            <CommandMenu
              quickLinks={commandLinks}
              settingsHref={settingsHref}
              onLogout={handleLogout}
              isLoggingOut={isLoggingOut}
            />
            <div className="dashboard-topbar-tools">
              {notificationHref ? (
                <Button
                  asChild
                  variant="outline"
                  size="icon"
                  className={cn(
                    "relative h-10 w-10 rounded-[calc(var(--radius-control)-2px)] border-border/70 bg-card/85",
                    isNotificationActive && "border-transparent bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground",
                  )}
                >
                  <Link href={notificationHref} aria-label="Notifications">
                    <Bell className="size-4.5" />
                    {resolvedNotificationCount > 0 && (
                      <span className="dashboard-notification-badge">
                        {resolvedNotificationCount}
                      </span>
                    )}
                  </Link>
                </Button>
              ) : null}
              <ThemeToggle showLabel={false} className="h-10 rounded-[calc(var(--radius-control)-2px)] border-border/70 bg-card/85 px-0" />
            </div>
            <Button
              asChild
              variant="outline"
              className="dashboard-profile-chip gap-3 pl-2.5 pr-4"
            >
              <Link href={resolvedProfileHref} aria-label="Profile and settings">
                <Image
                  src={resolvedImage}
                  alt="Profile"
                  width={32}
                  height={32}
                  unoptimized
                  className="size-8 rounded-full object-cover"
                  onError={(event) => {
                    event.currentTarget.src = PROFILE_PLACEHOLDER_IMAGE;
                  }}
                />
                <span className="flex flex-col items-start leading-none">
                  <span className="max-w-[220px] truncate text-sm font-semibold text-foreground">
                    {currentUser?.fullName || "User"}
                  </span>
                  <span className="mt-1 text-[10px] text-muted-foreground capitalize">
                    {(currentUser?.role || workspaceLabel).replaceAll("_", " ")}
                  </span>
                </span>
              </Link>
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="h-10 rounded-[calc(var(--radius-control)-2px)] px-3 text-muted-foreground hover:bg-accent/55 hover:text-foreground"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              <LogOut className="size-4.5" />
              <span className="hidden 2xl:inline">{isLoggingOut ? "Logging out..." : "Logout"}</span>
            </Button>
          </div>

          <div className="flex items-center gap-2 xl:hidden">
            <ThemeToggle showLabel={false} className="px-0" />
            <Sheet open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Open navigation menu"
                >
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="flex w-full max-w-[94vw] flex-col gap-6 border-l border-border/80 bg-card p-5 shadow-2xl sm:w-[380px]"
              >
                <SheetHeader>
                  <SheetTitle className="text-left text-base font-semibold tracking-tight">Where to?</SheetTitle>
                  <SheetDescription className="text-left text-sm text-muted-foreground">
                    Navigate your workspace or manage your account.
                  </SheetDescription>
                </SheetHeader>

                <div className="dashboard-mobile-identity">
                  <Image
                    src={resolvedImage}
                    alt="Profile"
                    width={48}
                    height={48}
                    unoptimized
                    className="size-12 rounded-full object-cover"
                    onError={(event) => {
                      event.currentTarget.src = PROFILE_PLACEHOLDER_IMAGE;
                    }}
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">{currentUser?.fullName || "User"}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.12em] text-muted-foreground">
                      {workspaceLabel}
                    </p>
                  </div>
                </div>



                <div className="sm:hidden">
                  <CommandMenu
                    quickLinks={commandLinks}
                    settingsHref={settingsHref}
                    onLogout={handleLogout}
                    isLoggingOut={isLoggingOut}
                  />
                </div>

                <nav aria-label="Mobile navigation" className="dashboard-mobile-nav">
                  {visibleItems.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href ?? "#"}
                      onClick={() => setIsMobileNavOpen(false)}
                      className={cn(
                        "dashboard-mobile-nav-link",
                        isItemActive(pathname, item.href) && "dashboard-mobile-nav-link-active",
                        !item.href && "pointer-events-none opacity-50",
                      )}
                      aria-current={item.href && isItemActive(pathname, item.href) ? "page" : undefined}
                    >
                      <span>{item.label}</span>
                      <ChevronRight className="size-4 text-muted-foreground" />
                    </Link>
                  ))}
                </nav>

                <div className="mt-auto flex flex-col gap-2 border-t border-border/80 pt-4">
                  {notificationHref && (
                    <Button asChild variant="outline" className="justify-between">
                      <Link href={notificationHref} onClick={() => setIsMobileNavOpen(false)}>
                        <span className="inline-flex items-center gap-3">
                          <Bell className="size-4" />
                          Notifications
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {resolvedNotificationCount > 0 ? `${resolvedNotificationCount} new` : "All clear"}
                        </span>
                      </Link>
                    </Button>
                  )}
                  <Button asChild variant="outline" className="justify-start gap-3">
                    <Link href={settingsHref} onClick={() => setIsMobileNavOpen(false)}>
                      <Settings className="size-4" />
                      Settings
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    className="justify-start gap-3 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                  >
                    <LogOut className="size-4" />
                    {isLoggingOut ? "Logging out..." : "Logout"}
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div
          className={cn(
            "dashboard-nav-row",
            navRowMode === "hidden" && "dashboard-nav-row-hidden",
            navRowMode === "floating" && "dashboard-nav-row-floating",
            navRowMode === "docked" && "dashboard-nav-row-docked",
          )}
        >
          <nav aria-label="Primary navigation" className="dashboard-nav-cluster">
            <ul className="flex items-center gap-1.5 overflow-x-auto">
              {visibleItems.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href ?? "#"}
                    className={cn(
                      "dashboard-nav-link",
                      isItemActive(pathname, item.href) && "dashboard-nav-link-active",
                      !item.href && "cursor-default opacity-90",
                    )}
                    aria-disabled={!item.href}
                    aria-current={item.href && isItemActive(pathname, item.href) ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
