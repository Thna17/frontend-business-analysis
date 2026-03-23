"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  CreditCard,
  Database,
  Download,
  FileSpreadsheet,
  FileText,
  Mail,
  Search,
  Users,
  XCircle,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  BillingHistoryItem,
  SubscriptionPlanTier,
  SubscriptionUsageMetric,
  subscriptionBillingHistory,
  subscriptionCurrentPlan,
  subscriptionPlanTiers,
  subscriptionUsageMetrics,
} from "@/features/owner-dashboard/dashboard-mock";

interface KhqrState {
  merchantName: string;
  bakongId: string;
  phone: string;
  city: string;
}

function usageIcon(icon: SubscriptionUsageMetric["icon"]) {
  if (icon === "users") return <Users className="size-4 text-[#d4af35]" />;
  if (icon === "reports") return <FileText className="size-4 text-[#d4af35]" />;
  if (icon === "queries") return <Search className="size-4 text-[#d4af35]" />;
  return <Database className="size-4 text-[#d4af35]" />;
}

function planButtonClass(tone: SubscriptionPlanTier["tone"], active: boolean) {
  if (active) return "bg-[#d4af35] text-[#101828] hover:bg-[#c39f2f]";
  if (tone === "outline") return "border-[#d4af35] text-[#8a6b0b] hover:bg-[#fffaf0]";
  return "border-[#111827] text-[#111827] hover:bg-[#f7f8fa]";
}

export function SubscriptionsWorkspace() {
  const [tiers] = useState(subscriptionPlanTiers);
  const [activeTierId, setActiveTierId] = useState("pro");
  const [usage, setUsage] = useState(subscriptionUsageMetrics);
  const [billingHistory] = useState(subscriptionBillingHistory);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [isCanceled, setIsCanceled] = useState(false);
  const [khqr, setKhqr] = useState<KhqrState>({
    merchantName: "Syntrix Cambodia",
    bakongId: "syntrix@aclb",
    phone: "+855 12 345 678",
    city: "Phnom Penh",
  });

  const [openCardDialog, setOpenCardDialog] = useState(false);
  const [khqrForm, setKhqrForm] = useState(khqr);

  const activeTier = useMemo(
    () => tiers.find((tier) => tier.id === activeTierId) ?? tiers[0],
    [tiers, activeTierId],
  );

  useEffect(() => {
    const handleUpgrade = () => {
      const next = tiers.find((tier) => tier.id === "pro") ?? tiers[0];
      setActiveTierId(next.id);
      setIsCanceled(false);
    };
    window.addEventListener("subscription:upgrade", handleUpgrade);
    return () => window.removeEventListener("subscription:upgrade", handleUpgrade);
  }, [tiers]);

  const onChangePlan = () => {
    const ordered = tiers.map((tier) => tier.id);
    const currentIndex = ordered.indexOf(activeTierId);
    const nextIndex = (currentIndex + 1) % ordered.length;
    setActiveTierId(ordered[nextIndex]);
  };

  const onSelectTier = (tierId: string) => {
    setActiveTierId(tierId);
    setIsCanceled(false);
  };

  const onDownloadTaxForm = () => {
    const blob = new Blob(
      [
        "Syntrix Tax Form\nYear: 2026\nCustomer: Alex Johnston\nPlan: Enterprise\nAmount: $8,500/mo\nStatus: Active",
      ],
      { type: "text/plain;charset=utf-8;" },
    );
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "syntrix-tax-form-2026.txt";
    link.click();
    URL.revokeObjectURL(url);
  };

  const onContactBilling = () => {
    window.location.href = "mailto:billing@syntrix.local?subject=Billing%20Support%20Request";
  };

  const onCancelSubscription = () => {
    setIsCanceled(true);
    setUsage((prev) =>
      prev.map((metric) =>
        metric.title === "Active Users" ? { ...metric, note: "Subscription canceled" } : metric,
      ),
    );
  };

  const onDownloadInvoice = (row: BillingHistoryItem) => {
    const content = [
      `Invoice: #${row.id}`,
      `Plan: ${row.plan}`,
      `Amount: $${row.amount.toFixed(2)}`,
      `Date: ${row.date}`,
      `Status: ${row.status}`,
    ].join("\n");
    const blob = new Blob([content], { type: "text/plain;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `invoice-${row.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const khqrPayload = useMemo(
    () =>
      JSON.stringify({
        merchant: khqr.merchantName,
        bakongId: khqr.bakongId,
        phone: khqr.phone,
        city: khqr.city,
        reference: "syntrix-subscription-monthly",
      }),
    [khqr],
  );

  const openUpdateCard = () => {
    setKhqrForm(khqr);
    setOpenCardDialog(true);
  };

  const saveCard = () => {
    if (!khqrForm.merchantName || !khqrForm.bakongId || !khqrForm.phone) return;
    setKhqr(khqrForm);
    setOpenCardDialog(false);
  };

  return (
    <section className="grid gap-6 xl:grid-cols-[2fr_1fr]">
      <div className="space-y-6">
        <article className="dashboard-surface border-[#e7e9ee] p-5 shadow-none md:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-24 w-36 items-center justify-center rounded-2xl bg-[#d4af35] text-white">
                <CircleHelp className="size-8" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-semibold text-[#101828]">{activeTier.name} Plan</h3>
                  <span className="rounded-full bg-[#f7e8b6] px-2 py-1 text-xs font-semibold text-[#8a6b0b]">
                    {isCanceled ? "CANCELED" : subscriptionCurrentPlan.status}
                  </span>
                </div>
                <p className="mt-2 max-w-2xl text-sm text-[#475467]">{subscriptionCurrentPlan.description}</p>
                <p className="mt-2 text-3xl font-semibold text-[#d4af35]">
                  {activeTier.priceLabel}
                  <span className="ml-2 text-sm font-medium text-[#667085]">
                    {activeTier.perLabel || "custom pricing"}
                  </span>
                </p>
                <p className="mt-2 flex items-center gap-1 text-sm text-[#667085]">
                  <CalendarDays className="size-4" />
                  Next billing date: <span className="font-semibold">{subscriptionCurrentPlan.nextBillingDate}</span>
                </p>
              </div>
            </div>
            <Button variant="outline" className="h-11 rounded-full border-[#d4af35] px-5 text-sm text-[#9d7a10] hover:bg-[#fffaf0]" onClick={onChangePlan}>
              Change Plan
            </Button>
          </div>
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

        <section>
          <h3 className="mb-4 dashboard-section-title">Subscription Plans</h3>
          <div className="grid gap-4 xl:grid-cols-3">
            {tiers.map((tier) => {
              const active = tier.id === activeTierId;
              return (
                <article
                  key={tier.id}
                  className={`dashboard-surface relative border p-5 shadow-none ${
                    active ? "border-[#d4af35]" : "border-[#e7e9ee]"
                  }`}
                >
                  {active ? (
                    <span className="absolute right-4 top-0 -translate-y-1/2 rounded-md bg-[#d4af35] px-3 py-1 text-xs font-semibold text-white">
                      CURRENT PLAN
                    </span>
                  ) : null}
                  <p className="text-sm font-semibold tracking-[0.08em] text-[#667085] uppercase">{tier.tier}</p>
                  <h4 className="mt-2 text-3xl font-semibold text-[#101828]">{tier.name}</h4>
                  <p className="mt-1 text-sm text-[#667085]">{tier.subtitle}</p>
                  <p className="mt-3 text-4xl font-semibold text-[#101828]">
                    {tier.priceLabel}
                    <span className="ml-1 text-base font-medium text-[#667085]">{tier.perLabel}</span>
                  </p>

                  <ul className="mt-5 space-y-2">
                    {tier.features.map((feature, index) => (
                      <li key={`${tier.id}-${index}`} className="flex items-center gap-2 text-sm text-[#344054]">
                        <CheckCircle2 className="size-4 text-[#9d7a10]" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Button
                    variant={active ? "default" : "outline"}
                    className={`mt-6 h-11 w-full rounded-xl text-sm ${planButtonClass(tier.tone, active)}`}
                    onClick={() => onSelectTier(tier.id)}
                  >
                    {active ? "In Use" : tier.cta}
                  </Button>
                </article>
              );
            })}
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="dashboard-section-title">Billing History</h3>
            <button type="button" className="text-sm font-medium text-[#d4af35]">
              View all →
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
                  {billingHistory.map((row) => (
                    <tr key={row.id}>
                      <td className="px-4 py-4 text-sm font-semibold text-[#101828]">#{row.id}</td>
                      <td className="px-4 py-4 text-sm text-[#475467]">{row.plan}</td>
                      <td className="px-4 py-4 text-sm font-semibold text-[#101828]">${row.amount.toFixed(2)}</td>
                      <td className="px-4 py-4 text-sm text-[#475467]">{row.date}</td>
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

            <button
              type="button"
              onClick={onCancelSubscription}
              className="flex w-full items-center justify-between rounded-full border border-[#f7c7c7] bg-[#fff5f5] px-4 py-3 text-left text-base font-medium text-[#dc2626]"
            >
              <span className="inline-flex items-center gap-2">
                <XCircle className="size-4" />
                Cancel Subscription
              </span>
              <ChevronRight className="size-4 text-[#f87171]" />
            </button>
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
