"use client";

import { useMemo } from "react";
import { useGetAdminSubscriptionOverviewQuery } from "@/store/api";

type BillingEvent = {
  id: string;
  name: string;
  email: string;
  plan: "free" | "pro" | "business";
  amount: number;
  status: "pending" | "succeeded" | "failed";
  createdAt: string;
};

function getInitials(name: string) {
  if (!name) return "NA";

  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

  return `${parts[0][0] || ""}${parts[1][0] || ""}`.toUpperCase();
}

function formatStatus(status: BillingEvent["status"]) {
  if (status === "succeeded") return "Paid";
  if (status === "pending") return "Pending";
  return "Expired";
}

function formatStatusType(status: BillingEvent["status"]) {
  if (status === "succeeded") return "success";
  if (status === "pending") return "warning";
  return "danger";
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function BillingTable() {
  const { data: overview, isLoading, isError } = useGetAdminSubscriptionOverviewQuery();

  const billingEvents = useMemo<BillingEvent[]>(() => {
    const items = overview?.recentBillingEvents ?? [];

    return items.map((item) => ({
      id: item.id,
      name: item.subscriberName ?? "Unknown User",
      email: item.subscriberEmail ?? "-",
      plan: (item.plan === "business" || item.plan === "pro" ? item.plan : "free") as BillingEvent["plan"],
      amount: item.amount,
      status: (item.status === "succeeded" || item.status === "failed" ? item.status : "pending") as BillingEvent["status"],
      createdAt: item.createdAt,
    }));
  }, [overview?.recentBillingEvents]);

  return (
    <section className="billing-events-card">
      <div className="billing-events-header">
        <h2>Recent Billing Events</h2>
        <a href="#">View All Ledger</a>
      </div>

      <div className="billing-table-wrap">
        <table className="billing-table">
          <thead>
            <tr>
              <th>Subscriber</th>
              <th>Event Type</th>
              <th>Plan</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <tr><td colSpan={6}>Loading billing events...</td></tr>
            ) : null}
            {isError ? (
              <tr><td colSpan={6}>Unable to load billing events. Please verify admin session.</td></tr>
            ) : null}
            {!isLoading && !isError && billingEvents.length === 0 ? (
              <tr><td colSpan={6}>No billing events yet.</td></tr>
            ) : null}

            {!isLoading && !isError && billingEvents.map((event) => (
              <tr key={event.id}>
                <td>
                  <div className="subscriber-cell">
                    <div className="subscriber-avatar">
                      {getInitials(event.name)}
                    </div>
                    <div>
                      <p className="subscriber-name">{event.name}</p>
                      <p className="subscriber-email">{event.email}</p>
                    </div>
                  </div>
                </td>

                <td>Subscription Payment</td>

                <td>
                  <span className={`plan-badge plan-${event.plan.toLowerCase()}`}>
                    {event.plan[0].toUpperCase() + event.plan.slice(1)}
                  </span>
                </td>

                <td className="billing-amount">
                  ${Number(event.amount || 0).toLocaleString()}
                </td>

                <td className="billing-date">{formatDate(event.createdAt)}</td>

                <td>
                  <span className={`status-pill ${formatStatusType(event.status)}`}>
                    <span className="status-dot">*</span>
                    {formatStatus(event.status)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="billing-load-more">LOAD MORE HISTORY ▼</div>
    </section>
  );
}
