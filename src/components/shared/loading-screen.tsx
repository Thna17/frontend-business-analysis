"use client";

import { Loader2 } from "lucide-react";
import { BrandLogo } from "@/components/shared/brand-logo";
import { cn } from "@/lib/utils";

interface LoadingScreenProps {
  title?: string;
  description?: string;
  fullScreen?: boolean;
  className?: string;
}

export function LoadingScreen({
  title = "Just a moment",
  description = "Getting your workspace ready…",
  fullScreen = true,
  className,
}: LoadingScreenProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-background",
        fullScreen ? "flex min-h-screen items-center justify-center px-6 py-10" : "flex items-center justify-center px-4 py-8",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,color-mix(in_srgb,var(--primary)_10%,transparent)_0%,transparent_34%),radial-gradient(circle_at_bottom_right,color-mix(in_srgb,var(--foreground)_5%,transparent)_0%,transparent_30%)]"
      />
      <div className="relative w-full max-w-md rounded-[calc(var(--radius-panel)+2px)] border border-border/80 bg-[color:var(--surface-elevated)] px-6 py-7 text-center shadow-[var(--shadow-surface)] backdrop-blur-sm sm:px-8 sm:py-8">
        <div className="flex flex-col items-center gap-5">
          <BrandLogo
            href="/"
            size="sm"
            linkClassName="inline-flex rounded-[calc(var(--radius-control)-2px)] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/20"
            iconClassName="rounded-[14px]"
            showSubtitle
            subtitle="Analytics Platform"
            subtitleClassName="text-muted-foreground"
          />

          <div className="relative flex h-14 w-14 items-center justify-center rounded-full border border-primary/18 bg-primary/8 text-primary shadow-[var(--shadow-control)]">
            <span className="absolute inset-2 rounded-full border border-primary/12" />
            <Loader2 className="size-6 animate-spin" aria-hidden="true" />
          </div>

          <div className="space-y-1.5">
            <p className="font-heading text-xl font-semibold tracking-[-0.03em] text-foreground">
              {title}
            </p>
            <p className="text-sm leading-6 text-muted-foreground">{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
