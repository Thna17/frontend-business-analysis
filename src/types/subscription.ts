import type { LucideIcon } from "lucide-react";

/* =========================
   STATS
========================= */
export type SubscriptionStat = {
  title: string;
  value: string;
  change: string;
  note: string;
  positive: boolean;
  icon: LucideIcon; // FIXED HERE
};

/* =========================
   CHART
========================= */
export type SubscriptionChartItem = {
  month: string;
  value: number;
};

/* =========================
   PLANS
========================= */
export type SubscriptionPlan = {
  name: string;
  subtitle: string;
  price: string;
  suffix: string;
  users: string;
  features: {
    text: string;
    disabled: boolean;
  }[];
  highlighted: boolean;
  badge: string;
};

/* =========================
   BILLING EVENTS
========================= */
export type BillingEvent = {
  initials: string;
  name: string;
  email: string;
  eventType: string;
  plan: string;
  amount: string;
  date: string;
  status: string;
  statusType: "success" | "processed" | "danger";
};