"use client";

import { ReactNode } from "react";
import { PageHeader, type PageHeaderBreadcrumb } from "@/components/shared/page-header";
import { useDashboardShell } from "@/components/dashboard/dashboard-shell";
import { cn } from "@/lib/utils";

interface DashboardPageProps {
  title?: string;
  description?: string;
  actions?: ReactNode;
  eyebrow?: string;
  breadcrumbs?: PageHeaderBreadcrumb[];
  header?: ReactNode;
  children: ReactNode;
  footer?: ReactNode | false;
  className?: string;
}

export function DashboardPage({
  title,
  description,
  actions,
  eyebrow,
  breadcrumbs,
  header,
  children,
  footer,
  className,
}: DashboardPageProps) {
  const shell = useDashboardShell();
  const shouldRenderDefaultHeader = Boolean(title || description || actions || eyebrow || breadcrumbs?.length);

  return (
    <main id="dashboard-main" tabIndex={-1} className={cn("dashboard-page-shell", className)}>
      <div className="dashboard-container dashboard-page-content">
      {header ?? (shouldRenderDefaultHeader ? (
        <PageHeader
          title={title ?? ""}
          description={description}
          actions={actions}
          eyebrow={eyebrow}
          breadcrumbs={breadcrumbs}
        />
      ) : null)}
      {children}
      {footer === false ? null : typeof footer === "string" ? (
        <footer className="dashboard-page-footer">{footer}</footer>
      ) : footer ? (
        footer
      ) : (
        <footer className="dashboard-page-footer">{shell.footerText}</footer>
      )}
      </div>
    </main>
  );
}
