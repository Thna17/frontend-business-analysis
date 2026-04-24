import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: ReactNode;
  eyebrow?: string;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
  compact?: boolean;
}

const emptyStateEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function EmptyState({ icon, eyebrow, title, description, action, className, compact = false }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: emptyStateEase }}
      className={cn("dashboard-empty-state", compact && "dashboard-empty-state-compact", className)}
    >
      {icon ? (
        <div className="dashboard-empty-state-icon-wrapper">
          <div className="dashboard-empty-state-icon-ring" aria-hidden="true" />
          <div className="dashboard-empty-state-icon">
            {icon}
          </div>
        </div>
      ) : null}
      {eyebrow ? <p className="dashboard-eyebrow">{eyebrow}</p> : null}
      <div className="mt-3 max-w-sm text-center">
        <h3 className="font-heading text-lg font-semibold tracking-[-0.025em] text-foreground">{title}</h3>
        <p className="mt-2 mb-6 text-sm leading-6 text-muted-foreground">{description}</p>
      </div>
      {action ? <div className="flex flex-wrap items-center justify-center gap-2.5">{action}</div> : null}
    </motion.div>
  );
}
