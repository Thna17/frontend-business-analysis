"use client";

import { useMemo } from "react";
import { useGetSubscriptionDashboardQuery } from "@/store/api";

export function useEntitlements() {
  const { data, isLoading, isFetching } = useGetSubscriptionDashboardQuery({ page: 1, limit: 1 });

  return useMemo(() => {
    const currentPlan = data?.currentPlan.key ?? "free";
    const allowedFeatures = new Set(data?.currentPlan.features ?? []);
    const plans = data?.plans ?? [];

    const requiredPlanForFeature = (feature: string): string | null => {
      const match = [...plans]
        .sort((a, b) => a.rank - b.rank)
        .find((plan) => plan.featureKeys.includes(feature));
      return match?.id ?? null;
    };

    return {
      isLoading: isLoading || isFetching,
      currentPlan,
      plans,
      allowedFeatures,
      canAccess: (feature?: string) => !feature || allowedFeatures.has(feature),
      requiredPlanForFeature,
      getPlanLabel: (planKey: string | null) =>
        plans.find((plan) => plan.id === planKey)?.name ?? planKey ?? "Upgrade",
    };
  }, [data, isFetching, isLoading]);
}
