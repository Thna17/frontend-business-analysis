"use client";

import { useRouter } from "next/navigation";
import { Lock, Sparkles, Zap } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { useEntitlements } from "@/features/subscriptions/use-entitlements";

// ─── FeatureGate Component ────────────────────────────────────────────────────

interface FeatureGateProps {
  /** Feature key (must match PLAN_FEATURES on backend) */
  feature: string;
  /** Content to render if user has access */
  children: ReactNode;
  /** If true, render a full-page blurred overlay instead of replacing content */
  overlay?: boolean;
  /** Optional custom class for the gate blocker */
  className?: string;
}

export function FeatureGate({ feature, children, overlay = false, className = "" }: FeatureGateProps) {
  const router = useRouter();
  const entitlements = useEntitlements();

  const currentPlan = entitlements.currentPlan;
  const isAllowed = entitlements.canAccess(feature);

  if (isAllowed) {
    return <>{children}</>;
  }

  const requiredPlan = entitlements.requiredPlanForFeature(feature) ?? "pro";
  const requiredPlanLabel = entitlements.getPlanLabel(requiredPlan);
  const requiredLabel = feature.replace(/\./g, " ");
  const isPremiumRequired = requiredPlan !== "free";

  const handleUpgrade = () => {
    const params = new URLSearchParams({
      plan: requiredPlan,
      billingCycle: "monthly",
    });
    router.push(`/payments?${params.toString()}`);
  };

  const gateContent = (
    <div className={`flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-border/80 bg-gradient-to-b from-background to-surface-subtle p-8 text-center shadow-[var(--shadow-panel)] ${className}`}>
      <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${isPremiumRequired ? "bg-accent text-accent-foreground" : "bg-primary/12 text-primary"}`}>
        {isPremiumRequired
          ? <Sparkles className="size-6" />
          : <Zap className="size-6" />}
      </div>

      <div>
        <p className="text-lg font-semibold text-foreground">
          <Lock className="mr-1.5 inline size-4 text-muted-foreground" />
          {requiredLabel} is locked
        </p>
        <p className="mt-1 max-w-xs text-sm text-muted-foreground">
          Upgrade to <strong>{requiredPlanLabel}</strong> to unlock this feature and get access to more powerful tools.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <span className="rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold text-secondary-foreground">
          {requiredPlanLabel} Plan
        </span>
      </div>

      <Button
        type="button"
        onClick={handleUpgrade}
        variant="default"
        className="mt-1 rounded-full px-6"
      >
        Upgrade Now
      </Button>

      <p className="text-xs text-muted-foreground">
        You are on the <strong className="capitalize">{currentPlan}</strong> plan.
      </p>
    </div>
  );

  if (overlay) {
    return (
      <div className="relative">
        <div className="pointer-events-none select-none opacity-30 blur-[2px]">
          {children}
        </div>
        <div className="absolute inset-0 flex items-center justify-center px-4">
          {gateContent}
        </div>
      </div>
    );
  }

  return gateContent;
}
