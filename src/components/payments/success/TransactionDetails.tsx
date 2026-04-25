"use client";

import { useSearchParams } from "next/navigation";
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
