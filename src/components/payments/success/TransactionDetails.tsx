"use client";

import { useSearchParams } from "next/navigation";
import { transactionDetails } from "@/data/payment-success";

export default function TransactionDetails() {
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan");
  const billingCycle = searchParams.get("billingCycle");
  const amount = searchParams.get("amount");
  const currency = searchParams.get("currency") ?? "USD";
  const provider = searchParams.get("provider");
  const transactionId = searchParams.get("transactionId");

  const resolvedPlan = plan
    ? `${plan.charAt(0).toUpperCase()}${plan.slice(1)} Plan${billingCycle ? ` (${billingCycle === "annual" ? "Annual" : "Monthly"})` : ""}`
    : transactionDetails.plan;
  const resolvedAmount = amount
    ? new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(Number(amount))
    : transactionDetails.amount;
  const resolvedDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const resolvedStatus = "Paid";
  const providerLabel = provider === "aba_payway" ? "ABA PayWay Sandbox" : "Bakong KHQR";

  return (
    <div className="transaction-card">
      <p className="transaction-label">{transactionDetails.label}</p>

      <div className="transaction-grid">
        <div className="transaction-item">
          <span>Plan</span>
          <strong>{resolvedPlan}</strong>
        </div>

        <div className="transaction-item">
          <span>Amount</span>
          <strong>{resolvedAmount}</strong>
        </div>

        <div className="transaction-item">
          <span>Date</span>
          <strong>{resolvedDate}</strong>
        </div>

        <div className="transaction-item">
          <span>Provider</span>
          <strong>{providerLabel}</strong>
        </div>

        {transactionId ? (
          <div className="transaction-item transaction-item-wide">
            <span>Transaction</span>
            <strong>{transactionId}</strong>
          </div>
        ) : null}

        <div className="transaction-item">
          <span>Status</span>
          <span className="paid-badge">
            <span className="paid-badge-dot" />
            {resolvedStatus}
          </span>
        </div>
      </div>
    </div>
  );
}
