"use client";

import { useRouter } from "next/navigation";
import { Lock, Sparkles, Zap } from "lucide-react";
import type { ReactNode } from "react";
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
    <div className={`flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-[#e4e7ec] bg-gradient-to-b from-[#f9fafb] to-white p-8 text-center ${className}`}>
      <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${isPremiumRequired ? "bg-[#f3f0ff]" : "bg-[#f3efe2]"}`}>
        {isPremiumRequired
          ? <Sparkles className="size-6 text-[#7c3aed]" />
          : <Zap className="size-6 text-[#d4af35]" />}
      </div>

      <div>
        <p className="text-lg font-semibold text-[#101828]">
          <Lock className="inline mr-1.5 size-4 text-[#98a2b3]" />
          {requiredLabel} is locked
        </p>
        <p className="mt-1 max-w-xs text-sm text-[#667085]">
          Upgrade to <strong>{requiredPlanLabel}</strong> to unlock this feature and get access to more powerful tools.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <span className="rounded-full border border-[#e4e7ec] bg-white px-3 py-1 text-xs font-semibold text-[#344054]">
          {requiredPlanLabel} Plan
        </span>
      </div>

      <button
        type="button"
        onClick={handleUpgrade}
        className="mt-1 rounded-full bg-[#d4af35] px-6 py-2.5 text-sm font-semibold text-[#101828] hover:bg-[#c9a62f] transition-colors"
      >
        Upgrade Now →
      </button>

      <p className="text-xs text-[#98a2b3]">
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
