export interface MetricItem {
  title: string;
  value: string;
  change: string;
  changeDirection: "up" | "down";
  compareLabel: string;
  icon: "revenue" | "users" | "churn" | "aov" | "today" | "product" | "star" | "alert";
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

export interface DashboardNavItem {
  label: string;
  href?: string;
}

export interface SaleRecordRow {
  id: string;
  product: string;
  category: string;
  quantity: number;
  price: number;
  date: string;
  status: "Completed" | "Pending";
  customerAvatar: string;
}

export interface ProductRow {
  id: string;
  product: string;
  category: string;
  price: number;
  sales: number;
  revenue: number;
  stock: number;
  lastUpdated: string;
  avatar: string;
}

export const topNavItems: DashboardNavItem[] = [
  { label: "Dashboard", href: "/owner" },
  { label: "Sale Record", href: "/sale-record" },
  { label: "Product", href: "/product" },
  { label: "Analytics" },
  { label: "Subscriptions" },
  { label: "Report" },
];

export const metricItems: MetricItem[] = [
  {
    title: "Total Revenue",
    value: "$128,430",
    change: "+12.5%",
    changeDirection: "up",
    compareLabel: "vs last month",
    icon: "revenue",
  },
  {
    title: "Active Users",
    value: "14,202",
    change: "+5.2%",
    changeDirection: "up",
    compareLabel: "vs last month",
    icon: "users",
  },
  {
    title: "Churn Rate",
    value: "2.4%",
    change: "-0.4%",
    changeDirection: "down",
    compareLabel: "vs last month",
    icon: "churn",
  },
  {
    title: "Avg Order Value",
    value: "$84.20",
    change: "+1.8%",
    changeDirection: "up",
    compareLabel: "vs last month",
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

export const saleRecordMetrics: MetricItem[] = [
  {
    title: "Total Revenue",
    value: "$128,430",
    change: "+12.5%",
    changeDirection: "up",
    compareLabel: "vs last month",
    icon: "revenue",
  },
  {
    title: "Total Sales",
    value: "2,340",
    change: "+8%",
    changeDirection: "up",
    compareLabel: "vs last month",
    icon: "users",
  },
  {
    title: "Avg Order Value",
    value: "$84.20",
    change: "+1.8%",
    changeDirection: "up",
    compareLabel: "vs last month",
    icon: "aov",
  },
  {
    title: "Today's Sales",
    value: "$1,100",
    change: "",
    changeDirection: "up",
    compareLabel: "vs last month",
    icon: "today",
  },
];

export const saleRecordRows: SaleRecordRow[] = [
  {
    id: "sr-1",
    product: "Latte",
    category: "Coffee",
    quantity: 2,
    price: 99,
    date: "Oct 24, 2026",
    status: "Completed",
    customerAvatar:
      "https://images.unsplash.com/photo-1512034400317-de97d7d6c6ed?auto=format&fit=crop&w=64&q=60",
  },
  {
    id: "sr-2",
    product: "Latte",
    category: "Coffee",
    quantity: 2,
    price: 99,
    date: "Oct 24, 2026",
    status: "Completed",
    customerAvatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=64&q=60",
  },
  {
    id: "sr-3",
    product: "Latte",
    category: "Coffee",
    quantity: 2,
    price: 99,
    date: "Oct 24, 2026",
    status: "Completed",
    customerAvatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=64&q=60",
  },
  {
    id: "sr-4",
    product: "Cappuccino",
    category: "Coffee",
    quantity: 3,
    price: 45,
    date: "Oct 22, 2026",
    status: "Pending",
    customerAvatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=64&q=60",
  },
];

export const productMetrics: MetricItem[] = [
  {
    title: "Total Products",
    value: "24",
    change: "",
    changeDirection: "up",
    compareLabel: "vs last month",
    icon: "product",
  },
  {
    title: "Best Seller",
    value: "Latte",
    change: "+12%",
    changeDirection: "up",
    compareLabel: "vs last month",
    icon: "star",
  },
  {
    title: "Product Revenue",
    value: "$6,820",
    change: "",
    changeDirection: "up",
    compareLabel: "vs last month",
    icon: "revenue",
  },
  {
    title: "Low Stock",
    value: "3 items",
    change: "",
    changeDirection: "down",
    compareLabel: "vs last month",
    icon: "alert",
  },
];

export const productRows: ProductRow[] = [
  {
    id: "pr-1",
    product: "Latte",
    category: "Coffee",
    price: 4.5,
    sales: 534,
    revenue: 198,
    stock: 82,
    lastUpdated: "2026-10-24",
    avatar:
      "https://images.unsplash.com/photo-1512034400317-de97d7d6c6ed?auto=format&fit=crop&w=64&q=60",
  },
  {
    id: "pr-2",
    product: "Cappuccino",
    category: "Coffee",
    price: 4.8,
    sales: 400,
    revenue: 198,
    stock: 12,
    lastUpdated: "2026-10-24",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=64&q=60",
  },
  {
    id: "pr-3",
    product: "Iced Tea",
    category: "Tea",
    price: 3.5,
    sales: 357,
    revenue: 198,
    stock: 2,
    lastUpdated: "2026-10-24",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=64&q=60",
  },
  {
    id: "pr-4",
    product: "Espresso",
    category: "Coffee",
    price: 3.8,
    sales: 275,
    revenue: 159,
    stock: 66,
    lastUpdated: "2026-10-21",
    avatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=64&q=60",
  },
];

export const productRankingItems: RankingItem[] = [
  { name: "Latte", value: 2400, width: 100 },
  { name: "Cappuccino", value: 1920, width: 80 },
  { name: "Iced Tea", value: 1250, width: 54 },
  { name: "Espresso", value: 830, width: 36 },
];
