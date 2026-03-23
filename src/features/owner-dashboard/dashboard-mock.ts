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

export interface AnalyticsMetric {
  label: string;
  value: string;
  delta: string;
  tone: "green" | "amber" | "slate";
}

export interface AnalyticsSeriesPoint {
  label: string;
  value: number;
}

export interface HeatmapCell {
  day: string;
  value: number;
}

export const topNavItems: DashboardNavItem[] = [
  { label: "Dashboard", href: "/owner" },
  { label: "Sale Record", href: "/sale-record" },
  { label: "Product", href: "/product" },
  { label: "Analytics", href: "/analytics" },
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

export const analyticsMetrics: AnalyticsMetric[] = [
  { label: "Revenue Growth", value: "+18.5%", delta: "+2.4%", tone: "green" },
  { label: "Average Order Value", value: "$84.20", delta: "+$5.12", tone: "green" },
  { label: "Customer Growth", value: "+9.2%", delta: "+124", tone: "amber" },
  { label: "Conversion Rate", value: "4.2%", delta: "-0.1%", tone: "slate" },
];

export const analyticsRevenueSeries: Record<"3m" | "6m" | "12m", AnalyticsSeriesPoint[]> = {
  "3m": [
    { label: "Apr", value: 60 },
    { label: "May", value: 68 },
    { label: "Jun", value: 74 },
  ],
  "6m": [
    { label: "Jan", value: 34 },
    { label: "Feb", value: 41 },
    { label: "Mar", value: 66 },
    { label: "Apr", value: 57 },
    { label: "May", value: 72 },
    { label: "Jun", value: 83 },
  ],
  "12m": [
    { label: "Jul", value: 26 },
    { label: "Aug", value: 31 },
    { label: "Sep", value: 28 },
    { label: "Oct", value: 44 },
    { label: "Nov", value: 55 },
    { label: "Dec", value: 59 },
    { label: "Jan", value: 52 },
    { label: "Feb", value: 63 },
    { label: "Mar", value: 72 },
    { label: "Apr", value: 68 },
    { label: "May", value: 79 },
    { label: "Jun", value: 86 },
  ],
};

export const analyticsCustomerSeries: AnalyticsSeriesPoint[] = [
  { label: "Mon", value: 24 },
  { label: "Tue", value: 30 },
  { label: "Wed", value: 58 },
  { label: "Thu", value: 52 },
  { label: "Fri", value: 64 },
  { label: "Sat", value: 70 },
];

export const analyticsCategoryShare = [
  { label: "Coffee", value: 55, color: "#d4af35" },
  { label: "Food", value: 25, color: "#eadbb0" },
  { label: "Beverages", value: 20, color: "#d8dee7" },
];

export const analyticsHeatmap: HeatmapCell[][] = [
  [
    { day: "Mon", value: 1 },
    { day: "Tue", value: 2 },
    { day: "Wed", value: 1 },
    { day: "Thu", value: 3 },
    { day: "Fri", value: 4 },
    { day: "Sat", value: 5 },
    { day: "Sun", value: 4 },
  ],
  [
    { day: "Mon", value: 1 },
    { day: "Tue", value: 1 },
    { day: "Wed", value: 2 },
    { day: "Thu", value: 3 },
    { day: "Fri", value: 4 },
    { day: "Sat", value: 4 },
    { day: "Sun", value: 3 },
  ],
  [
    { day: "Mon", value: 2 },
    { day: "Tue", value: 3 },
    { day: "Wed", value: 4 },
    { day: "Thu", value: 5 },
    { day: "Fri", value: 5 },
    { day: "Sat", value: 3 },
    { day: "Sun", value: 1 },
  ],
  [
    { day: "Mon", value: 1 },
    { day: "Tue", value: 1 },
    { day: "Wed", value: 2 },
    { day: "Thu", value: 3 },
    { day: "Fri", value: 3 },
    { day: "Sat", value: 4 },
    { day: "Sun", value: 3 },
  ],
];
