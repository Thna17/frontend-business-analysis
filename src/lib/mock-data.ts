import {
  AdminMetrics,
  BusinessProfile,
  RevenueAnalytics,
  SaleRecord,
  Subscription,
  User,
} from "@/types/domain";

export const currentOwner: User = {
  id: "u-owner-01",
  fullName: "Lim Potkolbotey",
  email: "owner@smartbiz.local",
  role: "BUSINESS_OWNER",
};

export const currentAdmin: User = {
  id: "u-admin-01",
  fullName: "Platform Administrator",
  email: "admin@smartbiz.local",
  role: "ADMIN",
};

export const businessProfile: BusinessProfile = {
  id: "biz-01",
  ownerId: "u-owner-01",
  businessName: "Smart Retail Phnom Penh",
  phone: "+855 12 345 678",
  address: "Khan Sen Sok, Phnom Penh",
};

export const saleRecords: SaleRecord[] = [
  {
    id: "sale-01",
    productName: "Espresso Beans 1kg",
    category: "Beverage",
    price: 22,
    quantity: 8,
    date: "2026-03-20",
  },
  {
    id: "sale-02",
    productName: "Ceramic Mug",
    category: "Accessories",
    price: 6,
    quantity: 14,
    date: "2026-03-21",
  },
  {
    id: "sale-03",
    productName: "Chocolate Croissant",
    category: "Bakery",
    price: 2.8,
    quantity: 46,
    date: "2026-03-21",
  },
  {
    id: "sale-04",
    productName: "Cold Brew Bottle",
    category: "Beverage",
    price: 4.5,
    quantity: 31,
    date: "2026-03-22",
  },
];

export const ownerAnalytics: RevenueAnalytics = {
  totalRevenue: 24860,
  growthPercentage: 14.2,
  monthlyComparison: [
    { month: "Jan", amount: 5900 },
    { month: "Feb", amount: 7600 },
    { month: "Mar", amount: 11360 },
  ],
  dailyTrend: [
    { day: "Mon", amount: 740 },
    { day: "Tue", amount: 910 },
    { day: "Wed", amount: 880 },
    { day: "Thu", amount: 1060 },
    { day: "Fri", amount: 1180 },
  ],
  topProducts: [
    { name: "Espresso Beans 1kg", revenue: 4210 },
    { name: "Cold Brew Bottle", revenue: 3870 },
    { name: "Chocolate Croissant", revenue: 3430 },
  ],
};

export const ownerSubscription: Subscription = {
  plan: "PRO",
  status: "ACTIVE",
  renewDate: "2026-04-08",
};

export const adminMetrics: AdminMetrics = {
  totalUsers: 468,
  activeSubscriptions: 292,
  platformUsageRate: 72,
  newUsersThisMonth: 58,
};

export const recentUsers: User[] = [
  {
    id: "u-101",
    fullName: "Sok Dara",
    email: "sokdara@example.com",
    role: "BUSINESS_OWNER",
  },
  {
    id: "u-102",
    fullName: "Kimhourng Pov",
    email: "kimhourng@example.com",
    role: "BUSINESS_OWNER",
  },
  {
    id: "u-103",
    fullName: "Support Admin",
    email: "support-admin@example.com",
    role: "ADMIN",
  },
];
