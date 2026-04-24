import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface PageSummaryItem {
  label: string;
  value: string;
  helper?: string;
  icon?: ReactNode;
}

interface PageSummaryStripProps {
  title?: string;
  description?: string;
  eyebrow?: string;
  actions?: ReactNode;
  items: PageSummaryItem[];
  className?: string;
}

export function PageSummaryStrip({
  title,
  description,
  eyebrow,
  actions,
  items,
  className,
}: PageSummaryStripProps) {
  return (
    <section className={cn("dashboard-page-summary", className)}>
      {(title || description || eyebrow || actions) ? (
        <div className="dashboard-page-summary-header">
          <div className="space-y-2.5">
            {eyebrow ? <span className="dashboard-eyebrow">{eyebrow}</span> : null}
            {title ? <h2 className="dashboard-title text-[1.8rem] md:text-[2.15rem]">{title}</h2> : null}
            {description ? <p className="dashboard-panel-description max-w-3xl">{description}</p> : null}
          </div>
          {actions ? <div className="dashboard-page-summary-actions">{actions}</div> : null}
        </div>
      ) : null}

      <div className="dashboard-page-summary-grid">
        {items.map((item) => (
          <article key={item.label} className="dashboard-page-summary-card">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                  {item.label}
                </p>
                <p className="mt-2 text-[1.45rem] font-semibold tracking-[-0.03em] text-foreground">
                  {item.value}
                </p>
              </div>
              {item.icon ? (
                <span className="inline-flex size-10 items-center justify-center rounded-[calc(var(--radius-control)-4px)] border border-border/70 bg-card text-muted-foreground">
                  {item.icon}
                </span>
              ) : null}
            </div>
            {item.helper ? (
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.helper}</p>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
