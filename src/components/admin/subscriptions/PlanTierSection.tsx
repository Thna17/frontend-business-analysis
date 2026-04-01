"use client";

import { useEffect, useMemo, useState } from "react";
import { Circle, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

type PlanCounts = {
  Free: number;
  Pro: number;
  Business: number;
};

type PlanFeature = {
  text: string;
  disabled?: boolean;
};

type PlanConfig = {
  id: "free" | "pro" | "business";
  countKey: keyof PlanCounts;
  name: string;
  subtitle: string;
  price: string;
  suffix: string;
  badge: string;
  highlighted: boolean;
  features: PlanFeature[];
};

const API_URL = "http://localhost:5000";
const STORAGE_KEY = "adminSubscriptionPlanConfigs";

const DEFAULT_PLANS: PlanConfig[] = [
  {
    id: "free",
    countKey: "Free",
    name: "Free",
    subtitle: "Basic features for getting started",
    price: "$0",
    suffix: "/month",
    badge: "",
    highlighted: false,
    features: [
      { text: "Basic analytics" },
      { text: "Limited dashboard access" },
      { text: "Community support" },
      { text: "Export reports", disabled: true },
      { text: "AI insights", disabled: true },
    ],
  },
  {
    id: "pro",
    countKey: "Pro",
    name: "Pro",
    subtitle: "Advanced features for growing teams",
    price: "$29",
    suffix: "/month",
    badge: "Popular",
    highlighted: true,
    features: [
      { text: "Advanced analytics" },
      { text: "Full dashboard access" },
      { text: "Priority support" },
      { text: "Export reports" },
      { text: "AI insights", disabled: true },
    ],
  },
  {
    id: "business",
    countKey: "Business",
    name: "Business",
    subtitle: "Enterprise-grade tools and automation",
    price: "$99",
    suffix: "/month",
    badge: "Best Value",
    highlighted: false,
    features: [
      { text: "Advanced analytics" },
      { text: "Full dashboard access" },
      { text: "Dedicated support" },
      { text: "Export reports" },
      { text: "AI insights" },
    ],
  },
];

export default function PlanTierSection() {
  const [planCounts, setPlanCounts] = useState<PlanCounts>({
    Free: 0,
    Pro: 0,
    Business: 0,
  });
  const [plans, setPlans] = useState<PlanConfig[]>(DEFAULT_PLANS);
  const [draftPlan, setDraftPlan] = useState<PlanConfig | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved) as PlanConfig[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        setPlans(parsed);
      }
    } catch (error) {
      console.error("Failed to parse saved subscription plan config:", error);
    }
  }, []);

  useEffect(() => {
    async function loadPlans() {
      try {
        const res = await fetch(`${API_URL}/api/admin/subscriptions/plans`, {
          cache: "no-store",
        });
        const result = await res.json();
        setPlanCounts(result);
      } catch (error) {
        console.error("Failed to load plan data:", error);
      }
    }

    loadPlans();
  }, []);

  const subscriptionPlans = useMemo(
    () =>
      plans.map((plan) => ({
        ...plan,
        users: planCounts[plan.countKey] ?? 0,
      })),
    [plans, planCounts],
  );

  const openEditor = (plan: PlanConfig) => {
    setDraftPlan({
      ...plan,
      features: plan.features.map((feature) => ({ ...feature })),
    });
  };

  const updateDraftField = (field: keyof PlanConfig, value: string) => {
    if (!draftPlan) return;
    setDraftPlan({ ...draftPlan, [field]: value });
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
      features: [...draftPlan.features, { text: "New feature" }],
    });
  };

  const savePlanChanges = () => {
    if (!draftPlan) return;

    const cleanedFeatures = draftPlan.features
      .map((feature) => ({ ...feature, text: feature.text.trim() }))
      .filter((feature) => feature.text.length > 0);

    const nextDraft = { ...draftPlan, features: cleanedFeatures };
    const nextPlans = plans.map((plan) =>
      plan.id === nextDraft.id ? nextDraft : plan,
    );

    setPlans(nextPlans);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextPlans));
    setDraftPlan(null);
  };

  return (
    <section className="plan-tier-section">
      <div className="plan-tier-header">
        <h2>Plan Tier Architecture</h2>
      </div>

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
                <li key={`${plan.id}-${feature.text}`} className={feature.disabled ? "disabled" : ""}>
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

      <Dialog open={Boolean(draftPlan)} onOpenChange={(open) => !open && setDraftPlan(null)}>
        <DialogContent className="max-w-[760px] rounded-2xl">
          <DialogHeader>
            <DialogTitle>Edit Plan</DialogTitle>
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
                    <div key={`${draftPlan.id}-feature-${index}`} className="grid grid-cols-[1fr_auto_auto] items-center gap-2">
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

              <div className="flex justify-end gap-2 pt-1">
                <Button type="button" variant="outline" onClick={() => setDraftPlan(null)}>
                  Cancel
                </Button>
                <Button type="button" className="bg-[#111827] text-white hover:bg-[#1f2937]" onClick={savePlanChanges}>
                  Save Changes
                </Button>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </section>
  );
}
