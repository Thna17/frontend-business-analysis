export type DashboardShellVariant = "owner" | "admin";

export interface DashboardNavItem {
  label: string;
  href?: string;
  requiredFeature?: string;
}

export interface DashboardShellConfig {
  variant: DashboardShellVariant;
  workspaceLabel: string;
  workspaceDescription: string;
  homeHref: string;
  items: DashboardNavItem[];
  settingsHref: string;
  profileHref: string;
  notificationHref: string;
  footerText: string;
}

const ownerDashboardShellConfig: DashboardShellConfig = {
  variant: "owner",
  workspaceLabel: "Owner Workspace",
  workspaceDescription: "Business analytics, revenue operations, and subscription control.",
  homeHref: "/owner",
  items: [
    { label: "Dashboard", href: "/owner" },
    { label: "Sales Records", href: "/sale-record" },
    { label: "Products", href: "/product" },
    { label: "Analytics", href: "/analytics", requiredFeature: "analytics.trend" },
    { label: "Subscriptions", href: "/subscriptions" },
    { label: "Reports", href: "/report", requiredFeature: "reports.export" },
  ],
  settingsHref: "/settings",
  profileHref: "/profile",
  notificationHref: "/notification",
  footerText: "© 2026 Syntrix Analytics. All rights reserved.",
};

const adminDashboardShellConfig: DashboardShellConfig = {
  variant: "admin",
  workspaceLabel: "Admin Console",
  workspaceDescription: "Platform oversight, subscription governance, and operational monitoring.",
  homeHref: "/admin",
  items: [
    { label: "Dashboard", href: "/admin" },
    { label: "Analytics", href: "/admin-analytics" },
    { label: "Subscriptions", href: "/admin/subscriptions" },
  ],
  settingsHref: "/admin-settings",
  profileHref: "/admin/profile",
  notificationHref: "/admin/notification",
  footerText: "© 2026 Syntrix Admin Console. All rights reserved.",
};

export function getDashboardShellConfig(variant: DashboardShellVariant): DashboardShellConfig {
  return variant === "admin" ? adminDashboardShellConfig : ownerDashboardShellConfig;
}

export function resolveDashboardShellVariant(pathname: string): DashboardShellVariant {
  if (
    pathname === "/admin"
    || pathname === "/admin-analytics"
    || pathname === "/admin-settings"
    || pathname.startsWith("/admin/")
  ) {
    return "admin";
  }

  return "owner";
}
