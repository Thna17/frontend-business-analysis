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
  const cls = "size-4 text-[#d4af35]";
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

function normalizeError(error: unknown) {
  const payload = error as { data?: { message?: string } };
  return payload?.data?.message ?? "Something went wrong. Please try again.";
}

function mapUsageCards(data?: SubscriptionDashboardResponse): UsageCard[] {
  if (!data) {
    return [
      { title: "Active Users", value: "0", note: "No data", progress: 0, progressColor: "#d4af35", icon: "users" },
      { title: "Reports Generated", value: "0", note: "No data", progress: 0, progressColor: "#d4af35", icon: "reports" },
      { title: "Analytics Queries", value: "0", note: "No data", progress: 0, progressColor: "#d4af35", icon: "queries" },
      { title: "Storage Used", value: "0 GB", note: "No data", progress: 0, progressColor: "#d4af35", icon: "storage" },
    ];
  }

  const u = data.usage;

  function pct(used: number, limit: number | null, unlimited: boolean): number {
    if (unlimited || !limit) return 0;
    return Math.min(100, Math.max(0, (used / limit) * 100));
  }

  function progressColor(p: number): string {
    if (p >= 90) return "#ef4444";
    if (p >= 70) return "#f59e0b";
    return "#d4af35";
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
  if (status === "active") return "bg-[#d7f2e3] text-[#067647]";
  if (status === "expired") return "bg-[#fef3d2] text-[#b67a08]";
  return "bg-[#fff5f5] text-[#dc2626]";
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
      setActionError(normalizeError(error));
    }
  };

  const onReactivate = async () => {
    setActionError(null);
    try {
      await reactivateSubscription().unwrap();
    } catch (error) {
      setActionError(normalizeError(error));
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

        {/* Current Plan Card */}
        <article className="dashboard-surface border-[#e7e9ee] p-5 shadow-none md:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-24 w-36 items-center justify-center rounded-2xl bg-gradient-to-br from-[#d4af35] to-[#9d7a10] text-white">
                {planIcon(activePlanId)}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-2xl font-semibold text-[#101828]">
                    {data?.currentPlan.name ?? "—"} Plan
                  </h3>
                  <span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusBadge(data?.currentPlan.status ?? "active")}`}>
                    {(data?.currentPlan.status ?? "active").toUpperCase()}
                  </span>
                  {data?.currentPlan.billingCycle === "annual" && (
                    <span className="rounded-full bg-[#f0fdf4] px-2 py-1 text-xs font-semibold text-[#15803d]">
                      ANNUAL
                    </span>
                  )}
                </div>
                <p className="mt-1.5 max-w-2xl text-sm text-[#475467]">
                  {data?.currentPlan.description ?? "Loading plan details..."}
                </p>
                <p className="mt-2 text-3xl font-semibold text-[#d4af35]">
                  {data
                    ? formatMoney(data.currentPlan.effectivePrice, data.paymentMethod.currency)
                    : "—"}
                  <span className="ml-2 text-sm font-medium text-[#667085]">
                    / {data?.currentPlan.billingCycle === "annual" ? "year" : "month"}
                  </span>
                </p>
                {data?.currentPlan.nextBillingDate ? (
                  <p className="mt-1.5 flex items-center gap-1 text-sm text-[#667085]">
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
                className="h-11 rounded-full border-[#d4af35] px-5 text-sm text-[#9d7a10] hover:bg-[#fffaf0]"
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
          {actionError ? <p className="mt-3 rounded-xl bg-[#fff5f5] px-4 py-2 text-sm text-rose-600">{actionError}</p> : null}
        </article>

        {/* Usage Metrics */}
        <section>
          <h3 className="mb-4 dashboard-section-title">Usage Metrics</h3>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {usage.map((item) => (
              <article key={item.title} className="dashboard-surface border-[#e7e9ee] p-4 shadow-none">
                <p className="text-sm font-semibold tracking-[0.08em] text-[#667085] uppercase">{item.title}</p>
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-2xl font-semibold text-[#101828]">{item.value}</p>
                  {usageIcon(item.icon)}
                </div>
                <div className="mt-2 h-2 rounded-full bg-[#edf1f5]">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${item.progress}%`, background: item.progressColor }}
                  />
                </div>
                <p className="mt-2 text-sm text-[#667085]">{item.note}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Subscription Plans */}
        <section className="plan-tier-section">
          {/* Header + billing toggle */}
          <div className="plan-tier-header flex items-center justify-between gap-4 flex-wrap mb-5">
            <div>
              <h2 className="text-2xl font-semibold text-[#101828]">Subscription Plans</h2>
              <p className="mt-1 text-sm text-[#667085]">
                Upgrade anytime. Annual billing saves up to 2 months.
              </p>
            </div>

            {/* Monthly / Annual Toggle */}
            <div className="flex items-center gap-1 rounded-full border border-[#e4e7ec] bg-[#f9fafb] p-1">
              <button
                type="button"
                onClick={() => setBillingToggle("monthly")}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-all ${
                  billingToggle === "monthly"
                    ? "bg-white shadow-sm text-[#101828]"
                    : "text-[#667085] hover:text-[#344054]"
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setBillingToggle("annual")}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  billingToggle === "annual"
                    ? "bg-white shadow-sm text-[#101828]"
                    : "text-[#667085] hover:text-[#344054]"
                }`}
              >
                Annual
                <span className="rounded-full bg-[#d7f2e3] px-2 py-0.5 text-[10px] font-bold text-[#067647] tracking-wide">
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
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f3efe2] text-[#8a6a00]">
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
                      <Star className="size-3 text-[#067647]" fill="currentColor" />
                      <span className="text-xs font-semibold text-[#067647]">
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
                            <span className="inline-block size-2.5 rounded-full bg-[#d0d5dd]" />
                          ) : (
                            <CheckCircle2
                              className={`size-4 ${isActive || tier.highlighted ? "text-[#8d7007]" : "text-[#067647]"}`}
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
                      isUpgrade ? "ring-2 ring-[#d4af35] ring-offset-2" : ""
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
            <p className="mt-4 text-center text-xs text-[#98a2b3]">
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
              className="text-sm font-medium text-[#d4af35]"
              onClick={() => setPage((prev) => prev + 1)}
              disabled={isFetching}
            >
              View more →
            </button>
          </div>
          <article className="dashboard-surface overflow-hidden border-[#e7e9ee] shadow-none">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left">
                <thead className="bg-[#f5f6f8] text-xs font-semibold tracking-[0.06em] text-[#667085] uppercase">
                  <tr>
                    <th className="px-4 py-4">Invoice ID</th>
                    <th className="px-4 py-4">Plan</th>
                    <th className="px-4 py-4">Amount</th>
                    <th className="px-4 py-4">Date</th>
                    <th className="px-4 py-4">Status</th>
                    <th className="px-4 py-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eef1f4] bg-white">
                  {(data?.billingHistory ?? []).map((row) => (
                    <tr key={row.id}>
                      <td className="px-4 py-4 text-sm font-semibold text-[#101828]">
                        #{row.id.slice(0, 8)}
                      </td>
                      <td className="px-4 py-4 text-sm text-[#475467] capitalize">{row.plan}</td>
                      <td className="px-4 py-4 text-sm font-semibold text-[#101828]">
                        {formatMoney(row.amount, row.currency)}
                      </td>
                      <td className="px-4 py-4 text-sm text-[#475467]">{formatDate(row.date)}</td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          row.status === "succeeded"
                            ? "bg-[#d7f2e3] text-[#067647]"
                            : row.status === "pending"
                              ? "bg-[#fef3d2] text-[#b67a08]"
                              : "bg-[#fff5f5] text-[#dc2626]"
                        }`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <button
                          type="button"
                          onClick={() => onDownloadInvoice(row)}
                          className="text-[#d4af35] hover:text-[#9d7a10]"
                        >
                          <Download className="size-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {(data?.billingHistory ?? []).length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-10 text-center text-sm text-[#667085]">
                        No billing transactions yet.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </article>
        </section>
      </div>

      {/* ── RIGHT COLUMN (Sidebar) ─────────────────────────────────────────── */}
      <aside className="space-y-6">

        {/* Quick Actions */}
        <article className="dashboard-surface border-[#e7e9ee] p-5 shadow-none">
          <h3 className="dashboard-section-title">Quick Actions</h3>
          <div className="mt-4 space-y-3">
            <button
              type="button"
              onClick={onDownloadTaxForm}
              className="flex w-full items-center justify-between rounded-full border border-[#e4e7ec] bg-[#f8fafc] px-4 py-3 text-left text-sm font-medium text-[#1f2937] hover:bg-[#f1f3f6]"
            >
              <span className="inline-flex items-center gap-2">
                <FileSpreadsheet className="size-4" />
                Download Tax Form
              </span>
              <ChevronRight className="size-4 text-[#98a2b3]" />
            </button>

            <button
              type="button"
              onClick={onContactBilling}
              className="flex w-full items-center justify-between rounded-full border border-[#e4e7ec] bg-[#f8fafc] px-4 py-3 text-left text-sm font-medium text-[#1f2937] hover:bg-[#f1f3f6]"
            >
              <span className="inline-flex items-center gap-2">
                <CircleHelp className="size-4" />
                Contact Billing Support
              </span>
              <ChevronRight className="size-4 text-[#98a2b3]" />
            </button>

            <button
              type="button"
              onClick={() => setEmailNotifications((prev) => !prev)}
              className="flex w-full items-center justify-between rounded-full border border-[#e4e7ec] bg-[#f8fafc] px-4 py-3 text-left text-sm font-medium text-[#1f2937] hover:bg-[#f1f3f6]"
            >
              <span className="inline-flex items-center gap-2">
                <Mail className="size-4" />
                Email Notifications
              </span>
              <span className={`text-xs font-bold ${emailNotifications ? "text-[#067647]" : "text-[#667085]"}`}>
                {emailNotifications ? "ON" : "OFF"}
              </span>
            </button>

            {(data?.currentPlan.status ?? "active") === "canceled" ? (
              <button
                type="button"
                onClick={() => { void onReactivate(); }}
                disabled={isReactivating}
                className="flex w-full items-center justify-between rounded-full border border-[#d4af35] bg-[#fffaf0] px-4 py-3 text-left text-sm font-medium text-[#8a6b0b] hover:bg-[#fff6e6]"
              >
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 className="size-4" />
                  Reactivate Subscription
                </span>
                <ChevronRight className="size-4 text-[#d4af35]" />
              </button>
            ) : activePlanId !== "free" ? (
              <button
                type="button"
                onClick={() => { void onCancelSubscription(); }}
                disabled={isCanceling}
                className="flex w-full items-center justify-between rounded-full border border-[#f7c7c7] bg-[#fff5f5] px-4 py-3 text-left text-sm font-medium text-[#dc2626] hover:bg-[#fef0f0]"
              >
                <span className="inline-flex items-center gap-2">
                  <XCircle className="size-4" />
                  Cancel Subscription
                </span>
                <ChevronRight className="size-4 text-[#f87171]" />
              </button>
            ) : null}
          </div>
        </article>

        {/* Help Box */}
        <article className="dashboard-surface border-[#eadbb0] bg-[#f8f3e4] p-5 shadow-none">
          <CircleHelp className="size-8 text-[#b98a05]" />
          <h4 className="mt-4 text-xl font-semibold text-[#111827]">Need help?</h4>
          <p className="mt-2 text-sm text-[#667085]">
            Check our knowledge base for billing FAQ, plan comparisons, and payment guides.
          </p>
          <button type="button" className="mt-4 text-sm font-semibold text-[#b98a05] underline">
            Visit Help Center →
          </button>
          {isFetching ? (
            <p className="mt-3 text-xs text-[#98a2b3]">Syncing subscription data...</p>
          ) : null}
        </article>
      </aside>
    </section>
  );
}
