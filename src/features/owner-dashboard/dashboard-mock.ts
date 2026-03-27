export interface MetricItem {
  title: string;
  value: string;
  change: string;
  changeDirection: "up" | "down";
  compareLabel: string;
  icon:
    | "revenue"
    | "users"
    | "churn"
    | "aov"
    | "today"
    | "product"
    | "star"
    | "alert"
    | "calendar"
    | "business";
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

export interface SubscriptionUsageMetric {
  title: string;
  value: string;
  note: string;
  progress: number;
  icon: "users" | "reports" | "queries" | "storage";
}

export interface SubscriptionPlanTier {
  id: string;
  tier: string;
  name: string;
  subtitle: string;
  priceLabel: string;
  perLabel: string;
  features: string[];
  cta: string;
  tone: "default" | "highlight" | "outline";
}

export interface BillingHistoryItem {
  id: string;
  plan: string;
  amount: number;
  date: string;
  status: "Paid" | "Pending";
}

export interface ReportHistoryItem {
  id: string;
  name: string;
  type: "Sales" | "Revenue" | "Product" | "Customer";
  dateGenerated: string;
  status: "READY" | "PROCESSING";
}

export interface AdminUserDirectoryItem {
  id: string;
  name: string;
  tier: string;
  initials: string;
  color: string;
  status: "online" | "idle";
}

export interface AdminAuditLogItem {
  id: string;
  title: string;
  timeAgo: string;
}

export interface AdminRevenueVelocityItem {
  month: string;
  valueLabel: string;
  width: number;
  highlight?: boolean;
}

export interface AdminSegmentItem {
  id: string;
  title: string;
  description: string;
  icon: "building" | "sparkles" | "store" | "graduation";
}

export const topNavItems: DashboardNavItem[] = [
  { label: "Dashboard", href: "/owner" },
  { label: "Sale Record", href: "/sale-record" },
  { label: "Product", href: "/product" },
  { label: "Analytics", href: "/analytics" },
  { label: "Subscriptions", href: "/subscriptions" },
  { label: "Report", href: "/report" },
];

export const adminTopNavItems: DashboardNavItem[] = [
  { label: "Dashboard", href: "/admin" },
  { label: "Analytics", href: "/admin-analytics" },
  { label: "Product", href: "/product" },
  { label: "Subscriptions", href: "/subscriptions" },
  { label: "Report", href: "/report" },
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

export const subscriptionCurrentPlan = {
  name: "Pro Plan",
  price: 49,
  status: "ACTIVE NOW",
  description: "Current monthly subscription for advanced analytics and priority support.",
  nextBillingDate: "October 24, 2026",
};

export const subscriptionUsageMetrics: SubscriptionUsageMetric[] = [
  { title: "Active Users", value: "8 / 10", note: "", progress: 80, icon: "users" },
  { title: "Reports Generated", value: "124", note: "+ 12% from last month", progress: 60, icon: "reports" },
  { title: "Analytics Queries", value: "8,432", note: "Unlimited queries included", progress: 72, icon: "queries" },
  { title: "Storage Used", value: "2.3 GB", note: "", progress: 42, icon: "storage" },
];

export const subscriptionPlanTiers: SubscriptionPlanTier[] = [
  {
    id: "foundation",
    tier: "TIER I",
    name: "Foundation",
    subtitle: "Starter",
    priceLabel: "$19",
    perLabel: "/mo",
    features: [
      "Up to 3 team members",
      "Sales transaction management",
      "Basic revenue dashboard",
      "Product catalog tracking",
      "Monthly billing reports",
      "Email support",
    ],
    cta: "Choose Foundation",
    tone: "outline",
  },
  {
    id: "pro",
    tier: "TIER II",
    name: "Pro",
    subtitle: "Most Popular",
    priceLabel: "$49",
    perLabel: "/mo",
    features: [
      "Everything in Foundation",
      "Advanced analytics insights",
      "Usage metrics and alerts",
      "Priority billing support",
      "CSV import/export tools",
      "Role-based dashboard access",
    ],
    cta: "In Use",
    tone: "highlight",
  },
  {
    id: "business",
    tier: "TIER III",
    name: "Business",
    subtitle: "Enterprise Ready",
    priceLabel: "Custom",
    perLabel: "",
    features: [
      "Everything in Pro",
      "Multi-business account support",
      "Dedicated account manager",
      "Custom onboarding workflow",
      "SLA and uptime commitment",
      "Security and compliance review",
    ],
    cta: "Contact Sales",
    tone: "default",
  },
];

export const subscriptionBillingHistory: BillingHistoryItem[] = [
  { id: "INV-9402", plan: "Pro Monthly", amount: 49, date: "Sep 24, 2026", status: "Paid" },
  { id: "INV-8831", plan: "Pro Monthly", amount: 49, date: "Aug 24, 2026", status: "Paid" },
  { id: "INV-7720", plan: "Starter Monthly", amount: 19, date: "Jul 24, 2026", status: "Paid" },
];

export const reportInsights = [
  {
    title: "Revenue increased by 12%",
    description: "Growth is primarily driven by new enterprise subscriptions this month.",
    tone: "amber" as const,
  },
  {
    title: "Customer churn down 3.4%",
    description: "Retention campaigns for 'Silver' tier users are showing results.",
    tone: "slate" as const,
  },
  {
    title: "Top product: Analytics Pro",
    description: "Most downloaded report type correlates with this product's usage.",
    tone: "slate" as const,
  },
];

export const reportHistory: ReportHistoryItem[] = [
  {
    id: "rpt-1",
    name: "Q3 Sales Analysis",
    type: "Sales",
    dateGenerated: "Oct 24, 2026",
    status: "READY",
  },
  {
    id: "rpt-2",
    name: "Monthly Revenue Summary",
    type: "Revenue",
    dateGenerated: "Oct 23, 2026",
    status: "PROCESSING",
  },
  {
    id: "rpt-3",
    name: "Customer Retention Oct",
    type: "Customer",
    dateGenerated: "Oct 21, 2026",
    status: "READY",
  },
];

export const adminDashboardMetrics: MetricItem[] = [
  {
    title: "Total Users",
    value: "128",
    change: "+12.5%",
    changeDirection: "up",
    compareLabel: "vs last month",
    icon: "users",
  },
  {
    title: "Subscriptions",
    value: "67",
    change: "+5.2%",
    changeDirection: "up",
    compareLabel: "vs last month",
    icon: "product",
  },
  {
    title: "Monthly Revenue",
    value: "$14,820",
    change: "+8%",
    changeDirection: "up",
    compareLabel: "vs last month",
    icon: "revenue",
  },
  {
    title: "User Growth",
    value: "128",
    change: "",
    changeDirection: "up",
    compareLabel: "new users this month",
    icon: "today",
  },
];

export const adminGrowthProjection = [
  { month: "Jan", value: 36 },
  { month: "Feb", value: 44 },
  { month: "Mar", value: 63 },
  { month: "Apr", value: 58 },
  { month: "May", value: 69 },
  { month: "Jun", value: 81 },
];

export const adminUserDirectory: AdminUserDirectoryItem[] = [
  {
    id: "ad-1",
    name: "Jing Jing",
    tier: "Free Tier",
    initials: "JJ",
    color: "#e5e7eb",
    status: "online",
  },
  {
    id: "ad-2",
    name: "Mengchheang",
    tier: "PLUS TIER",
    initials: "MC",
    color: "#c7d2fe",
    status: "online",
  },
  {
    id: "ad-3",
    name: "Brathna",
    tier: "PRO",
    initials: "BR",
    color: "#fde68a",
    status: "idle",
  },
];

export const adminAuditLogs: AdminAuditLogItem[] = [
  { id: "log-1", title: "System Update", timeAgo: "2m ago" },
  { id: "log-2", title: "API Credential Refresh", timeAgo: "1h ago" },
];

export const adminAnalyticsMetrics: MetricItem[] = [
  {
    title: "Total Users",
    value: "1,420,000",
    change: "+12.5%",
    changeDirection: "up",
    compareLabel: "vs last month",
    icon: "users",
  },
  {
    title: "Subscriptions",
    value: "14,820",
    change: "+5.2%",
    changeDirection: "up",
    compareLabel: "vs last month",
    icon: "calendar",
  },
  {
    title: "Monthly Revenue",
    value: "$2.48M",
    change: "+8%",
    changeDirection: "up",
    compareLabel: "vs last month",
    icon: "revenue",
  },
  {
    title: "Total Businesses",
    value: "12,104",
    change: "-0.4%",
    changeDirection: "down",
    compareLabel: "vs last month",
    icon: "business",
  },
];

export const adminAnalyticsTrends: Record<"6m" | "yearly", Array<{ month: string; value: number }>> = {
  "6m": [
    { month: "Jan", value: 200 },
    { month: "Feb", value: 410 },
    { month: "Mar", value: 300 },
    { month: "Apr", value: 760 },
    { month: "May", value: 1120 },
    { month: "Jun", value: 1400 },
  ],
  yearly: [
    { month: "Jan", value: 90 },
    { month: "Feb", value: 140 },
    { month: "Mar", value: 220 },
    { month: "Apr", value: 380 },
    { month: "May", value: 510 },
    { month: "Jun", value: 700 },
    { month: "Jul", value: 860 },
    { month: "Aug", value: 980 },
    { month: "Sep", value: 1100 },
    { month: "Oct", value: 1230 },
    { month: "Nov", value: 1360 },
    { month: "Dec", value: 1520 },
  ],
};

export const adminRevenueVelocity: AdminRevenueVelocityItem[] = [
  { month: "March", valueLabel: "$1.92M", width: 74 },
  { month: "April", valueLabel: "$2.15M", width: 81 },
  { month: "May", valueLabel: "$2.34M", width: 89 },
  { month: "June (Current)", valueLabel: "$2.48M", width: 95, highlight: true },
];

export const adminSubscriptionDistribution = [
  { label: "Free Tier", percent: 75, users: "963K", color: "#7c6203" },
  { label: "Plus Tier", percent: 20, users: "257K", color: "#d4af35" },
  { label: "Pro Tier", percent: 5, users: "64.2K", color: "#111827" },
];

export const adminUserSegments: AdminSegmentItem[] = [
  {
    id: "seg-1",
    title: "Enterprise Orgs",
    description: "Global scaling accounts",
    icon: "building",
  },
  {
    id: "seg-2",
    title: "Power Creatives",
    description: "High-volume content creators",
    icon: "sparkles",
  },
  {
    id: "seg-3",
    title: "SME Retailers",
    description: "Direct-to-consumer businesses",
    icon: "store",
  },
  {
    id: "seg-4",
    title: "Education Portals",
    description: "Institutional learning platforms",
    icon: "graduation",
  },
];
