import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface DashboardDataTableProps {
  ariaLabel: string;
  caption: string;
  children: ReactNode;
  className?: string;
  tableClassName?: string;
  hiddenBelow?: "none" | "md";
}

export function DashboardDataTable({
  ariaLabel,
  caption,
  children,
  className,
  tableClassName,
  hiddenBelow = "none",
}: DashboardDataTableProps) {
  return (
    <div className={cn("dashboard-table-shell", hiddenBelow === "md" && "hidden md:block", className)}>
      <div className="dashboard-table-scroll" role="region" aria-label={ariaLabel} tabIndex={0}>
        <table className={cn("dashboard-table", tableClassName)}>
          <caption className="sr-only">{caption}</caption>
          {children}
        </table>
      </div>
    </div>
  );
}
