import type { OrderSummary, PaymentInfo } from "@/types/payment";

// ─── Static payment UI config (non-plan-specific) ─────────────────────────────
// Actual plan name, price, and QR code come from the backend checkout API.
// These are only used as fallback / default values.

export const paymentInfo: PaymentInfo = {
  title: "Scan to Pay",
  subtitle: "Complete your subscription upgrade securely via Bakong KHQR.",
  qrImage: "https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=syntrix-payment",
  status: "Waiting for payment...",
  methods: ["KHQR", "ABA", "Bakong"],
};

export const orderSummary: OrderSummary = {
  title: "Order Summary",
  planName: "Pro Plan",
  description: "Monthly subscription",
  price: "$9.00",
  tax: "$0.00",
  total: "$9.00",
  totalLabel: "USD PER MONTH",
  buttonText: "Confirm Subscription",
  note: "By confirming, you agree to Syntrix Analytics' Terms of Service and recurring billing cycle. You can cancel anytime.",
  securityText: "SECURE 256-BIT ENCRYPTION",
};

// ─── Plan display config (matches backend PLAN_META) ─────────────────────────

export const PLAN_DISPLAY_CONFIG = {
  free: {
    name: "Free",
    monthlyPrice: 0,
    annualPrice: 0,
    color: "#667085",
    badge: null,
  },
  pro: {
    name: "Pro",
    monthlyPrice: 19,
    annualPrice: 190,
    annualSavings: 38,
    color: "#d4af35",
    badge: "BEST VALUE",
  },
  business: {
    name: "Business",
    monthlyPrice: 49,
    annualPrice: 490,
    annualSavings: 98,
    color: "#0f172a",
    badge: "BUSINESS",
  },
} as const;

export type PlanDisplayKey = keyof typeof PLAN_DISPLAY_CONFIG;
