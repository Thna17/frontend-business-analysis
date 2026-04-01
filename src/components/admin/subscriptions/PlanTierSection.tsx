"use client";

import { useMemo, useState } from "react";
import { Circle, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  useCreateAdminSubscriptionPlanMutation,
  useDeleteAdminSubscriptionPlanMutation,
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
  planKey: string;
  name: string;
  subtitle: string;
  price: string;
  suffix: string;
  badge: string;
  highlighted: boolean;
  features: PlanFeature[];
};

function toEditablePlan(input: {
  id: string;
  planKey: string;
  name: string;
  subtitle: string;
  price: string;
  suffix: string;
  badge: string;
  highlighted: boolean;
  features: PlanFeature[];
}): EditablePlan {
  return {
    id: input.id,
    planKey: input.planKey,
    name: input.name,
    subtitle: input.subtitle,
    price: input.price,
    suffix: input.suffix,
    badge: input.badge,
    highlighted: input.highlighted,
    features: input.features.map((feature) => ({ ...feature })),
  };
}

function createEmptyPlan(): EditablePlan {
  return {
    id: null,
    planKey: "custom",
    name: "New Plan",
    subtitle: "Describe this plan tier",
    price: "$49",
    suffix: "/month",
    badge: "",
    highlighted: false,
    features: [{ text: "Custom feature", disabled: false }],
  };
}

export default function PlanTierSection() {
  const { data: overview } = useGetAdminSubscriptionOverviewQuery();
  const {
    data: planConfigs,
    isLoading: isLoadingPlanConfigs,
    isError: isPlanConfigError,
  } = useGetAdminSubscriptionPlansQuery();
  const [createPlan, { isLoading: isCreating }] = useCreateAdminSubscriptionPlanMutation();
  const [updatePlan, { isLoading: isUpdating }] = useUpdateAdminSubscriptionPlanMutation();
  const [deletePlan, { isLoading: isDeleting }] = useDeleteAdminSubscriptionPlanMutation();
  const [draftPlan, setDraftPlan] = useState<EditablePlan | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const isSubmitting = isCreating || isUpdating || isDeleting;

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
        price: plan.price,
        suffix: plan.suffix,
        badge: plan.badge,
        highlighted: plan.highlighted,
        features: plan.features.map((feature) => ({
          text: feature.text,
          disabled: Boolean(feature.disabled),
        })),
      }),
    );
  };

  const openCreateModal = () => {
    setFormError(null);
    setDraftPlan(createEmptyPlan());
  };

  const updateDraftField = (
    field: "name" | "subtitle" | "price" | "suffix" | "badge",
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
    setDraftPlan({
      ...draftPlan,
      features: [...draftPlan.features, { text: "New feature", disabled: false }],
    });
  };

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
      name: draftPlan.name.trim(),
      subtitle: draftPlan.subtitle.trim(),
      price: draftPlan.price.trim(),
      suffix: draftPlan.suffix.trim(),
      badge: draftPlan.badge.trim(),
      highlighted: draftPlan.highlighted,
      features: cleanedFeatures,
    };

    try {
      if (draftPlan.id) {
        await updatePlan({ id: draftPlan.id, body: payload }).unwrap();
      } else {
        await createPlan(payload).unwrap();
      }

      setDraftPlan(null);
      setFormError(null);
    } catch {
      setFormError("Unable to save plan changes right now. Please try again.");
    }
  };

  const removePlan = async () => {
    if (!draftPlan?.id) return;
    if (
      draftPlan.planKey === "free" ||
      draftPlan.planKey === "pro" ||
      draftPlan.planKey === "business"
    ) {
      setFormError("Default plans cannot be deleted.");
      return;
    }

    try {
      await deletePlan(draftPlan.id).unwrap();
      setDraftPlan(null);
      setFormError(null);
    } catch {
      setFormError("Unable to delete this plan right now.");
    }
  };

  return (
    <section className="plan-tier-section">
      <div className="plan-tier-header">
        <h2>Plan Tier Architecture</h2>
        <Button
          type="button"
          variant="outline"
          className="rounded-full border-[#d0d5dd] px-5 text-sm font-semibold text-[#344054]"
          onClick={openCreateModal}
        >
          <Plus className="mr-1 size-4" />
          Add Plan Tier
        </Button>
      </div>

      {isLoadingPlanConfigs ? (
        <p className="px-2 text-sm text-[#667085]">Loading plan architecture...</p>
      ) : null}
      {isPlanConfigError ? (
        <p className="px-2 text-sm text-[#b42318]">
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
                <span className="plan-tier-price">{plan.price}</span>
                <span className="plan-tier-suffix">{plan.suffix}</span>
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
        <DialogContent className="max-w-[760px] rounded-2xl">
          <DialogHeader>
            <DialogTitle>{draftPlan?.id ? "Edit Plan" : "Create Plan"}</DialogTitle>
          </DialogHeader>

          {draftPlan ? (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#344054]" htmlFor="plan-name">
                    Plan Name
                  </label>
                  <Input
                    id="plan-name"
                    value={draftPlan.name}
                    onChange={(event) => updateDraftField("name", event.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#344054]" htmlFor="plan-badge">
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
                  <label className="text-sm font-medium text-[#344054]" htmlFor="plan-subtitle">
                    Subtitle
                  </label>
                  <Input
                    id="plan-subtitle"
                    value={draftPlan.subtitle}
                    onChange={(event) => updateDraftField("subtitle", event.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#344054]" htmlFor="plan-price">
                    Price
                  </label>
                  <Input
                    id="plan-price"
                    value={draftPlan.price}
                    onChange={(event) => updateDraftField("price", event.target.value)}
                    placeholder="$29"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#344054]" htmlFor="plan-suffix">
                    Suffix
                  </label>
                  <Input
                    id="plan-suffix"
                    value={draftPlan.suffix}
                    onChange={(event) => updateDraftField("suffix", event.target.value)}
                    placeholder="/month"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="inline-flex items-center gap-2 text-sm text-[#344054]">
                    <input
                      type="checkbox"
                      checked={draftPlan.highlighted}
                      onChange={(event) => toggleDraftHighlighted(event.target.checked)}
                    />
                    Highlight this plan
                  </label>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-[#344054]">Features</h4>
                  <Button type="button" variant="outline" size="sm" onClick={addFeature}>
                    <Plus className="mr-1 size-4" />
                    Add Feature
                  </Button>
                </div>

                <div className="max-h-[260px] space-y-2 overflow-y-auto rounded-xl border border-[#e4e7ec] p-3">
                  {draftPlan.features.map((feature, index) => (
                    <div
                      key={`${draftPlan.id ?? "new"}-feature-${index}`}
                      className="grid grid-cols-[1fr_auto_auto] items-center gap-2"
                    >
                      <Input
                        value={feature.text}
                        onChange={(event) => updateFeatureText(index, event.target.value)}
                      />
                      <label className="inline-flex items-center gap-1 text-xs text-[#667085]">
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
                        className="h-8 w-8 text-[#ef4444] hover:text-[#dc2626]"
                        onClick={() => removeFeature(index)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {formError ? <p className="text-sm font-medium text-[#b42318]">{formError}</p> : null}

              <div className="flex justify-between gap-2 pt-1">
                <div>
                  {draftPlan.id &&
                  draftPlan.planKey !== "free" &&
                  draftPlan.planKey !== "pro" &&
                  draftPlan.planKey !== "business" ? (
                    <Button
                      type="button"
                      variant="outline"
                      className="border-[#fecaca] text-[#b42318] hover:bg-[#fff1f2]"
                      onClick={removePlan}
                      disabled={isSubmitting}
                    >
                      Delete Plan
                    </Button>
                  ) : null}
                </div>

                <div className="flex gap-2">
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
                    className="bg-[#111827] text-white hover:bg-[#1f2937]"
                    onClick={savePlanChanges}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </section>
  );
}

