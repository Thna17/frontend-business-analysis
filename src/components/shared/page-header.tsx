"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface PageHeaderBreadcrumb {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  eyebrow?: string;
  breadcrumbs?: PageHeaderBreadcrumb[];
  className?: string;
}

const pageHeaderEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function PageHeader({ title, description, actions, eyebrow, breadcrumbs, className }: PageHeaderProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.header
      className={cn("dashboard-page-header", className)}
      initial={reduceMotion ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduceMotion ? { duration: 0.01 } : { duration: 0.44, ease: pageHeaderEase }}
    >
      <div className="dashboard-page-header-copy">
        {breadcrumbs?.length ? (
          <nav aria-label="Breadcrumb">
            <ol className="dashboard-breadcrumbs">
            {breadcrumbs.map((item, index) => (
              <li key={`${item.label}-${index}`} className="inline-flex items-center gap-2">
                {item.href ? (
                  <Link href={item.href} className="dashboard-breadcrumb-link">
                    {item.label}
                  </Link>
                ) : (
                  <span className="dashboard-breadcrumb-current">{item.label}</span>
                )}
                {index < breadcrumbs.length - 1 ? <span aria-hidden="true" className="text-muted-foreground/70">/</span> : null}
              </li>
            ))}
            </ol>
          </nav>
        ) : null}
        {eyebrow ? <span className="dashboard-eyebrow">{eyebrow}</span> : null}
        <div>
          <h1 className="dashboard-title">{title}</h1>
          {description && <p className="dashboard-subtitle mt-2 leading-[1.8]">{description}</p>}
        </div>
      </div>
      {actions ? <div className="dashboard-page-header-actions">{actions}</div> : null}
    </motion.header>
  );
}
