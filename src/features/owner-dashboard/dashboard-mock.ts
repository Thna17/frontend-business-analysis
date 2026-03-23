export interface MetricItem {
  title: string;
  value: string;
  change: string;
  changeDirection: "up" | "down";
  compareLabel: string;
  icon: "revenue" | "users" | "churn" | "aov";
}

export interface RankingItem {
  name: string;
  value: number;
  width: number;
}

export interface SalesTransaction {
  id: string;
  customer: string;
  avatar: string;
  product: string;
  category: string;
  total: string;
  date: string;
  status: "Completed" | "Pending";
}

export const topNavItems = [
  "Dashboard",
  "Sale Record",
  "Product",
  "Analytics",
  "Subscriptions",
  "Report",
];

export const metricItems: MetricItem[] = [
  {
    title: "Total Revenue",
    value: "$128,430",
    change: "+12.5%",
    changeDirection: "up",
    compareLabel: "vs last mo",
    icon: "revenue",
  },
  {
    title: "Active Users",
    value: "14,202",
    change: "+5.2%",
    changeDirection: "up",
    compareLabel: "vs last mo",
    icon: "users",
  },
  {
    title: "Churn Rate",
    value: "2.4%",
    change: "-0.4%",
    changeDirection: "down",
    compareLabel: "vs last mo",
    icon: "churn",
  },
  {
    title: "Avg Order Value",
    value: "$84.20",
    change: "+1.8%",
    changeDirection: "up",
    compareLabel: "vs last mo",
    icon: "aov",
  },
];

export const rankingItems: RankingItem[] = [
  { name: "Latte", value: 2400, width: 100 },
  { name: "Cappuccino", value: 1920, width: 80 },
  { name: "Iced Tea", value: 1250, width: 54 },
  { name: "Espresso", value: 830, width: 36 },
];

export const salesTransactions: SalesTransaction[] = [
  {
    id: "tx-1",
    customer: "Brathna",
    avatar:
      "https://images.unsplash.com/photo-1512034400317-de97d7d6c6ed?auto=format&fit=crop&w=64&q=60",
    product: "Latte",
    category: "Coffee",
    total: "$198.00",
    date: "Oct 24, 2026",
    status: "Completed",
  },
  {
    id: "tx-2",
    customer: "Meng Chheng",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=64&q=60",
    product: "Cappuccino",
    category: "Coffee",
    total: "$198.00",
    date: "Oct 24, 2026",
    status: "Completed",
  },
  {
    id: "tx-3",
    customer: "Iced Tea",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=64&q=60",
    product: "Iced Tea",
    category: "Coffee",
    total: "$198.00",
    date: "Oct 24, 2026",
    status: "Completed",
  },
];
