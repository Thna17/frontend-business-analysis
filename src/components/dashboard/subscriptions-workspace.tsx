"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  Crown,
  Database,
  Download,
  FileSpreadsheet,
  FileText,
  Gem,
  Lock,
  Mail,
  Rocket,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardDataTable } from "@/components/shared/dashboard-data-table";
import { PageSummaryStrip } from "@/components/shared/page-summary-strip";
import { StateMessage } from "@/components/shared/state-message";
import { getApiErrorMessage } from "@/lib/api-error";
import {
  useCancelSubscriptionMutation,
  useGetSubscriptionDashboardQuery,
  useReactivateSubscriptionMutation,
  type SubscriptionDashboardResponse,
  type SubscriptionPlanKey,
} from "@/store/api";

type UsageIcon = "users" | "reports" | "queries" | "storage";

interface UsageCard {
  title: string;
  value: string;
  note: string;
  progress: number;
  progressColor: string;
  icon: UsageIcon;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function usageIcon(icon: UsageIcon) {
  const cls = "size-4 text-primary";
  if (icon === "users") return <Users className={cls} />;
  if (icon === "reports") return <FileText className={cls} />;
  if (icon === "queries") return <Search className={cls} />;
  return <Database className={cls} />;
}

function planIcon(planId: string) {
  if (planId === "free") return <ShieldCheck className="size-8" />;
  if (planId === "pro") return <Rocket className="size-8" />;
  if (planId === "business") return <Crown className="size-8" />;
  return <Gem className="size-8" />;
}

function formatMoney(value: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatDate(value: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

function mapUsageCards(data?: SubscriptionDashboardResponse): UsageCard[] {
  if (!data) {
    return [
      { title: "Active Users", value: "0", note: "No data", progress: 0, progressColor: "var(--primary)", icon: "users" },
      { title: "Reports Generated", value: "0", note: "No data", progress: 0, progressColor: "var(--primary)", icon: "reports" },
      { title: "Analytics Queries", value: "0", note: "No data", progress: 0, progressColor: "var(--primary)", icon: "queries" },
      { title: "Storage Used", value: "0 GB", note: "No data", progress: 0, progressColor: "var(--primary)", icon: "storage" },
    ];
  }

  const u = data.usage;

  function pct(used: number, limit: number | null, unlimited: boolean): number {
    if (unlimited || !limit) return 0;
    return Math.min(100, Math.max(0, (used / limit) * 100));
  }

  function progressColor(p: number): string {
    if (p >= 90) return "rgb(239 68 68)";
    if (p >= 70) return "rgb(245 158 11)";
    return "var(--primary)";
  }

  const usersProgress = pct(u.activeUsers.used, u.activeUsers.limit, u.activeUsers.unlimited);
  const reportsProgress = pct(u.reportsGenerated.used, u.reportsGenerated.limit, u.reportsGenerated.unlimited);
  const queriesProgress = pct(u.analyticsQueries.used, u.analyticsQueries.limit, u.analyticsQueries.unlimited);
  const storageProgress = pct(u.storage.usedGb, u.storage.limitGb, u.storage.unlimited);

  return [
    {
      title: "Active Users",
      value: u.activeUsers.unlimited
        ? `${u.activeUsers.used} / ∞`
        : `${u.activeUsers.used} / ${u.activeUsers.limit ?? "—"}`,
      note: u.activeUsers.unlimited ? "Unlimited seats" : "Seats in current plan",
      progress: usersProgress,
      progressColor: progressColor(usersProgress),
      icon: "users",
    },
    {
      title: "Reports Generated",
      value: String(u.reportsGenerated.used),
      note: u.reportsGenerated.unlimited
        ? "Unlimited reports"
        : `Limit ${u.reportsGenerated.limit ?? "—"} reports`,
      progress: reportsProgress,
      progressColor: progressColor(reportsProgress),
      icon: "reports",
    },
    {
      title: "Analytics Queries",
      value: u.analyticsQueries.used.toLocaleString(),
      note: u.analyticsQueries.unlimited
        ? "Unlimited queries"
        : `Limit ${(u.analyticsQueries.limit ?? 0).toLocaleString()}`,
      progress: queriesProgress,
      progressColor: progressColor(queriesProgress),
      icon: "queries",
    },
    {
      title: "Storage Used",
      value: `${u.storage.usedGb.toFixed(2)} GB`,
      note: `${u.storage.limitGb} GB available`,
      progress: storageProgress,
      progressColor: progressColor(storageProgress),
      icon: "storage",
    },
  ];
}

function statusBadge(status: "active" | "expired" | "canceled") {
  if (status === "active") return "dashboard-status-positive";
  if (status === "expired") return "dashboard-status-warning";
  return "dashboard-inline-feedback-danger";
}

const PLAN_RANK: Record<string, number> = {
  free: 0,
  pro: 1,
  business: 2,
};

// ─── Component ────────────────────────────────────────────────────────────────

export function SubscriptionsWorkspace() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [billingToggle, setBillingToggle] = useState<"monthly" | "annual">("monthly");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);

  const { data, isFetching } = useGetSubscriptionDashboardQuery({ page, limit: 3 });
  const [cancelSubscription, { isLoading: isCanceling }] = useCancelSubscriptionMutation();
  const [reactivateSubscription, { isLoading: isReactivating }] = useReactivateSubscriptionMutation();

  const activePlanId = data?.currentPlan.key ?? "free";
  const usage = mapUsageCards(data);
  const plans = data?.plans ?? [];

  // ── Billing toggle: resolve what price to show ────────────────────────────
  const effectiveBillingToggle = billingToggle;

  function displayPrice(plan: SubscriptionDashboardResponse["plans"][number]) {
    if (plan.monthlyPrice === 0) return "Free";
    const price = effectiveBillingToggle === "annual" ? plan.annualPrice : plan.monthlyPrice;
    return formatMoney(price, data?.paymentMethod.currency ?? "USD");
  }

  function displaySuffix(plan: SubscriptionDashboardResponse["plans"][number]) {
    if (plan.monthlyPrice === 0) return "";
    return effectiveBillingToggle === "annual" ? "/year" : "/month";
  }

  // ── Navigate to payment page ──────────────────────────────────────────────
  const handleUpgradePlan = useCallback(
    (targetPlan: SubscriptionPlanKey) => {
      if (targetPlan === "free") return;
      const params = new URLSearchParams({
        plan: targetPlan,
        billingCycle: effectiveBillingToggle,
      });
      router.push(`/payments?${params.toString()}`);
    },
    [router, effectiveBillingToggle],
  );

  const onCancelSubscription = async () => {
    setActionError(null);
    try {
      await cancelSubscription().unwrap();
    } catch (error) {
      setActionError(getApiErrorMessage(error, "Something went wrong. Please try again."));
    }
  };

  const onReactivate = async () => {
    setActionError(null);
    try {
      await reactivateSubscription().unwrap();
    } catch (error) {
      setActionError(getApiErrorMessage(error, "Something went wrong. Please try again."));
    }
  };

  // ── Compatibility: listen for legacy upgrade event ────────────────────────
  useEffect(() => {
    const listener = () => handleUpgradePlan("pro");
    window.addEventListener("subscription:upgrade", listener);
    return () => window.removeEventListener("subscription:upgrade", listener);
  }, [handleUpgradePlan]);

  // ── Invoice download ──────────────────────────────────────────────────────
  const onDownloadTaxForm = () => {
    const blob = new Blob(
      [[
        "Syntrix Analytics — Tax Form",
        `Generated: ${new Date().toISOString()}`,
        `Plan: ${data?.currentPlan.name ?? "N/A"}`,
        `Status: ${data?.currentPlan.status ?? "N/A"}`,
        `Billing Cycle: ${data?.currentPlan.billingCycle ?? "monthly"}`,
        `Currency: ${data?.paymentMethod.currency ?? "USD"}`,
      ].join("\n")],
      { type: "text/plain;charset=utf-8;" },
    );
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "syntrix-tax-form.txt";
    link.click();
    URL.revokeObjectURL(url);
  };

  const onContactBilling = () => {
    window.location.href = "mailto:billing@syntrix.io?subject=Billing%20Support%20Request";
  };

  const onDownloadInvoice = (row: SubscriptionDashboardResponse["billingHistory"][number]) => {
    const content = [
      `Invoice: #${row.id}`,
      `Plan: ${row.plan}`,
      `Amount: ${formatMoney(row.amount, row.currency)}`,
      `Date: ${formatDate(row.date)}`,
      `Status: ${row.status}`,
      `Provider: ${row.provider}`,
    ].join("\n");
    const blob = new Blob([content], { type: "text/plain;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `invoice-${row.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const activePlanRank = PLAN_RANK[activePlanId] ?? 0;

  return (
    <section className="grid gap-6 xl:grid-cols-[2fr_1fr]">
      {/* ── LEFT COLUMN ───────────────────────────────────────────────────── */}
      <div className="space-y-6">
        <PageSummaryStrip
          eyebrow="Billing Overview"
          title="Subscription health and billing status"
          description="See what plan is active, how you are billed, and whether your current usage is approaching plan limits before making changes."
          items={[
            {
              label: "Current Plan",
              value: `${data?.currentPlan.name ?? "Free"} Plan`,
              helper: data?.currentPlan.description ?? "Current subscription tier",
            },
            {
              label: "Status",
              value: (data?.currentPlan.status ?? "active").toUpperCase(),
              helper: data?.currentPlan.billingCycle === "annual" ? "Annual billing" : "Monthly billing",
            },
            {
              label: "Next Billing",
              value: formatDate(data?.currentPlan.nextBillingDate ?? null),
              helper: "Scheduled renewal date",
            },
            {
              label: "Payment Method",
              value: data?.paymentMethod.provider?.toUpperCase?.() ?? "Bakong",
              helper: `${data?.paymentMethod.currency ?? "USD"} checkout`,
            },
          ]}
        />

        {/* Current Plan Card */}
        <article className="billing-plan-hero">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <div className="billing-plan-icon">
                {planIcon(activePlanId)}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-2xl font-semibold text-foreground">
                    {data?.currentPlan.name ?? "—"} Plan
                  </h3>
                  <span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusBadge(data?.currentPlan.status ?? "active")}`}>
                    {(data?.currentPlan.status ?? "active").toUpperCase()}
                  </span>
                  {data?.currentPlan.billingCycle === "annual" && (
                    <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                      ANNUAL
                    </span>
                  )}
                </div>
                <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">
                  {data?.currentPlan.description ?? "Loading plan details..."}
                </p>
                <p className="mt-2 text-3xl font-semibold text-primary">
                  {data
                    ? formatMoney(data.currentPlan.effectivePrice, data.paymentMethod.currency)
                    : "—"}
                  <span className="ml-2 text-sm font-medium text-muted-foreground">
                    / {data?.currentPlan.billingCycle === "annual" ? "year" : "month"}
                  </span>
                </p>
                {data?.currentPlan.nextBillingDate ? (
                  <p className="mt-1.5 flex items-center gap-1 text-sm text-muted-foreground">
                    <CalendarDays className="size-4" />
                    Next billing:{" "}
                    <span className="font-semibold">{formatDate(data.currentPlan.nextBillingDate)}</span>
                  </p>
                ) : null}
              </div>
            </div>

            {activePlanId !== "business" && (
              <Button
                variant="outline"
                className="h-11 px-5 text-sm text-primary hover:bg-primary/10"
                onClick={() => handleUpgradePlan(
                  (["free", "pro", "business"] as SubscriptionPlanKey[]).find(
                    (p) => PLAN_RANK[p] === activePlanRank + 1,
                  ) ?? "pro",
                )}
              >
                Upgrade Plan
              </Button>
            )}
          </div>
          {actionError ? (
            <StateMessage
              tone="danger"
              title="Billing action was not completed"
              message={actionError}
              className="mt-4"
            />
          ) : null}
        </article>

        {/* Usage Metrics */}
        <section>
          <h3 className="mb-4 dashboard-section-title">Usage Metrics</h3>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {usage.map((item) => (
              <article key={item.title} className="billing-usage-card">
                <p className="text-sm font-semibold tracking-[0.08em] text-muted-foreground uppercase">{item.title}</p>
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-2xl font-semibold text-foreground">{item.value}</p>
                  {usageIcon(item.icon)}
                </div>
                <div className="billing-progress-track">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${item.progress}%`, background: item.progressColor }}
                  />
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{item.note}</p>
              </article>
            ))}
          </div>
          <div className="mt-4">
            <StateMessage
              tone="info"
              compact
              message="Use these limits as the operational threshold for seats, reporting volume, query load, and storage growth before upgrading."
            />
          </div>
        </section>

        {/* Subscription Plans */}
        <section className="plan-tier-section">
          {/* Header + billing toggle */}
          <div className="plan-tier-header flex items-center justify-between gap-4 flex-wrap mb-5">
            <div>
              <h2 className="text-2xl font-semibold text-foreground">Subscription Plans</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Upgrade anytime. Annual billing saves up to 2 months.
              </p>
            </div>

            {/* Monthly / Annual Toggle */}
            <div className="billing-plan-toggle">
              <button
                type="button"
                onClick={() => setBillingToggle("monthly")}
                className="billing-plan-toggle-button"
                data-active={billingToggle === "monthly"}
                aria-pressed={billingToggle === "monthly"}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setBillingToggle("annual")}
                className="billing-plan-toggle-button inline-flex items-center gap-1.5"
                data-active={billingToggle === "annual"}
                aria-pressed={billingToggle === "annual"}
              >
                Annual
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold tracking-wide text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                  SAVE UP TO 17%
                </span>
              </button>
            </div>
          </div>

          {/* Plans Grid */}
          <div className="plan-tier-grid">
            {plans.map((tier) => {
              const isActive = tier.id === activePlanId;
              const tierRank = PLAN_RANK[tier.id] ?? 0;
              const isDowngrade = tierRank < activePlanRank;
              const isUpgrade = tierRank > activePlanRank;
              const showBadge = isActive ? "CURRENT PLAN" : tier.badge;
              const isFree = tier.monthlyPrice === 0;

              const savings = billingToggle === "annual" && !isFree ? tier.annualSavings : 0;

              return (
                <article
                  key={tier.id}
                  className={`plan-tier-card ${isActive || tier.highlighted ? "highlighted" : ""}`}
                >
                  {showBadge ? <div className="plan-tier-badge">{showBadge}</div> : null}

                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      {planIcon(tier.id)}
                    </div>
                    <h3>{tier.name}</h3>
                  </div>
                  <p className="plan-tier-subtitle">{tier.subtitle}</p>

                  <div className="plan-tier-price-row">
                    <span className="plan-tier-price">{displayPrice(tier)}</span>
                    <span className="plan-tier-suffix">{displaySuffix(tier)}</span>
                  </div>

                  {billingToggle === "annual" && savings > 0 ? (
                    <div className="mt-1 flex items-center gap-1.5">
                      <Star className="size-3 text-emerald-700 dark:text-emerald-300" fill="currentColor" />
                      <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                        Save {formatMoney(savings, "USD")} per year
                      </span>
                    </div>
                  ) : null}

                  <div className="plan-tier-users">
                    <span>
                      {tier.limits.seats === -1 ? "Unlimited" : tier.limits.seats} seat{tier.limits.seats !== 1 ? "s" : ""}
                    </span>
                    <strong>
                      {tier.limits.storageGb} GB storage
                    </strong>
                  </div>

                  <ul className="plan-tier-features">
                    {tier.features.map((feature) => (
                      <li
                        key={`${tier.id}-${feature.text}`}
                        className={feature.disabled ? "disabled" : ""}
                      >
                        <span className="feature-dot" aria-hidden="true">
                          {feature.disabled ? (
                            <span className="inline-block size-2.5 rounded-full bg-border" />
                          ) : (
                            <CheckCircle2
                              className={`size-4 ${isActive || tier.highlighted ? "text-primary" : "text-emerald-700 dark:text-emerald-300"}`}
                            />
                          )}
                        </span>
                        {feature.text}
                      </li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    className={`plan-tier-manage-btn ${isActive || tier.highlighted ? "gold" : "light"} ${
                      isUpgrade ? "ring-2 ring-primary ring-offset-2" : ""
                    }`}
                    onClick={() => {
                      if (isActive) return;
                      if (isFree) return;
                      handleUpgradePlan(tier.id as SubscriptionPlanKey);
                    }}
                    disabled={isActive}
                  >
                    {isActive
                      ? "✓ Current Plan"
                      : isFree
                        ? "Downgrade to Free"
                        : isDowngrade
                          ? "Downgrade Plan"
                          : (
                            <span className="inline-flex items-center gap-1.5">
                              <Sparkles className="size-3.5" />
                              {billingToggle === "annual"
                                ? `Upgrade — ${displayPrice(tier)}/yr`
                                : `Upgrade — ${displayPrice(tier)}/mo`}
                            </span>
                          )}
                  </button>
                </article>
              );
            })}
          </div>

          {billingToggle === "annual" ? (
            <p className="mt-4 text-center text-xs text-muted-foreground">
              <Lock className="inline size-3 mr-1" />
              Annual plans are billed upfront. Cancel within 14 days for a full refund.
            </p>
          ) : null}
        </section>

        {/* Billing History */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="dashboard-section-title">Billing History</h3>
            <button
              type="button"
              className="text-sm font-medium text-primary"
              onClick={() => setPage((prev) => prev + 1)}
              disabled={isFetching}
              aria-label="Load more billing history rows"
            >
              View more →
            </button>
          </div>
          <article className="dashboard-surface overflow-hidden shadow-none">
            <DashboardDataTable
              ariaLabel="Billing history table"
              caption="Billing history with invoice id, plan, amount, date, status, and download action"
              tableClassName="min-w-[760px]"
            >
                <thead>
                  <tr>
                    <th className="px-4 py-4">Invoice ID</th>
                    <th className="px-4 py-4">Plan</th>
                    <th className="px-4 py-4">Amount</th>
                    <th className="px-4 py-4">Date</th>
                    <th className="px-4 py-4">Status</th>
                    <th className="px-4 py-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {(data?.billingHistory ?? []).map((row) => (
                    <tr key={row.id}>
                      <td className="px-4 py-4 text-sm font-semibold text-foreground">
                        #{row.id.slice(0, 8)}
                      </td>
                      <td className="px-4 py-4 text-sm text-muted-foreground capitalize">{row.plan}</td>
                      <td className="px-4 py-4 text-sm font-semibold text-foreground">
                        {formatMoney(row.amount, row.currency)}
                      </td>
                      <td className="px-4 py-4 text-sm text-muted-foreground">{formatDate(row.date)}</td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          row.status === "succeeded"
                            ? "dashboard-status-positive"
                            : row.status === "pending"
                              ? "dashboard-status-warning"
                              : "dashboard-inline-feedback-danger"
                        }`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <button
                          type="button"
                          onClick={() => onDownloadInvoice(row)}
                          className="text-primary hover:text-primary/70"
                          aria-label={`Download invoice ${row.id.slice(0, 8)}`}
                        >
                          <Download className="size-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {(data?.billingHistory ?? []).length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-10 text-center text-sm text-muted-foreground">
                        No billing transactions yet.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
            </DashboardDataTable>
          </article>
        </section>
      </div>

      {/* ── RIGHT COLUMN (Sidebar) ─────────────────────────────────────────── */}
      <aside className="space-y-6">
        {isFetching ? (
          <StateMessage
            tone="loading"
            title="Refreshing subscription data"
            message="Plan status, invoices, and usage metrics are updating in the background."
          />
        ) : null}

        {/* Quick Actions */}
        <article className="dashboard-surface p-5 shadow-none">
          <h3 className="dashboard-section-title">Quick Actions</h3>
          <div className="mt-4 space-y-3">
            <button
              type="button"
              onClick={onDownloadTaxForm}
              className="billing-quick-action"
            >
              <span className="inline-flex items-center gap-2">
                <FileSpreadsheet className="size-4" />
                Download Tax Form
              </span>
              <ChevronRight className="size-4 text-muted-foreground" />
            </button>

            <button
              type="button"
              onClick={onContactBilling}
              className="billing-quick-action"
            >
              <span className="inline-flex items-center gap-2">
                <CircleHelp className="size-4" />
                Contact Billing Support
              </span>
              <ChevronRight className="size-4 text-muted-foreground" />
            </button>

            <button
              type="button"
              onClick={() => setEmailNotifications((prev) => !prev)}
              className="billing-quick-action"
            >
              <span className="inline-flex items-center gap-2">
                <Mail className="size-4" />
                Email Notifications
              </span>
              <span className={`text-xs font-bold ${emailNotifications ? "text-emerald-700 dark:text-emerald-300" : "text-muted-foreground"}`}>
                {emailNotifications ? "ON" : "OFF"}
              </span>
            </button>

            {(data?.currentPlan.status ?? "active") === "canceled" ? (
              <button
                type="button"
                onClick={() => { void onReactivate(); }}
                disabled={isReactivating}
                className="billing-quick-action dashboard-quick-action-primary"
              >
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 className="size-4" />
                  Reactivate Subscription
                </span>
                <ChevronRight className="size-4 text-primary" />
              </button>
            ) : activePlanId !== "free" ? (
              <button
                type="button"
                onClick={() => { void onCancelSubscription(); }}
                disabled={isCanceling}
                className="billing-quick-action dashboard-quick-action-danger"
              >
                <span className="inline-flex items-center gap-2">
                  <XCircle className="size-4" />
                  Cancel Subscription
                </span>
                <ChevronRight className="size-4 text-destructive" />
              </button>
            ) : null}
          </div>
        </article>

        {/* Help Box */}
        <article className="billing-help-card">
          <CircleHelp className="size-8 text-primary" />
          <h4 className="mt-4 text-xl font-semibold text-foreground">Need help?</h4>
          <p className="mt-2 text-sm text-muted-foreground">
            Check our knowledge base for billing FAQ, plan comparisons, and payment guides.
          </p>
          <button type="button" className="mt-4 text-sm font-semibold text-primary underline">
            Visit Help Center →
          </button>
          {isFetching ? (
            <p className="mt-3 text-xs text-muted-foreground">Syncing subscription data...</p>
          ) : null}
        </article>
      </aside>
    </section>
  );
}
