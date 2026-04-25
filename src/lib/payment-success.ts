type SearchParamReader = {
  get(name: string): string | null;
};

const FALLBACK_PLAN = "pro";
const FALLBACK_BILLING_CYCLE = "monthly";
const FALLBACK_AMOUNT = 19;
const FALLBACK_CURRENCY = "USD";

function isValidCurrencyCode(value: string | null): value is string {
  return typeof value === "string" && /^[A-Z]{3}$/.test(value);
}

function normalizeCurrency(value: string | null): string {
  const candidate = value?.trim().toUpperCase() ?? "";
  return isValidCurrencyCode(candidate) ? candidate : FALLBACK_CURRENCY;
}

function normalizeAmount(value: string | null): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : FALLBACK_AMOUNT;
}

function normalizePlan(value: string | null): string {
  const candidate = value?.trim().toLowerCase();
  return candidate && candidate.length > 0 ? candidate : FALLBACK_PLAN;
}

function normalizeBillingCycle(value: string | null): "monthly" | "annual" {
  return value === "annual" ? "annual" : FALLBACK_BILLING_CYCLE;
}

function normalizeProvider(value: string | null): "bakong" | "aba_payway" {
  return value === "aba_payway" ? "aba_payway" : "bakong";
}

function formatCurrencyAmount(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: FALLBACK_CURRENCY,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }
}

export function getPaymentSuccessDetails(searchParams: SearchParamReader) {
  const plan = normalizePlan(searchParams.get("plan"));
  const billingCycle = normalizeBillingCycle(searchParams.get("billingCycle"));
  const amount = normalizeAmount(searchParams.get("amount"));
  const currency = normalizeCurrency(searchParams.get("currency"));
  const provider = normalizeProvider(searchParams.get("provider"));
  const transactionId = searchParams.get("transactionId")?.trim() || null;

  return {
    plan,
    billingCycle,
    amount,
    currency,
    provider,
    transactionId,
    formattedPlan: `${plan.charAt(0).toUpperCase()}${plan.slice(1)} Plan (${billingCycle === "annual" ? "Annual" : "Monthly"})`,
    formattedAmount: formatCurrencyAmount(amount, currency),
    providerLabel: provider === "aba_payway" ? "ABA PayWay Sandbox" : "Bakong KHQR",
  };
}
