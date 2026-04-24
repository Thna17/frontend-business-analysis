"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Circle, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  useGetAdminSubscriptionOverviewQuery,
  useGetAdminSubscriptionPlansQuery,
  useUpdateAdminSubscriptionPlanMutation,
} from "@/store/api";

type PlanFeature = {
  text: string;
  disabled: boolean;
};

type EditablePlan = {
  id: string | null;
  planKey: "free" | "pro" | "business";
  name: string;
  subtitle: string;
  description: string;
  monthlyPrice: string;
  annualPrice: string;
  badge: string;
  highlighted: boolean;
  features: PlanFeature[];
  featureKeys: string;
  limits: {
    seats: string;
    productsLimit: string;
    salesRecordsPerMonth: string;
    reportsPerMonth: string;
    analyticsQueriesPerMonth: string;
    storageGb: string;
  };
};

const limitLabels: Record<keyof EditablePlan["limits"], string> = {
  seats: "Seats",
  productsLimit: "Products",
  salesRecordsPerMonth: "Sales / Month",
  reportsPerMonth: "Reports / Month",
  analyticsQueriesPerMonth: "Analytics / Month",
  storageGb: "Storage (GB)",
};

function toEditablePlan(input: {
  id: string;
  planKey: "free" | "pro" | "business";
  name: string;
  subtitle: string;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  badge: string;
  highlighted: boolean;
  features: PlanFeature[];
  featureKeys: string[];
  limits: {
    seats: number;
    productsLimit: number;
    salesRecordsPerMonth: number;
    reportsPerMonth: number;
    analyticsQueriesPerMonth: number;
    storageGb: number;
  };
}): EditablePlan {
  return {
    id: input.id,
    planKey: input.planKey,
    name: input.name,
    subtitle: input.subtitle,
    description: input.description,
    monthlyPrice: String(input.monthlyPrice),
    annualPrice: String(input.annualPrice),
    badge: input.badge,
    highlighted: input.highlighted,
    features: input.features.map((feature) => ({ ...feature })),
    featureKeys: input.featureKeys.join(", "),
    limits: {
      seats: String(input.limits.seats),
      productsLimit: String(input.limits.productsLimit),
      salesRecordsPerMonth: String(input.limits.salesRecordsPerMonth),
      reportsPerMonth: String(input.limits.reportsPerMonth),
      analyticsQueriesPerMonth: String(input.limits.analyticsQueriesPerMonth),
      storageGb: String(input.limits.storageGb),
    },
  };
}

export default function PlanTierSection() {
  const { data: overview } = useGetAdminSubscriptionOverviewQuery();
  const {
    data: planConfigs,
    isLoading: isLoadingPlanConfigs,
    isError: isPlanConfigError,
  } = useGetAdminSubscriptionPlansQuery();
  const [updatePlan, { isLoading: isUpdating }] = useUpdateAdminSubscriptionPlanMutation();
  const [draftPlan, setDraftPlan] = useState<EditablePlan | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [pendingFeatureFocusIndex, setPendingFeatureFocusIndex] = useState<number | null>(null);
  const featuresListRef = useRef<HTMLDivElement | null>(null);
  const isSubmitting = isUpdating;

  const subscriptionPlans = useMemo(() => {
    const planRows = overview?.planBreakdown ?? [];
    const activeByPlan = new Map(planRows.map((row) => [row.id, row.activeSubscribers]));
    const configs = planConfigs ?? [];

    return configs
      .slice()
      .sort((a, b) => a.rank - b.rank)
      .map((plan) => ({
        ...plan,
        users: activeByPlan.get(plan.planKey as "free" | "pro" | "business") ?? 0,
      }));
  }, [overview?.planBreakdown, planConfigs]);

  const openEditor = (plan: (typeof subscriptionPlans)[number]) => {
    setFormError(null);
    setDraftPlan(
      toEditablePlan({
        id: plan.id,
        planKey: plan.planKey,
        name: plan.name,
        subtitle: plan.subtitle,
        description: plan.description,
        monthlyPrice: plan.monthlyPrice,
        annualPrice: plan.annualPrice,
        badge: plan.badge,
        highlighted: plan.highlighted,
        features: plan.features.map((feature) => ({
          text: feature.text,
          disabled: Boolean(feature.disabled),
        })),
        featureKeys: plan.featureKeys,
        limits: plan.limits,
      }),
    );
  };

  const updateDraftField = (
    field: "name" | "subtitle" | "description" | "monthlyPrice" | "annualPrice" | "badge" | "featureKeys",
    value: string,
  ) => {
    if (!draftPlan) return;
    setDraftPlan({ ...draftPlan, [field]: value });
  };

  const toggleDraftHighlighted = (checked: boolean) => {
    if (!draftPlan) return;
    setDraftPlan({ ...draftPlan, highlighted: checked });
  };

  const updateFeatureText = (index: number, value: string) => {
    if (!draftPlan) return;
    const next = draftPlan.features.map((feature, i) =>
      i === index ? { ...feature, text: value } : feature,
    );
    setDraftPlan({ ...draftPlan, features: next });
  };

  const toggleFeatureDisabled = (index: number, checked: boolean) => {
    if (!draftPlan) return;
    const next = draftPlan.features.map((feature, i) =>
      i === index ? { ...feature, disabled: checked } : feature,
    );
    setDraftPlan({ ...draftPlan, features: next });
  };

  const removeFeature = (index: number) => {
    if (!draftPlan) return;
    const next = draftPlan.features.filter((_, i) => i !== index);
    setDraftPlan({ ...draftPlan, features: next });
  };

  const addFeature = () => {
    if (!draftPlan) return;
    const nextIndex = draftPlan.features.length;
    setDraftPlan({
      ...draftPlan,
      features: [...draftPlan.features, { text: "New feature", disabled: false }],
    });
    setPendingFeatureFocusIndex(nextIndex);
  };

  useEffect(() => {
    if (pendingFeatureFocusIndex === null) return;

    const frame = window.requestAnimationFrame(() => {
      const container = featuresListRef.current;
      const input = document.getElementById(`plan-feature-${pendingFeatureFocusIndex}`) as HTMLInputElement | null;

      if (container && input) {
        input.scrollIntoView({ behavior: "smooth", block: "nearest" });
        input.focus();
        input.select();
      }

      setPendingFeatureFocusIndex(null);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [draftPlan?.features.length, pendingFeatureFocusIndex]);

  const savePlanChanges = async () => {
    if (!draftPlan) return;

    const cleanedFeatures = draftPlan.features
      .map((feature) => ({ text: feature.text.trim(), disabled: Boolean(feature.disabled) }))
      .filter((feature) => feature.text.length > 0);

    if (draftPlan.name.trim().length === 0) {
      setFormError("Plan name is required.");
      return;
    }
    if (cleanedFeatures.length === 0) {
      setFormError("At least one feature is required.");
      return;
    }

    const payload = {
      planKey: draftPlan.planKey,
      name: draftPlan.name.trim(),
      subtitle: draftPlan.subtitle.trim(),
      description: draftPlan.description.trim(),
      monthlyPrice: Number(draftPlan.monthlyPrice),
      annualPrice: Number(draftPlan.annualPrice),
      badge: draftPlan.badge.trim(),
      highlighted: draftPlan.highlighted,
      features: cleanedFeatures,
      featureKeys: draftPlan.featureKeys.split(",").map((item) => item.trim()).filter(Boolean),
      limits: {
        seats: Number(draftPlan.limits.seats),
        productsLimit: Number(draftPlan.limits.productsLimit),
        salesRecordsPerMonth: Number(draftPlan.limits.salesRecordsPerMonth),
        reportsPerMonth: Number(draftPlan.limits.reportsPerMonth),
        analyticsQueriesPerMonth: Number(draftPlan.limits.analyticsQueriesPerMonth),
        storageGb: Number(draftPlan.limits.storageGb),
      },
    };

    try {
      if (!draftPlan.id) return;
      await updatePlan({ id: draftPlan.id, body: payload }).unwrap();

      setDraftPlan(null);
      setFormError(null);
    } catch {
      setFormError("Unable to save plan changes right now. Please try again.");
    }
  };

  return (
    <section className="plan-tier-section">
      <div className="plan-tier-header">
        <h2 className="dashboard-section-title">Plan Tier Architecture</h2>
        <p className="text-sm text-muted-foreground">Canonical plans are fixed to Free, Pro, and Business.</p>
      </div>

      {isLoadingPlanConfigs ? (
        <p className="px-2 text-sm text-muted-foreground">Loading plan architecture...</p>
      ) : null}
      {isPlanConfigError ? (
        <p className="px-2 text-sm text-destructive">
          Unable to load plan configuration from server.
        </p>
      ) : null}

      {!isLoadingPlanConfigs && !isPlanConfigError ? (
        <div className="plan-tier-grid">
          {subscriptionPlans.map((plan) => (
            <article
              key={plan.id}
              className={`plan-tier-card ${plan.highlighted ? "highlighted" : ""}`}
            >
              {plan.badge ? <div className="plan-tier-badge">{plan.badge}</div> : null}

              <button
                type="button"
                className="plan-tier-edit"
                aria-label={`Edit ${plan.name} plan`}
                onClick={() => openEditor(plan)}
              >
                <Pencil size={16} />
              </button>

              <h3>{plan.name}</h3>
              <p className="plan-tier-subtitle">{plan.subtitle}</p>

              <div className="plan-tier-price-row">
                <span className="plan-tier-price">${plan.monthlyPrice}</span>
                <span className="plan-tier-suffix">/month</span>
              </div>

              <div className="plan-tier-users">
                <span>Active Users</span>
                <strong>{plan.users}</strong>
              </div>

              <ul className="plan-tier-features">
                {plan.features.map((feature) => (
                  <li
                    key={`${plan.id}-${feature.text}`}
                    className={feature.disabled ? "disabled" : ""}
                  >
                    <span className="feature-dot" aria-hidden="true">
                      <Circle size={10} fill="currentColor" strokeWidth={1.8} />
                    </span>
                    {feature.text}
                  </li>
                ))}
              </ul>

              <button
                type="button"
                className={`plan-tier-manage-btn ${plan.highlighted ? "gold" : "light"}`}
                onClick={() => openEditor(plan)}
              >
                Manage Features
              </button>
            </article>
          ))}
        </div>
      ) : null}

      <Dialog open={Boolean(draftPlan)} onOpenChange={(open) => !open && setDraftPlan(null)}>
        <DialogContent className="max-h-[88vh] max-w-[1040px] overflow-y-auto rounded-2xl p-0">
          <DialogHeader>
            <div className="border-b border-border/70 px-6 py-5 md:px-7">
              <DialogTitle>{draftPlan?.id ? "Edit Plan" : "Create Plan"}</DialogTitle>
            </div>
          </DialogHeader>

          {draftPlan ? (
            <div className="space-y-6 px-6 py-6 md:px-7">
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="space-y-2">
                  <label className="dashboard-field-label" htmlFor="plan-name">
                    Plan Name
                  </label>
                  <Input
                    id="plan-name"
                    value={draftPlan.name}
                    onChange={(event) => updateDraftField("name", event.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="dashboard-field-label" htmlFor="plan-badge">
                    Badge (optional)
                  </label>
                  <Input
                    id="plan-badge"
                    value={draftPlan.badge}
                    onChange={(event) => updateDraftField("badge", event.target.value)}
                    placeholder="Popular"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="dashboard-field-label" htmlFor="plan-subtitle">
                    Subtitle
                  </label>
                  <Input
                    id="plan-subtitle"
                    value={draftPlan.subtitle}
                    onChange={(event) => updateDraftField("subtitle", event.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="dashboard-field-label" htmlFor="plan-monthly-price">
                    Monthly Price
                  </label>
                  <Input
                    id="plan-monthly-price"
                    value={draftPlan.monthlyPrice}
                    onChange={(event) => updateDraftField("monthlyPrice", event.target.value)}
                    placeholder="19"
                  />
                </div>

                <div className="space-y-2">
                  <label className="dashboard-field-label" htmlFor="plan-annual-price">
                    Annual Price
                  </label>
                  <Input
                    id="plan-annual-price"
                    value={draftPlan.annualPrice}
                    onChange={(event) => updateDraftField("annualPrice", event.target.value)}
                    placeholder="190"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="inline-flex items-center gap-2 text-sm text-foreground">
                    <input
                      type="checkbox"
                      checked={draftPlan.highlighted}
                      onChange={(event) => toggleDraftHighlighted(event.target.checked)}
                    />
                    Highlight this plan
                  </label>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="dashboard-field-label" htmlFor="plan-description">
                    Description
                  </label>
                  <Input
                    id="plan-description"
                    value={draftPlan.description}
                    onChange={(event) => updateDraftField("description", event.target.value)}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="dashboard-field-label" htmlFor="plan-feature-keys">
                    Feature Keys
                  </label>
                  <Input
                    id="plan-feature-keys"
                    value={draftPlan.featureKeys}
                    onChange={(event) => updateDraftField("featureKeys", event.target.value)}
                    placeholder="analytics.summary, reports.export"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {Object.entries(draftPlan.limits).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <label className="dashboard-field-label">
                      {limitLabels[key as keyof EditablePlan["limits"]]}
                    </label>
                    <Input
                      value={value}
                      onChange={(event) => {
                        setDraftPlan({
                          ...draftPlan,
                          limits: {
                            ...draftPlan.limits,
                            [key]: event.target.value,
                          },
                        });
                      }}
                    />
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-foreground">Features</h4>
                  <Button type="button" variant="outline" size="sm" onClick={addFeature}>
                    <Plus className="mr-1 size-4" />
                    Add Feature
                  </Button>
                </div>

                <div
                  ref={featuresListRef}
                  className="max-h-[260px] space-y-2 overflow-y-auto rounded-xl border border-border/80 p-3"
                >
                  {draftPlan.features.map((feature, index) => (
                    <div
                      key={`${draftPlan.id ?? "new"}-feature-${index}`}
                      className="grid gap-3 rounded-[calc(var(--radius-control)-2px)] border border-border/70 bg-card/70 p-3"
                    >
                      <Input
                        id={`plan-feature-${index}`}
                        value={feature.text}
                        onChange={(event) => updateFeatureText(index, event.target.value)}
                      />
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <label className="inline-flex items-center gap-1.5 whitespace-nowrap text-xs text-muted-foreground">
                          <input
                            type="checkbox"
                            checked={Boolean(feature.disabled)}
                            onChange={(event) => toggleFeatureDisabled(index, event.target.checked)}
                          />
                          Disabled
                        </label>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 shrink-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => removeFeature(index)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {formError ? <p className="text-sm font-medium text-destructive">{formError}</p> : null}

              <div className="flex justify-end gap-2 pt-1">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setDraftPlan(null)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    variant="dark"
                    onClick={savePlanChanges}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </Button>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </section>
  );
}
