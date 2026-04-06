"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  CheckCircle2,
  Clock,
  Crown,
  Lock,
  Loader2,
  RefreshCw,
  Rocket,
  ShieldCheck,
  Sparkles,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useCreatePaymentCheckoutMutation,
  useCheckBakongPaymentMutation,
} from "@/store/api";
import type { SubscriptionPlanKey, BillingCycle } from "@/store/api";
import { PLAN_DISPLAY_CONFIG } from "@/data/payment";

// ─── Types ────────────────────────────────────────────────────────────────────

type PaymentStatus = "idle" | "loading" | "qr_shown" | "polling" | "succeeded" | "failed" | "expired";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatMoney(value: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

function planIcon(planId: string, className = "size-5") {
  if (planId === "free") return <ShieldCheck className={className} />;
  if (planId === "pro") return <Rocket className={className} />;
  if (planId === "business") return <Crown className={className} />;
  return <Sparkles className={className} />;
}

function useCountdown(expiresAt: string | null): number {
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    if (!expiresAt) return;
    const update = () => {
      const diff = Math.max(0, Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000));
      setSecondsLeft(diff);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  return secondsLeft;
}

function CountdownDisplay({ seconds }: { seconds: number }) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const isUrgent = seconds > 0 && seconds <= 60;

  return (
    <div className={`flex items-center gap-1.5 text-sm font-semibold ${isUrgent ? "text-[#dc2626]" : "text-[#667085]"}`}>
      <Clock className="size-4" />
      {seconds === 0 ? "QR expired" : `${mins}:${String(secs).padStart(2, "0")} remaining`}
    </div>
  );
}

// ─── Main Client Component ────────────────────────────────────────────────────

export default function PaymentsPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const rawPlan = searchParams.get("plan") as SubscriptionPlanKey | null;
  const rawCycle = searchParams.get("billingCycle") as BillingCycle | null;

  const plan: Exclude<SubscriptionPlanKey, "free"> =
    rawPlan && rawPlan !== "free" ? rawPlan : "pro";
  const billingCycle: BillingCycle = rawCycle === "annual" ? "annual" : "monthly";

  const planConfig = PLAN_DISPLAY_CONFIG[plan] ?? PLAN_DISPLAY_CONFIG.pro;
  const displayPrice = billingCycle === "annual" ? planConfig.annualPrice : planConfig.monthlyPrice;
  const annualSavings = "annualSavings" in planConfig ? planConfig.annualSavings : 0;

  const PLAN_HIGHLIGHTS: Record<string, string[]> = {
    pro: [
      "Trend, growth, and top product analytics",
      "Report export (PDF & CSV)",
      "Voice sales input",
      "Telegram notifications",
      "10 user seats · 20 GB storage",
      "Priority support",
    ],
    business: [
      "Unlimited seats & queries",
      "100 GB storage",
      "Dedicated account manager",
      "AI-powered insights",
    ],
  };

  // ── State ────────────────────────────────────────────────────────────────
  const [status, setStatus] = useState<PaymentStatus>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [qrExpiresAt, setQrExpiresAt] = useState<string | null>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [createCheckout, { isLoading: isCreating }] = useCreatePaymentCheckoutMutation();
  const [checkPayment] = useCheckBakongPaymentMutation();

  const secondsLeft = useCountdown(qrExpiresAt);

  const stopPolling = () => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  };

  const startPolling = (txId: string) => {
    stopPolling();
    setStatus("polling");

    pollingRef.current = setInterval(() => {
      checkPayment({ transactionId: txId }).unwrap()
        .then((result) => {
          if (result.status === "succeeded") {
            stopPolling();
            setStatus("succeeded");
            setTimeout(() => { router.push("/payments/success"); }, 2000);
          } else if (result.status === "failed") {
            stopPolling();
            setStatus("failed");
            setErrorMsg("Payment was not completed. Please try again.");
          }
        })
        .catch(() => {
          // network error — keep polling
        });
    }, 5000);
  };

  // ── Cleanup on unmount ────────────────────────────────────────────────────
  useEffect(() => {
    return () => { stopPolling(); };
  }, []);

  // ── Initiate checkout ────────────────────────────────────────────────────
  const initiateCheckout = async () => {
    setStatus("loading");
    setErrorMsg(null);
    stopPolling();
    setQrCode(null);
    setQrExpiresAt(null);

    try {
      const result = await createCheckout({
        plan,
        billingCycle,
        provider: "bakong",
        currency: "USD",
      }).unwrap();

      setTransactionId(result.transactionId);
      setQrCode(result.qrCode);
      setQrExpiresAt(result.qrExpirationAt);
      setStatus("qr_shown");
      startPolling(result.transactionId);
    } catch (error) {
      const e = error as { data?: { message?: string } };
      setErrorMsg(e?.data?.message ?? "Failed to create checkout. Please try again.");
      setStatus("failed");
    }
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void initiateCheckout();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const canRetry = status === "failed" || status === "expired";

  return (
    <div className="dashboard-container mt-10 space-y-6 pb-12">

      {/* Hero */}
      <section className="payment-hero">
        <Link href="/subscriptions" className="payment-back-link">
          <ChevronLeft className="size-4" />
          Back to subscriptions
        </Link>
        <div className="payment-hero-badge">
          <Lock className="inline size-3 mr-1" />
          Secure Checkout
        </div>
        <h1 className="payment-title">Complete Your Upgrade</h1>
        <p className="payment-subtitle">
          Upgrading to <strong>{planConfig.name} Plan</strong>
          {" — "}{billingCycle === "annual" ? "Annual billing (2 months free)" : "Monthly billing"}.
          Scan the QR below to pay via Bakong KHQR.
        </p>
      </section>

      {/* Main content */}
      <section className="payment-content-shell">
        <div className="payment-content">

          {/* ── QR Column ─────────────────────────────────────────────────── */}
          <div className="payment-left">
            <div className="payment-qr-wrap">
              <div className="qr-card">
                <p className="qr-card-label">KHQR / ABA PAY</p>

                {/* Loading */}
                {(status === "idle" || status === "loading") && (
                  <div className="qr-image flex flex-col items-center justify-center bg-[#f5f6f8] rounded-xl gap-3">
                    <Loader2 className="size-10 animate-spin text-[#d4af35]" />
                    <p className="text-sm text-[#667085]">Generating QR code...</p>
                  </div>
                )}

                {/* QR shown / polling */}
                {(status === "qr_shown" || status === "polling") && qrCode && (
                  <div className="relative">
                    <Image
                      src={qrCode.startsWith("data:") || qrCode.startsWith("http")
                        ? qrCode
                        : `data:image/png;base64,${qrCode}`}
                      alt="Bakong KHQR payment code"
                      className="qr-image rounded-xl"
                      width={230}
                      height={230}
                      unoptimized
                    />
                    {status === "polling" && (
                      <div className="absolute top-2 right-2 rounded-full bg-[#d4af35] p-1.5 shadow">
                        <RefreshCw className="size-3 text-white animate-spin" />
                      </div>
                    )}
                  </div>
                )}

                {/* Succeeded */}
                {status === "succeeded" && (
                  <div className="qr-image flex flex-col items-center justify-center bg-[#f0fdf4] rounded-xl gap-3">
                    <CheckCircle2 className="size-14 text-[#22c55e]" />
                    <div className="text-center">
                      <p className="text-base font-bold text-[#15803d]">Payment Confirmed!</p>
                      <p className="text-sm text-[#667085]">Redirecting to confirmation...</p>
                    </div>
                  </div>
                )}

                {/* Failed / expired */}
                {(status === "failed" || status === "expired") && (
                  <div className="qr-image flex flex-col items-center justify-center bg-[#fff5f5] rounded-xl gap-3">
                    <XCircle className="size-14 text-[#dc2626]" />
                    <div className="text-center">
                      <p className="text-sm font-bold text-[#dc2626]">
                        {status === "expired" ? "QR Code Expired" : "Payment Failed"}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Status pill */}
              <div className="payment-status-pill">
                {status === "succeeded" ? (
                  <><CheckCircle2 className="size-3.5 text-[#22c55e]" /><span className="text-[#15803d] font-semibold">Payment Confirmed</span></>
                ) : status === "polling" ? (
                  <><span className="status-dot-gold animate-pulse" /><span>Checking payment...</span></>
                ) : (status === "failed" || status === "expired") ? (
                  <><XCircle className="size-3.5 text-[#dc2626]" /><span className="text-[#dc2626]">{errorMsg}</span></>
                ) : (
                  <><span className="status-dot-gold" />Waiting for Payment...</>
                )}
              </div>

              {(status === "qr_shown" || status === "polling") && qrExpiresAt && (
                <div className="mt-2 flex justify-center">
                  <CountdownDisplay seconds={secondsLeft} />
                </div>
              )}

              {canRetry && (
                <Button
                  onClick={() => void initiateCheckout()}
                  disabled={isCreating}
                  className="mt-3 w-full rounded-full bg-[#d4af35] text-white hover:bg-[#c9a62f]"
                >
                  {isCreating
                    ? <><Loader2 className="size-4 animate-spin mr-2" />Generating...</>
                    : <><RefreshCw className="size-4 mr-2" />Generate New QR Code</>}
                </Button>
              )}

              <div className="payment-methods">
                <span>KHQR</span>
                <span>ABA</span>
                <span>Bakong</span>
              </div>
            </div>
          </div>

          {/* ── Order Summary ──────────────────────────────────────────────── */}
          <div className="payment-right">
            <div className="order-summary-card">
              <h2>Order Summary</h2>

              <div className="summary-row summary-plan">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f3efe2] text-[#8a6a00]">
                      {planIcon(plan)}
                    </div>
                    <h3>{planConfig.name} Plan</h3>
                  </div>
                  <p>{billingCycle === "annual" ? "Annual" : "Monthly"} subscription{billingCycle === "annual" ? " · 2 months free" : ""}</p>
                </div>
                <span>{formatMoney(displayPrice, "USD")}</span>
              </div>

              {billingCycle === "annual" && annualSavings > 0 && (
                <div className="summary-row">
                  <span className="text-[#15803d] font-medium text-sm flex items-center gap-1">
                    <CheckCircle2 className="size-3.5 flex-shrink-0" />
                    Annual discount
                  </span>
                  <span className="text-[#15803d] text-sm font-semibold">
                    −{formatMoney(annualSavings, "USD")}
                  </span>
                </div>
              )}

              <div className="summary-row">
                <span>Tax</span>
                <span>$0.00</span>
              </div>

              <div className="summary-divider" />

              <div className="summary-total">
                <div><p>Total Due Today</p></div>
                <div className="summary-total-price">
                  <h3>{formatMoney(displayPrice, "USD")}</h3>
                  <span>USD {billingCycle === "annual" ? "PER YEAR" : "PER MONTH"}</span>
                </div>
              </div>

              {/* What's included */}
              <div className="mt-4 rounded-xl bg-[#f9fafb] border border-[#e4e7ec] p-4 space-y-2">
                <p className="text-xs font-semibold text-[#667085] uppercase tracking-wide">
                  What&apos;s included
                </p>
                {(PLAN_HIGHLIGHTS[plan] ?? []).map((feat) => (
                  <div key={feat} className="flex items-center gap-2 text-sm text-[#344054]">
                    <CheckCircle2 className="size-3.5 text-[#8d7007] flex-shrink-0" />
                    {feat}
                  </div>
                ))}
              </div>

              {/* How to pay instructions */}
              {status !== "succeeded" && (
                <div className="mt-4 rounded-xl border border-[#d4af35]/30 bg-[#fffaf0] px-4 py-3">
                  <p className="text-sm font-semibold text-[#8a6b0b]">How to pay:</p>
                  <ol className="mt-1 list-decimal list-inside space-y-1 text-xs text-[#8a6b0b]">
                    <li>Open your Bakong / ABA PAY app</li>
                    <li>Tap &quot;Scan QR&quot; and scan the code on the left</li>
                    <li>Confirm the payment amount</li>
                    <li>Your plan activates instantly ✓</li>
                  </ol>
                </div>
              )}

              <p className="summary-note">
                By paying, you agree to Syntrix Analytics&apos; Terms of Service and recurring billing.
                Cancel anytime from subscription settings.
              </p>

              <div className="summary-security">
                <Lock className="size-3.5" />
                SECURE 256-BIT ENCRYPTION
              </div>

              {/* Manual check */}
              {(status === "polling" || status === "qr_shown") && transactionId && (
                <button
                  type="button"
                  onClick={() => {
                    void checkPayment({ transactionId }).unwrap().then((r) => {
                      if (r.status === "succeeded") {
                        stopPolling();
                        setStatus("succeeded");
                        setTimeout(() => { router.push("/payments/success"); }, 1500);
                      }
                    });
                  }}
                  className="mt-3 w-full text-center text-xs text-[#667085] underline hover:text-[#475467]"
                >
                  I&apos;ve already paid — check status now
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-sm text-[#98a2b3] pt-4">
        <p className="flex items-center justify-center gap-1.5">
          <Lock className="size-3.5" />
          Payments processed securely via National Bank of Cambodia (Bakong).
        </p>
        <p className="mt-1">© 2026 Syntrix Analytics. All rights reserved.</p>
      </footer>
    </div>
  );
}
