"use client";

import { useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { transactionDetails } from "@/data/payment-success";
import { getPaymentSuccessDetails } from "@/lib/payment-success";

export default function TransactionDetails() {
  const searchParams = useSearchParams();
  const {
    formattedPlan,
    formattedAmount,
    providerLabel,
    transactionId,
  } = getPaymentSuccessDetails(searchParams);

  const resolvedPlan = formattedPlan || transactionDetails.plan;
  const resolvedAmount = formattedAmount || transactionDetails.amount;
  const resolvedDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const resolvedStatus = "Paid";

  return (
    <div className="rounded-[calc(var(--radius-panel)-6px)] border border-border/70 bg-card/80 p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          {transactionDetails.label}
        </p>
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-foreground">
          <CheckCircle2 className="size-3.5 text-primary" />
          {resolvedStatus}
        </span>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-[calc(var(--radius-panel)-8px)] border border-border/70 bg-surface-subtle p-4">
          <p className="text-sm text-muted-foreground">Plan</p>
          <p className="mt-2 text-base font-semibold text-foreground">{resolvedPlan}</p>
        </div>

        <div className="rounded-[calc(var(--radius-panel)-8px)] border border-border/70 bg-surface-subtle p-4">
          <p className="text-sm text-muted-foreground">Amount</p>
          <p className="mt-2 text-base font-semibold text-foreground">{resolvedAmount}</p>
        </div>

        <div className="rounded-[calc(var(--radius-panel)-8px)] border border-border/70 bg-surface-subtle p-4">
          <p className="text-sm text-muted-foreground">Date</p>
          <p className="mt-2 text-base font-semibold text-foreground">{resolvedDate}</p>
        </div>

        <div className="rounded-[calc(var(--radius-panel)-8px)] border border-border/70 bg-surface-subtle p-4">
          <p className="text-sm text-muted-foreground">Provider</p>
          <p className="mt-2 text-base font-semibold text-foreground">{providerLabel}</p>
        </div>

        {transactionId ? (
          <div className="rounded-[calc(var(--radius-panel)-8px)] border border-border/70 bg-surface-subtle p-4 sm:col-span-2">
            <p className="text-sm text-muted-foreground">Transaction</p>
            <p className="mt-2 break-all font-mono text-sm font-semibold text-foreground">
              {transactionId}
            </p>
          </div>
        ) : null}

        <div className="rounded-[calc(var(--radius-panel)-8px)] border border-border/70 bg-surface-subtle p-4 sm:col-span-2">
          <p className="text-sm text-muted-foreground">Status</p>
          <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-emerald-200/70 bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
            <span className="size-2 rounded-full bg-emerald-500" />
            {resolvedStatus}
          </div>
        </div>
      </div>
    </div>
  );
}
