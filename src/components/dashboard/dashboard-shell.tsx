"use client";

import { createContext, ReactNode, useContext, useMemo } from "react";
import { usePathname } from "next/navigation";
import { TopNavigation } from "@/components/dashboard/top-navigation";
import {
  type DashboardShellConfig,
  type DashboardShellVariant,
  getDashboardShellConfig,
  resolveDashboardShellVariant,
} from "@/features/navigation/dashboard-shell-config";

const DashboardShellContext = createContext<DashboardShellConfig | null>(null);

// Expose shell config without threading navigation props through each page.
export function useDashboardShell() {
  const context = useContext(DashboardShellContext);

  if (!context) {
    throw new Error("useDashboardShell must be used within DashboardShell");
  }

  return context;
}

interface DashboardShellProps {
  children: ReactNode;
  variant?: DashboardShellVariant | "auto";
}

// Shared dashboard frame that swaps nav config between owner and admin workspaces.
export function DashboardShell({ children, variant = "auto" }: DashboardShellProps) {
  const pathname = usePathname();
  const resolvedVariant = variant === "auto" ? resolveDashboardShellVariant(pathname) : variant;
  const config = useMemo(() => getDashboardShellConfig(resolvedVariant), [resolvedVariant]);

  return (
    <DashboardShellContext.Provider value={config}>
      <div className="dashboard-shell">
        <a href="#dashboard-main" className="dashboard-skip-link">Skip to main content</a>
        <div className="dashboard-shell-backdrop" aria-hidden="true" />
        <TopNavigation
          items={config.items}
          workspaceLabel={config.workspaceLabel}
          homeHref={config.homeHref}
          settingsHref={config.settingsHref}
          profileHref={config.profileHref}
          notificationHref={config.notificationHref}
        />
        <div className="dashboard-shell-content">
          {children}
        </div>
      </div>
    </DashboardShellContext.Provider>
  );
}
