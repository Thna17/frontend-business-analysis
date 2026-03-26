export type SubscriptionStat = {
  title: string;
  value: string;
  change: string;
  note: string;
  positive: boolean;
  icon: string;
};

export type SubscriptionChartItem = {
  month: string;
  value: number;
};

export type PlanFeature = {
  text: string;
  disabled: boolean;
};

export type SubscriptionPlan = {
  name: string;
  subtitle: string;
  price: string;
  suffix: string;
  users: string;
  features: PlanFeature[];
  highlighted: boolean;
  badge: string;
};

export type BillingEvent = {
  initials: string;
  name: string;
  email: string;
  eventType: string;
  plan: string;
  amount: string;
  date: string;
  status: string;
  statusType: string;
};