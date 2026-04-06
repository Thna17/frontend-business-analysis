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
    value: "$2,160,000",
    change: "↗ +18.4%",
    note: "compared to last month",
    positive: true,
    icon: DollarSign,
  },
  {
    title: "Monthly Revenue",
    value: "$180,000",
    change: "↗ +7.1%",
    note: "compared to last month",
    positive: true,
    icon: TrendingUp,
  },
  {
    title: "Total Subscribers",
    value: "21,450",
    change: "",
    note: "active this month",
    positive: true,
    icon: Users,
  },
  {
    title: "Churn Rate",
    value: "1.87%",
    change: "↘ -0.3%",
    note: "lower than last month",
    positive: false,
    icon: AlertTriangle,
  },
];

/* =========================
   CHART DATA
========================= */
export const subscriptionChartData: SubscriptionChartItem[] = [
  { month: "JAN", value: 42 },
  { month: "FEB", value: 56 },
  { month: "MAR", value: 51 },
  { month: "APR", value: 72 },
  { month: "MAY", value: 88 },
  { month: "JUN", value: 79 },
  { month: "JUL", value: 104 },
  { month: "AUG", value: 121 },
  { month: "SEP", value: 114 },
  { month: "OCT", value: 140 },
  { month: "NOV", value: 153 },
  { month: "DEC", value: 162 },
];

/* =========================
   PLANS — Admin View (aligned with canonical backend plans)
========================= */
export const subscriptionPlans: SubscriptionPlan[] = [
  {
    name: "Free",
    subtitle: "Free forever for early-stage operators",
    price: "$0",
    suffix: "/month",
    users: "9,842",
    features: [
      { text: "1 business profile", disabled: false },
      { text: "Up to 50 products", disabled: false },
      { text: "100 sales records/month", disabled: false },
      { text: "Basic analytics overview", disabled: false },
      { text: "Subscription visibility", disabled: false },
      { text: "Trend, growth, and top product analytics", disabled: true },
      { text: "Voice sales input", disabled: true },
      { text: "AI insights", disabled: true },
    ],
    highlighted: false,
    badge: "",
  },
  {
    name: "Pro",
    subtitle: "Advanced workflows for growing businesses",
    price: "$19",
    suffix: "/month",
    users: "7,213",
    features: [
      { text: "Everything in Free", disabled: false },
      { text: "200 products · 500 sales/month", disabled: false },
      { text: "Trend & growth analytics", disabled: false },
      { text: "Top product performance", disabled: false },
      { text: "Voice sales input", disabled: false },
      { text: "Telegram notifications", disabled: false },
      { text: "Report export (PDF & CSV)", disabled: false },
      { text: "AI insights", disabled: true },
    ],
    highlighted: true,
    badge: "MOST POPULAR",
  },
  {
    name: "Business",
    subtitle: "Full intelligence for data-driven teams",
    price: "$49",
    suffix: "/month",
    users: "3,814",
    features: [
      { text: "Everything in Pro", disabled: false },
      { text: "1,000 products · 2,000 sales/month", disabled: false },
      { text: "AI-powered insights", disabled: false },
      { text: "Predictive revenue forecasting", disabled: false },
      { text: "5,000 analytics queries/month", disabled: false },
      { text: "Priority support", disabled: false },
    ],
    highlighted: false,
    badge: "BEST VALUE",
  },
];

/* =========================
   BILLING EVENTS
========================= */
export const billingEvents: BillingEvent[] = [
  {
    initials: "SR",
    name: "Sophea Rith",
    email: "sophea@rith.dev",
    eventType: "Upgraded to Pro",
    plan: "PRO",
    amount: "$19.00",
    date: "3 mins ago",
    status: "Completed",
    statusType: "success",
  },
  {
    initials: "KC",
    name: "Kim Chanthy",
    email: "chanthy.k@biz.io",
    eventType: "Subscription renewed",
    plan: "PRO",
    amount: "$19.00",
    date: "18 mins ago",
    status: "Completed",
    statusType: "success",
  },
  {
    initials: "VN",
    name: "Virak Noun",
    email: "virak@nounco.com",
    eventType: "Upgraded to Business",
    plan: "BUSINESS",
    amount: "$49.00",
    date: "2 hours ago",
    status: "Completed",
    statusType: "success",
  },
  {
    initials: "DB",
    name: "Dara Bun",
    email: "dara.bun@market.kh",
    eventType: "Payment failed",
    plan: "PRO",
    amount: "$19.00",
    date: "4 hours ago",
    status: "Action needed",
    statusType: "danger",
  },
];
