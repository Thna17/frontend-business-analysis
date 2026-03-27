import type { OrderSummary, PaymentInfo } from "@/types/payment";

export const paymentInfo: PaymentInfo = {
  title: "Scan to Pay",
  subtitle: "Complete your Pro Plan upgrade securely via KHQR or ABA PAY.",
  qrImage:
    "https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=Syntrix-Pro-Plan-199USD",
  status: "Waiting for Payment...",
  methods: ["KHQR", "ABA"],
};

export const orderSummary: OrderSummary = {
  title: "Order Summary",
  planName: "Pro Plan",
  description: "Annual subscription for small teams",
  price: "$199.00",
  tax: "$0.00",
  total: "$199.00",
  totalLabel: "USD PER YEAR",
  buttonText: "Subscribe",
  note: "By confirming, you agree to Syntrix Gold Business Systems' Terms of Service and recurring billing cycle.",
  securityText: "SECURE 256-BIT ENCRYPTION",
};