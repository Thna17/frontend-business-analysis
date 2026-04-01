"use client";

import { useEffect, useState } from "react";

type BillingEvent = {
  _id: string;
  name: string;
  email: string;
  plan: "Free" | "Pro" | "Business";
  amount: number;
  status: "active" | "expired" | "pending";
  createdAt: string;
};

const API_URL = "http://localhost:5000";

function getInitials(name: string) {
  if (!name) return "NA";

  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

  return `${parts[0][0] || ""}${parts[1][0] || ""}`.toUpperCase();
}

function formatStatus(status: string) {
  if (status === "active") return "Paid";
  if (status === "pending") return "Pending";
  return "Expired";
}

function formatStatusType(status: string) {
  if (status === "active") return "success";
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
  const [billingEvents, setBillingEvents] = useState<BillingEvent[]>([]);

  useEffect(() => {
    async function loadBilling() {
      try {
        const res = await fetch(`${API_URL}/api/admin/subscriptions/billing`, {
          cache: "no-store",
        });
        const result = await res.json();
        setBillingEvents(result);
      } catch (error) {
        console.error("Failed to load billing events:", error);
      }
    }

    loadBilling();
  }, []);

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
            {billingEvents.map((event) => (
              <tr key={`${event.name}-${event.createdAt}`}>
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
                    {event.plan}
                  </span>
                </td>

                <td className="billing-amount">
                  ${Number(event.amount || 0).toLocaleString()}
                </td>

                <td className="billing-date">{formatDate(event.createdAt)}</td>

                <td>
                  <span className={`status-pill ${formatStatusType(event.status)}`}>
                    <span className="status-dot">●</span>
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