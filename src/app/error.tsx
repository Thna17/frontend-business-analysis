"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { BrandLogo } from "@/components/shared/brand-logo";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 py-10">
      <div className="w-full max-w-lg rounded-[calc(var(--radius-panel)+2px)] border border-border/80 bg-[color:var(--surface-elevated)] px-6 py-7 text-center shadow-[var(--shadow-surface)] sm:px-8 sm:py-8">
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

          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-destructive/20 bg-destructive/10 text-destructive shadow-[var(--shadow-control)]">
            <AlertTriangle className="size-6" aria-hidden="true" />
          </div>

          <div className="space-y-1.5">
            <p className="font-heading text-xl font-semibold tracking-[-0.03em] text-foreground">
              Something went wrong
            </p>
            <p className="text-sm leading-6 text-muted-foreground">
              The page failed to load correctly. Try again, or return home if the issue persists.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button type="button" onClick={reset}>
              <RefreshCw className="size-4" />
              Try again
            </Button>
            <Button type="button" variant="outline" asChild>
              <Link href="/">Back to home</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
