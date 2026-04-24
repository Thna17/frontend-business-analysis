import { ReactNode } from "react";
import { EmptyState } from "@/components/shared/empty-state";
import { StateMessage } from "@/components/shared/state-message";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface DashboardChartFigureProps {
  ariaLabel: string;
  children?: ReactNode;
  className?: string;
  frameClassName?: string;
  isLoading?: boolean;
  loadingHeightClassName?: string;
  errorMessage?: string | null;
  errorTitle?: string;
  emptyState?: ReactNode;
  legend?: ReactNode;
}

export function DashboardChartFigure({
  ariaLabel,
  children,
  className,
  frameClassName,
  isLoading = false,
  loadingHeightClassName = "h-[260px]",
  errorMessage,
  errorTitle = "Chart data unavailable",
  emptyState,
  legend,
}: DashboardChartFigureProps) {
  return (
    <figure className={cn("dashboard-chart-frame", className, frameClassName)} aria-label={ariaLabel}>
      {isLoading ? (
        <div className={cn("grid gap-4", loadingHeightClassName)}>
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-full w-full rounded-[calc(var(--radius-panel)-8px)]" />
        </div>
      ) : errorMessage ? (
        <StateMessage tone="danger" title={errorTitle} message={errorMessage} />
      ) : emptyState ? (
        emptyState
      ) : (
        children
      )}
      {legend ? <figcaption>{legend}</figcaption> : null}
    </figure>
  );
}

interface DashboardChartLegendItem {
  label: string;
  dotClassName: string;
}

export function DashboardChartLegend({ items }: { items: DashboardChartLegendItem[] }) {
  return (
    <div className="dashboard-chart-legend" role="list" aria-label="Chart legend">
      {items.map((item) => (
        <span key={item.label} className="inline-flex items-center gap-2" role="listitem">
          <span className={cn("dashboard-chart-legend-dot", item.dotClassName)} />
          {item.label}
        </span>
      ))}
    </div>
  );
}

export function DashboardChartRail({ children }: { children: ReactNode }) {
  return <div className="dashboard-chart-rail">{children}</div>;
}

interface DashboardChartStatProps {
  label: string;
  value: ReactNode;
  copy: string;
}

export function DashboardChartStat({ label, value, copy }: DashboardChartStatProps) {
  return (
    <div className="dashboard-chart-stat">
      <p className="dashboard-chart-stat-label">{label}</p>
      <p className="dashboard-chart-stat-value">{value}</p>
      <p className="dashboard-chart-stat-copy">{copy}</p>
    </div>
  );
}

export function DashboardChartEmptyState({
  eyebrow,
  title,
  description,
  icon,
  className,
}: {
  eyebrow: string;
  title: string;
  description: string;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <EmptyState
      eyebrow={eyebrow}
      icon={icon}
      title={title}
      description={description}
      compact
      className={cn("justify-center", className)}
    />
  );
}
