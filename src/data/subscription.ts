import type {
  BillingEvent,
  SubscriptionChartItem,
  SubscriptionPlan,
  SubscriptionStat,
} from "@/types/subscription";

import {
  DollarSign,
  TrendingUp,
  Users,
  AlertTriangle,
} from "lucide-react";

/* =========================
   STATS
========================= */
export const subscriptionStats: SubscriptionStat[] = [
  {
    title: "Total Revenue (ARR)",
    value: "$1,420,000",
    change: "↗ +12.5%",
    note: "compared to last month",
    positive: true,
    icon: DollarSign,
  },
  {
    title: "Monthly Revenue",
    value: "$118,334",
    change: "↗ +5.2%",
    note: "compared to last month",
    positive: true,
    icon: TrendingUp,
  },
  {
    title: "Total Subscribers",
    value: "14,820",
    change: "",
    note: "active this month",
    positive: true,
    icon: Users,
  },
  {
    title: "Churn Rate",
    value: "2.41%",
    change: "↘ -0.4%",
    note: "lower than last month",
    positive: false,
    icon: AlertTriangle,
  },
];

/* =========================
   CHART DATA
========================= */
export const subscriptionChartData: SubscriptionChartItem[] = [
  { month: "JAN", value: 38 },
  { month: "FEB", value: 46 },
  { month: "MAR", value: 42 },
  { month: "APR", value: 60 },
  { month: "MAY", value: 74 },
  { month: "JUN", value: 66 },
  { month: "JUL", value: 88 },
  { month: "AUG", value: 102 },
  { month: "SEP", value: 96 },
  { month: "OCT", value: 118 },
  { month: "NOV", value: 126 },
  { month: "DEC", value: 134 },
];

/* =========================
   PLANS
========================= */
export const subscriptionPlans: SubscriptionPlan[] = [
  {
    name: "Free",
    subtitle: "Perfect for getting started",
    price: "$0",
    suffix: "/month",
    users: "8,421",
    features: [
      { text: "Create and manage 1 business profile", disabled: false },
      { text: "Add, edit, and delete sales records", disabled: false },
      { text: "Basic sales and revenue overview", disabled: false },
    ],
    highlighted: false,
    badge: "",
  },
  {
    name: "Plus",
    subtitle: "Best for growing businesses",
    price: "$19",
    suffix: "/month",
    users: "4,102",
    features: [
      { text: "Everything in Free", disabled: false },
      { text: "Advanced analytics and revenue insights", disabled: false },
      { text: "Priority customer support", disabled: false },
    ],
    highlighted: true,
    badge: "MOST POPULAR",
  },
  {
    name: "Pro",
    subtitle: "Built for scaling teams",
    price: "$49",
    suffix: "/month",
    users: "2,297",
    features: [
      { text: "Everything in Plus", disabled: false },
      { text: "Full analytics dashboard", disabled: false },
      { text: "Advanced performance insights and support", disabled: false },
    ],
    highlighted: false,
    badge: "",
  },
];

/* =========================
   BILLING EVENTS
========================= */
export const billingEvents: BillingEvent[] = [
  {
    initials: "JD",
    name: "Julianne Davis",
    email: "julianne@example.com",
    eventType: "Subscription renewed",
    plan: "PLUS",
    amount: "$19.00",
    date: "2 mins ago",
    status: "Completed",
    statusType: "success",
  },
  {
    initials: "MK",
    name: "Marcus Knight",
    email: "marcus@knight.io",
    eventType: "Upgraded to Pro",
    plan: "PRO",
    amount: "$49.00",
    date: "14 mins ago",
    status: "Completed",
    statusType: "success",
  },
  {
    initials: "SL",
    name: "Sarah Lopez",
    email: "sarah.l@studio.com",
    eventType: "Cancelled subscription",
    plan: "FREE",
    amount: "$0.00",
    date: "1 hour ago",
    status: "Processed",
    statusType: "processed",
  },
  {
    initials: "TW",
    name: "Thomas Wright",
    email: "t.wright@enterprise.com",
    eventType: "Payment failed",
    plan: "PLUS",
    amount: "$19.00",
    date: "2 hours ago",
    status: "Action needed",
    statusType: "danger",
  },
];