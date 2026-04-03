"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CalendarDays,
  Circle,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  Crown,
  CreditCard,
  Database,
  Download,
  FileSpreadsheet,
  FileText,
  Gem,
  Mail,
  Rocket,
  Search,
  ShieldCheck,
  Users,
  XCircle,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  useCancelSubscriptionMutation,
  useChangeSubscriptionPlanMutation,
  useGetSubscriptionDashboardQuery,
  useReactivateSubscriptionMutation,
  type SubscriptionDashboardResponse,
} from "@/store/api";

interface KhqrState {
  merchantName: string;
  bakongId: string;
  phone: string;
  city: string;
}

type UsageIcon = "users" | "reports" | "queries" | "storage";

interface UsageCard {
  title: string;
  value: string;
  note: string;
  progress: number;
  icon: UsageIcon;
}

type SwitchablePlanId = "free" | "pro" | "business";

type OwnerPlanTier = {
  id: string;
  name: string;
  subtitle: string;
  monthlyPrice: number;
  features: Array<{ text: string; disabled: boolean }>;
  users: number;
  priceLabel: string;
  perLabel: string;
  highlighted: boolean;
  badge: string;
  rank: number;
};

function usageIcon(icon: UsageIcon) {
  if (icon === "users") return <Users className="size-4 text-[#d4af35]" />;
  if (icon === "reports") return <FileText className="size-4 text-[#d4af35]" />;
  if (icon === "queries") return <Search className="size-4 text-[#d4af35]" />;
  return <Database className="size-4 text-[#d4af35]" />;
}

function isSwitchablePlanId(value: string): value is SwitchablePlanId {
  return value === "free" || value === "pro" || value === "business";
}

function planIcon(planId: string) {
  if (planId === "free") return <ShieldCheck className="size-8" />;
  if (planId === "pro") return <Rocket className="size-8" />;
  if (planId === "business") return <Crown className="size-8" />;
  return <Gem className="size-8" />;
}

function extractNumberFromPrice(raw: string): number {
  const numeric = Number(raw.replace(/[^0-9.-]/g, ""));
  return Number.isFinite(numeric) ? numeric : 0;
}

function formatMoney(value: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
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
      { title: "Active Users", value: "0 / 0", note: "No data", progress: 0, icon: "users" },
      { title: "Reports Generated", value: "0", note: "No data", progress: 0, icon: "reports" },
      { title: "Analytics Queries", value: "0", note: "No data", progress: 0, icon: "queries" },
      { title: "Storage Used", value: "0 GB", note: "No data", progress: 0, icon: "storage" },
    ];
  }

  const usersProgress = data.usage.activeUsers.limit > 0
    ? (data.usage.activeUsers.used / data.usage.activeUsers.limit) * 100
    : 0;
  const reportsProgress = data.usage.reportsGenerated.limit > 0
    ? (data.usage.reportsGenerated.used / data.usage.reportsGenerated.limit) * 100
    : 0;
  const queriesProgress = data.usage.analyticsQueries.limit > 0
    ? (data.usage.analyticsQueries.used / data.usage.analyticsQueries.limit) * 100
    : 0;
  const storageProgress = data.usage.storage.limitGb > 0
    ? (data.usage.storage.usedGb / data.usage.storage.limitGb) * 100
    : 0;

  return [
    {
      title: "Active Users",
      value: `${data.usage.activeUsers.used} / ${data.usage.activeUsers.limit}`,
      note: "Seats in current plan",
      progress: Math.min(100, Math.max(0, usersProgress)),
      icon: "users",
    },
    {
      title: "Reports Generated",
      value: String(data.usage.reportsGenerated.used),
      note: `Limit ${data.usage.reportsGenerated.limit} reports`,
      progress: Math.min(100, Math.max(0, reportsProgress)),
      icon: "reports",
    },
    {
      title: "Analytics Queries",
      value: `${data.usage.analyticsQueries.used.toLocaleString()}`,
      note: `Limit ${data.usage.analyticsQueries.limit.toLocaleString()}`,
      progress: Math.min(100, Math.max(0, queriesProgress)),
      icon: "queries",
    },
    {
      title: "Storage Used",
      value: `${data.usage.storage.usedGb.toFixed(2)} GB`,
      note: `${data.usage.storage.limitGb} GB available`,
      progress: Math.min(100, Math.max(0, storageProgress)),
      icon: "storage",
    },
  ];
}

function statusBadge(status: "active" | "expired" | "canceled") {
  if (status === "active") {
    return "bg-[#d7f2e3] text-[#067647]";
  }
  if (status === "expired") {
    return "bg-[#fef3d2] text-[#b67a08]";
  }
  return "bg-[#fff5f5] text-[#dc2626]";
}

export function SubscriptionsWorkspace() {
  const [page, setPage] = useState(1);
  const [openCardDialog, setOpenCardDialog] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [khqrOverride, setKhqrOverride] = useState<KhqrState | null>(null);
  const [khqrForm, setKhqrForm] = useState<KhqrState>({
    merchantName: "",
    bakongId: "",
    phone: "",
    city: "",
  });
  const [actionError, setActionError] = useState<string | null>(null);

  const {
    data,
    isFetching,
  } = useGetSubscriptionDashboardQuery({ page, limit: 3 });

  const [changePlan, { isLoading: isChangingPlan }] = useChangeSubscriptionPlanMutation();
  const [cancelSubscription, { isLoading: isCanceling }] = useCancelSubscriptionMutation();
  const [reactivateSubscription, { isLoading: isReactivating }] = useReactivateSubscriptionMutation();

  const khqr: KhqrState = khqrOverride ?? {
    merchantName: data?.paymentMethod.merchantName || "Syntrix Cambodia",
    bakongId: data?.paymentMethod.bakongId || "syntrix@aclb",
    phone: "+855 12 345 678",
    city: "Phnom Penh",
  };

  const activePlanId = data?.currentPlan.key ?? "free";
  const usage = mapUsageCards(data);

  const planTiers: OwnerPlanTier[] = ((data as unknown as { plans?: Array<Record<string, unknown>> })?.plans ?? [])
    .map((plan, index) => {
      const id = String(plan.id ?? plan.planKey ?? `custom-${index + 1}`);
      const monthlyPriceRaw =
        typeof plan.monthlyPrice === "number"
          ? plan.monthlyPrice
          : extractNumberFromPrice(String(plan.price ?? "0"));
      const suffix = String(plan.suffix ?? "/mo");
      const normalizedFeatures = Array.isArray(plan.features)
        ? plan.features
            .map((feature): { text: string; disabled: boolean } | null => {
              if (typeof feature === "string") return { text: feature, disabled: false };
              if (feature && typeof feature === "object" && "text" in feature) {
                const f = feature as { text?: unknown; disabled?: unknown };
                if (typeof f.text !== "string" || f.text.trim().length === 0) return null;
                return { text: f.text, disabled: Boolean(f.disabled) };
              }
              return null;
            })
            .filter((feature): feature is { text: string; disabled: boolean } => Boolean(feature))
        : [];

      return {
        id,
        name: String(plan.name ?? "Plan"),
        subtitle: String(plan.subtitle ?? ""),
        monthlyPrice: monthlyPriceRaw,
        features: normalizedFeatures,
        users: Number(plan.activeUsers ?? 0),
        priceLabel:
          monthlyPriceRaw === 0
            ? "Free"
            : formatMoney(monthlyPriceRaw, data?.paymentMethod.currency ?? "USD"),
        perLabel: monthlyPriceRaw === 0 ? "" : suffix,
        highlighted: Boolean(plan.highlighted),
        badge: String(plan.badge ?? ""),
        rank: Number(plan.rank ?? index),
      };
    })
    .sort((a, b) => a.rank - b.rank);

  const activePlanMeta = planTiers.find((plan) => plan.id === activePlanId);

  const khqrPayload = JSON.stringify({
    merchant: khqr.merchantName,
    bakongId: khqr.bakongId,
    phone: khqr.phone,
    city: khqr.city,
    reference: "syntrix-subscription-monthly",
  });

  const onSelectTier = useCallback(async (tierId: SwitchablePlanId) => {
    setActionError(null);
    try {
      await changePlan({ plan: tierId }).unwrap();
    } catch (error) {
      setActionError(normalizeError(error));
    }
  }, [changePlan]);

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

  const handleUpgrade = useCallback(async () => {
    await onSelectTier("pro");
  }, [onSelectTier]);

  useEffect(() => {
    const listener = () => {
      void handleUpgrade();
    };
    window.addEventListener("subscription:upgrade", listener);
    return () => window.removeEventListener("subscription:upgrade", listener);
  }, [handleUpgrade]);

  const onDownloadTaxForm = () => {
    const blob = new Blob(
      [
        [
          "Syntrix Tax Form",
          `Generated: ${new Date().toISOString()}`,
          `Plan: ${data?.currentPlan.name ?? "N/A"}`,
          `Status: ${data?.currentPlan.status ?? "N/A"}`,
          `Currency: ${data?.paymentMethod.currency ?? "USD"}`,
        ].join("\n"),
      ],
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

  const openUpdateCard = () => {
    setKhqrForm(khqr);
    setOpenCardDialog(true);
  };

  const saveCard = () => {
    if (!khqrForm.merchantName || !khqrForm.bakongId || !khqrForm.phone) return;
    setKhqrOverride(khqrForm);
    setOpenCardDialog(false);
  };

  return (
    <section className="grid gap-6 xl:grid-cols-[2fr_1fr]">
      <div className="space-y-6">
        <article className="dashboard-surface border-[#e7e9ee] p-5 shadow-none md:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-24 w-36 items-center justify-center rounded-2xl bg-[#d4af35] text-white">
                {planIcon(activePlanMeta?.id ?? activePlanId)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-semibold text-[#101828]">{data?.currentPlan.name ?? "Subscription"} Plan</h3>
                  <span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusBadge(data?.currentPlan.status ?? "active")}`}>
                    {(data?.currentPlan.status ?? "active").toUpperCase()}
                  </span>
                </div>
                <p className="mt-2 max-w-2xl text-sm text-[#475467]">{data?.currentPlan.description ?? "Loading plan..."}</p>
                <p className="mt-2 text-3xl font-semibold text-[#d4af35]">
                  {formatMoney(data?.currentPlan.monthlyPrice ?? 0, data?.paymentMethod.currency ?? "USD")}
                  <span className="ml-2 text-sm font-medium text-[#667085]">/ month</span>
                </p>
                <p className="mt-2 flex items-center gap-1 text-sm text-[#667085]">
                  <CalendarDays className="size-4" />
                  Next billing date:{" "}
                  <span className="font-semibold">{formatDate(data?.currentPlan.nextBillingDate ?? null)}</span>
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              className="h-11 rounded-full border-[#d4af35] px-5 text-sm text-[#9d7a10] hover:bg-[#fffaf0]"
              onClick={() => {
                const next: Record<string, "free" | "pro" | "business"> = {
                  free: "pro",
                  pro: "business",
                  business: "free",
                };
                void onSelectTier(next[activePlanId]);
              }}
              disabled={isChangingPlan}
            >
              Change Plan
            </Button>
          </div>
          {actionError ? <p className="mt-3 text-sm text-rose-600">{actionError}</p> : null}
        </article>

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
                  <div className="h-full rounded-full bg-[#d4af35]" style={{ width: `${item.progress}%` }} />
                </div>
                <p className="mt-2 text-sm text-[#667085]">{item.note}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="plan-tier-section">
          <div className="plan-tier-header">
            <h2>Subscription Plans</h2>
          </div>

          <div className="plan-tier-grid">
            {planTiers.map((tier) => {
              const active = tier.id === activePlanId;
              const showBadge = active ? "CURRENT PLAN" : tier.badge;

              return (
                <article
                  key={tier.id}
                  className={`plan-tier-card ${active || tier.highlighted ? "highlighted" : ""}`}
                >
                  {showBadge ? <div className="plan-tier-badge">{showBadge}</div> : null}

                  <h3>{tier.name}</h3>
                  <p className="plan-tier-subtitle">{tier.subtitle}</p>

                  <div className="plan-tier-price-row">
                    <span className="plan-tier-price">{tier.priceLabel}</span>
                    <span className="plan-tier-suffix">{tier.perLabel}</span>
                  </div>

                  <div className="plan-tier-users">
                    <span>Active Users</span>
                    <strong>{tier.users}</strong>
                  </div>

                  <ul className="plan-tier-features">
                    {tier.features.map((feature) => (
                      <li
                        key={`${tier.id}-${feature.text}`}
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
                    className={`plan-tier-manage-btn ${active || tier.highlighted ? "gold" : "light"}`}
                    onClick={() => {
                      if (!isSwitchablePlanId(tier.id)) return;
                      void onSelectTier(tier.id);
                    }}
                    disabled={isChangingPlan || !isSwitchablePlanId(tier.id)}
                  >
                    {active ? "In Use" : isSwitchablePlanId(tier.id) ? "Switch Plan" : "Managed by Admin"}
                  </button>
                </article>
              );
            })}
          </div>
        </section>

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
                      <td className="px-4 py-4 text-sm font-semibold text-[#101828]">#{row.id.slice(0, 8)}</td>
                      <td className="px-4 py-4 text-sm text-[#475467]">{row.plan}</td>
                      <td className="px-4 py-4 text-sm font-semibold text-[#101828]">{formatMoney(row.amount, row.currency)}</td>
                      <td className="px-4 py-4 text-sm text-[#475467]">{formatDate(row.date)}</td>
                      <td className="px-4 py-4">
                        <span className="inline-flex rounded-full bg-[#d7f2e3] px-3 py-1 text-sm font-semibold text-[#067647]">
                          {row.status}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <button type="button" onClick={() => onDownloadInvoice(row)} className="text-[#d4af35]">
                          <Download className="size-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {(data?.billingHistory ?? []).length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-sm text-[#667085]">
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

      <aside className="space-y-6">
        <article className="dashboard-surface border-[#e7e9ee] p-5 shadow-none">
          <h3 className="dashboard-section-title">Payment Method</h3>
          <div className="mt-4 rounded-3xl bg-gradient-to-br from-[#111827] via-[#1f2937] to-[#0f172a] p-5 text-white">
            <div className="mb-4 flex items-center justify-between">
              <div className="inline-flex items-center gap-2">
                <CreditCard className="size-5" />
                <span className="text-sm font-semibold tracking-[0.08em] uppercase">Bakong KHQR</span>
              </div>
              <span className="rounded-full bg-emerald-500/20 px-2 py-1 text-xs font-semibold text-emerald-300">
                Ready
              </span>
            </div>
            <div className="grid grid-cols-[120px_1fr] gap-4">
              <div>
                <div className="overflow-hidden rounded-xl border border-white/20 bg-white p-2">
                  <QRCodeSVG value={khqrPayload} size={104} bgColor="#ffffff" fgColor="#111827" />
                </div>
              </div>
              <div className="space-y-2">
                <div>
                  <p className="text-[11px] tracking-[0.16em] text-white/60 uppercase">Merchant</p>
                  <p className="text-sm font-semibold">{khqr.merchantName}</p>
                </div>
                <div>
                  <p className="text-[11px] tracking-[0.16em] text-white/60 uppercase">Bakong ID</p>
                  <p className="text-xs">{khqr.bakongId}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[11px] tracking-[0.16em] text-white/60 uppercase">Phone</p>
                    <p className="text-xs">{khqr.phone}</p>
                  </div>
                  <div>
                    <p className="text-[11px] tracking-[0.16em] text-white/60 uppercase">City</p>
                    <p className="text-xs">{khqr.city}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            className="mt-4 h-11 w-full rounded-full border-[#dfe3e8] bg-white text-base text-[#344054]"
            onClick={openUpdateCard}
          >
            Update KHQR Account
          </Button>
        </article>

        <article className="dashboard-surface border-[#e7e9ee] p-5 shadow-none">
          <h3 className="dashboard-section-title">Quick Actions</h3>
          <div className="mt-4 space-y-3">
            <button
              type="button"
              onClick={onDownloadTaxForm}
              className="flex w-full items-center justify-between rounded-full border border-[#e4e7ec] bg-[#f8fafc] px-4 py-3 text-left text-base font-medium text-[#1f2937]"
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
              className="flex w-full items-center justify-between rounded-full border border-[#e4e7ec] bg-[#f8fafc] px-4 py-3 text-left text-base font-medium text-[#1f2937]"
            >
              <span className="inline-flex items-center gap-2">
                <CircleHelp className="size-4" />
                Contact Billing
              </span>
              <ChevronRight className="size-4 text-[#98a2b3]" />
            </button>

            <button
              type="button"
              onClick={() => setEmailNotifications((prev) => !prev)}
              className="flex w-full items-center justify-between rounded-full border border-[#e4e7ec] bg-[#f8fafc] px-4 py-3 text-left text-base font-medium text-[#1f2937]"
            >
              <span className="inline-flex items-center gap-2">
                <Mail className="size-4" />
                Email Notification Settings
              </span>
              <span className="text-sm text-[#667085]">{emailNotifications ? "ON" : "OFF"}</span>
            </button>

            {(data?.currentPlan.status ?? "active") === "canceled" ? (
              <button
                type="button"
                onClick={() => {
                  void onReactivate();
                }}
                disabled={isReactivating}
                className="flex w-full items-center justify-between rounded-full border border-[#d4af35] bg-[#fffaf0] px-4 py-3 text-left text-base font-medium text-[#8a6b0b]"
              >
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 className="size-4" />
                  Reactivate Subscription
                </span>
                <ChevronRight className="size-4 text-[#d4af35]" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  void onCancelSubscription();
                }}
                disabled={isCanceling}
                className="flex w-full items-center justify-between rounded-full border border-[#f7c7c7] bg-[#fff5f5] px-4 py-3 text-left text-base font-medium text-[#dc2626]"
              >
                <span className="inline-flex items-center gap-2">
                  <XCircle className="size-4" />
                  Cancel Subscription
                </span>
                <ChevronRight className="size-4 text-[#f87171]" />
              </button>
            )}
          </div>
        </article>

        <article className="dashboard-surface border-[#eadbb0] bg-[#f8f3e4] p-5 shadow-none">
          <CircleHelp className="size-8 text-[#b98a05]" />
          <h4 className="mt-4 text-xl font-semibold text-[#111827]">Need help?</h4>
          <p className="mt-2 text-base text-[#667085]">
            Check our knowledge base for answers to common billing questions.
          </p>
          <button type="button" className="mt-4 text-base font-semibold text-[#b98a05] underline">
            Visit Help Center
          </button>
          {isFetching ? <p className="mt-3 text-xs text-[#98a2b3]">Refreshing subscription data...</p> : null}
        </article>
      </aside>

      <Dialog open={openCardDialog} onOpenChange={setOpenCardDialog}>
        <DialogContent className="max-w-[560px] rounded-2xl border-[#e4e7ec]">
          <DialogHeader>
            <DialogTitle>Update Bakong KHQR</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-[#344054]" htmlFor="merchantName">
                Merchant Name
              </label>
              <Input
                id="merchantName"
                value={khqrForm.merchantName}
                onChange={(event) => setKhqrForm((prev) => ({ ...prev, merchantName: event.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <label className="text-sm font-medium text-[#344054]" htmlFor="bakongId">
                  Bakong ID
                </label>
                <Input
                  id="bakongId"
                  value={khqrForm.bakongId}
                  placeholder="merchant@aclb"
                  onChange={(event) => setKhqrForm((prev) => ({ ...prev, bakongId: event.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium text-[#344054]" htmlFor="phone">
                  Phone
                </label>
                <Input
                  id="phone"
                  value={khqrForm.phone}
                  placeholder="+855 12 345 678"
                  onChange={(event) => setKhqrForm((prev) => ({ ...prev, phone: event.target.value }))}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium text-[#344054]" htmlFor="city">
                City
              </label>
              <Input
                id="city"
                value={khqrForm.city}
                onChange={(event) => setKhqrForm((prev) => ({ ...prev, city: event.target.value }))}
              />
            </div>

            <div className="mt-2 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpenCardDialog(false)}>
                Cancel
              </Button>
              <Button className="bg-[#111827] text-white hover:bg-[#1f2937]" onClick={saveCard}>
                Save KHQR
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
