import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface DashboardPanelProps {
  title?: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
  headerClassName?: string;
  contentClassName?: string;
}

export function DashboardPanel({
  title,
  description,
  action,
  children,
  className,
  bodyClassName,
  headerClassName,
  contentClassName,
}: DashboardPanelProps) {
  return (
    <section className={cn("dashboard-surface overflow-hidden", className)}>
      {title || description || action ? (
        <div className={cn("dashboard-panel-header", headerClassName)}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1.5">
              {title ? <h3 className="dashboard-panel-title">{title}</h3> : null}
              {description ? <p className="dashboard-panel-description">{description}</p> : null}
            </div>
            {action ? <div className="flex flex-wrap items-center gap-2">{action}</div> : null}
          </div>
        </div>
      ) : null}
      <div className={cn("dashboard-panel-body", bodyClassName, contentClassName)}>{children}</div>
    </section>
  );
}
