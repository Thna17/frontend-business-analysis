"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Crown,
  Download,
  Lock,
  Rocket,
  Sparkles,
} from "lucide-react";
import TransactionDetails from "@/components/payments/success/TransactionDetails";
import { PLAN_DISPLAY_CONFIG } from "@/data/payment";
import { paymentSuccessInfo } from "@/data/payment-success";
import { getPaymentSuccessDetails } from "@/lib/payment-success";
import type { SubscriptionPlanKey } from "@/store/api";

type ReceiptRecord = {
  id: string;
  plan: string;
  amount: string;
  status: string;
  transactionDate: string;
  downloadedAt: string;
  fileName: string;
};

function escapePdfText(text: string) {
  return text.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function buildPdfContent(lines: string[]) {
  const body = ["BT", "/F1 12 Tf", "50 760 Td", "14 TL"];
  for (const line of lines) {
    body.push(`(${escapePdfText(line)}) Tj`);
    body.push("T*");
  }
  body.push("ET");
  return body.join("\n");
}

function buildPdfDocument(lines: string[]) {
  const contentStream = buildPdfContent(lines);
  const objects = [
    "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n",
    "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n",
    "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n",
    "4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n",
    `5 0 obj\n<< /Length ${contentStream.length} >>\nstream\n${contentStream}\nendstream\nendobj\n`,
  ];

  let pdf = "%PDF-1.4\n";
  const offsets = [0];

  for (const obj of objects) {
    offsets.push(pdf.length);
    pdf += obj;
  }

  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";

  for (let i = 1; i < offsets.length; i += 1) {
    pdf += `${offsets[i].toString().padStart(10, "0")} 00000 n \n`;
  }

  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  return pdf;
}

const RECEIPT_HISTORY_STORAGE_KEY = "syntrix.receiptHistory";

function readLocalReceipts(): ReceiptRecord[] {
  const existingRaw = localStorage.getItem(RECEIPT_HISTORY_STORAGE_KEY);

  if (!existingRaw) {
    return [];
  }

  try {
    const parsed = JSON.parse(existingRaw) as unknown;
    return Array.isArray(parsed) ? (parsed as ReceiptRecord[]) : [];
  } catch {
    return [];
  }
}

function appendLocalReceipt(record: ReceiptRecord) {
  const existing = readLocalReceipts();
  localStorage.setItem(
    RECEIPT_HISTORY_STORAGE_KEY,
    JSON.stringify([record, ...existing]),
  );
}

function planIcon(planId: string, className = "size-5") {
  if (planId === "pro") return <Rocket className={className} />;
  if (planId === "business") return <Crown className={className} />;
  return <Sparkles className={className} />;
}

export default function SuccessCard() {
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("");
  const { plan, billingCycle, formattedPlan, formattedAmount, providerLabel, transactionId } =
    getPaymentSuccessDetails(searchParams);
  const resolvedPlan = (plan in PLAN_DISPLAY_CONFIG ? plan : "pro") as SubscriptionPlanKey;
  const planConfig = PLAN_DISPLAY_CONFIG[resolvedPlan];
  const highlightedFeatures: Record<string, string[]> = {
    free: ["Basic analytics", "Starter reports", "Community support", "Single workspace"],
    pro: [
      "Trend, growth, and top product analytics",
      "Report export (PDF & CSV)",
      "Voice sales input",
      "Telegram notifications",
    ],
    business: [
      "Unlimited seats & queries",
      "100 GB storage",
      "Dedicated account manager",
      "AI-powered insights",
    ],
  };

  const onDownloadReceipt = async () => {
    const now = new Date();
    const timestamp = now.toISOString().replace(/[:.]/g, "-");
    const planSlug = formattedPlan
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const fileName = `syntrix-receipt-${planSlug || "plan"}-${timestamp}.pdf`;
    const receipt: ReceiptRecord = {
      id: `rcpt-${timestamp}`,
      plan: formattedPlan,
      amount: formattedAmount,
      status: "Paid",
      transactionDate: now.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      downloadedAt: now.toISOString(),
      fileName,
    };

    const lines = [
      "Syntrix Receipt",
      "",
      `Receipt ID: ${receipt.id}`,
      `Plan: ${receipt.plan}`,
      `Amount: ${receipt.amount}`,
      `Status: ${receipt.status}`,
      `Transaction Date: ${receipt.transactionDate}`,
      `Downloaded At: ${now.toLocaleString("en-US")}`,
    ];

    const pdfSource = buildPdfDocument(lines);
    const blob = new Blob([pdfSource], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);

    appendLocalReceipt(receipt);
    setMessage("Receipt downloaded and saved locally on this device.");
  };

  return (
    <section className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_360px]">
      <article className="dashboard-surface p-5 md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_16px_34px_-18px_color-mix(in_srgb,var(--primary)_90%,transparent)]">
              <Check className="size-6" />
            </div>

            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-foreground">
                <CheckCircle2 className="size-3.5 text-primary" />
                Payment confirmed
              </div>
              <h2 className="mt-4 text-[2rem] font-semibold tracking-[-0.05em] text-foreground">
                {paymentSuccessInfo.title}
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-7 text-muted-foreground">
                {formattedPlan} is active. {formattedAmount} was received via {providerLabel}.
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card px-4 py-2 text-sm font-medium text-foreground">
            <span className="text-muted-foreground">Status</span>
            <span>Paid</span>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card px-4 py-2 text-sm font-medium text-foreground">
            <span className="text-muted-foreground">{planConfig.name}</span>
            <span>{billingCycle === "annual" ? "Annual" : "Monthly"}</span>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card px-4 py-2 text-sm font-medium text-foreground">
            <span className="text-muted-foreground">Provider</span>
            <span>{providerLabel}</span>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/8 px-4 py-2 text-sm font-semibold text-foreground">
            <span className="text-muted-foreground">Amount</span>
            <span>{formattedAmount}</span>
          </div>
        </div>

        {transactionId ? (
          <div className="mt-6 rounded-[calc(var(--radius-panel)-6px)] border border-border/70 bg-card/70 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              Transaction reference
            </p>
            <p className="mt-2 break-all font-mono text-sm font-semibold text-foreground">
              {transactionId}
            </p>
          </div>
        ) : null}

        <div className="mt-6">
          <TransactionDetails />
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={paymentSuccessInfo.primaryButtonHref}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/92"
          >
            {paymentSuccessInfo.primaryButtonText}
            <ArrowRight className="size-4" />
          </Link>

          <button
            type="button"
            onClick={onDownloadReceipt}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-border/80 bg-card px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-accent/35"
          >
            <Download className="size-4" />
            {paymentSuccessInfo.secondaryButtonText}
          </button>
        </div>

        {message ? <p className="mt-3 text-sm text-muted-foreground">{message}</p> : null}

        <div className="mt-6 rounded-[calc(var(--radius-panel)-6px)] border border-border/70 bg-card/60 px-4 py-3 text-sm text-muted-foreground">
          {paymentSuccessInfo.helpText}{" "}
          <Link
            href={paymentSuccessInfo.helpLinkHref}
            className="font-semibold text-foreground transition-colors hover:text-primary"
          >
            {paymentSuccessInfo.helpLinkText}
          </Link>
        </div>
      </article>

      <aside className="space-y-6">
        <article className="dashboard-surface p-5 md:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-[calc(var(--radius-control)-4px)] border border-border/70 bg-primary/12 text-primary">
                {planIcon(resolvedPlan)}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">{planConfig.name} Plan</h2>
                <p className="text-sm text-muted-foreground">
                  {billingCycle === "annual" ? "Annual plan" : "Monthly plan"}
                </p>
              </div>
            </div>
            <span className="text-lg font-semibold text-foreground">{formattedAmount}</span>
          </div>

          <div className="mt-5 rounded-[calc(var(--radius-panel)-6px)] border border-border/70 bg-surface-subtle p-5">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  Total paid
                </p>
                <p className="mt-2 text-[2rem] font-semibold tracking-[-0.05em] text-foreground">
                  {formattedAmount}
                </p>
              </div>
              <span className="rounded-full border border-emerald-200/70 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
                Active
              </span>
            </div>
          </div>

          <div className="mt-5 space-y-2">
            {(highlightedFeatures[resolvedPlan] ?? []).map((feature) => (
              <div key={feature} className="flex items-start gap-2 text-sm leading-6 text-secondary-foreground">
                <CheckCircle2 className="mt-1 size-3.5 flex-shrink-0 text-primary" />
                <span>{feature}</span>
              </div>
            ))}
          </div>

          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-border/70 bg-card px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            <Lock className="size-3.5" />
            Secure 256-bit encryption
          </div>
        </article>
      </aside>
    </section>
  );
}
