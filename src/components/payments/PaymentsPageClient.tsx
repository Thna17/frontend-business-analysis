"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import {
  ChevronLeft,
  CheckCircle2,
  Clock,
  Crown,
  Loader2,
  Lock,
  RefreshCw,
  Rocket,
  Sparkles,
  XCircle,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { getApiErrorMessage } from "@/lib/api-error";
import {
  useCheckBakongPaymentMutation,
  useCreatePaymentCheckoutMutation,
  useSimulateAbaPaywayPaymentMutation,
} from "@/store/api";
import type {
  BillingCycle,
  PaymentProvider,
  SubscriptionPlanKey,
} from "@/store/api";
import { PLAN_DISPLAY_CONFIG } from "@/data/payment";

type PaymentStatus =
  | "idle"
  | "loading"
  | "ready"
  | "polling"
  | "succeeded"
  | "failed"
  | "expired";

function formatMoney(value: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

function planIcon(planId: string, className = "size-5") {
  if (planId === "pro") return <Rocket className={className} />;
  if (planId === "business") return <Crown className={className} />;
  return <Sparkles className={className} />;
}

function useCountdown(expiresAt: string | null): number {
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    if (!expiresAt) return;

    const update = () => {
      const diff = Math.max(
        0,
        Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000),
      );
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
    <div
      className={`flex items-center gap-1.5 text-sm font-semibold ${
        isUrgent ? "text-destructive" : "text-muted-foreground"
      }`}
    >
      <Clock className="size-4" />
      {seconds === 0 ? "Session expired" : `${mins}:${String(secs).padStart(2, "0")} remaining`}
    </div>
  );
}

function providerLabel(provider: PaymentProvider): string {
  return provider === "aba_payway" ? "ABA PayWay Sandbox" : "Bakong KHQR";
}

function providerMethods(provider: PaymentProvider): string[] {
  return provider === "aba_payway"
    ? ["ABA PayWay", "Sandbox", "QR Panel"]
    : ["KHQR", "ABA", "Bakong"];
}

export default function PaymentsPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const rawPlan = searchParams.get("plan") as SubscriptionPlanKey | null;
  const rawCycle = searchParams.get("billingCycle") as BillingCycle | null;
  const rawProvider = searchParams.get("provider") as PaymentProvider | null;

  const plan: Exclude<SubscriptionPlanKey, "free"> =
    rawPlan && rawPlan !== "free" ? rawPlan : "pro";
  const billingCycle: BillingCycle = rawCycle === "annual" ? "annual" : "monthly";
  const initialProvider: PaymentProvider =
    rawProvider === "aba_payway" ? "aba_payway" : "bakong";

  const planConfig = PLAN_DISPLAY_CONFIG[plan] ?? PLAN_DISPLAY_CONFIG.pro;
  const displayPrice =
    billingCycle === "annual" ? planConfig.annualPrice : planConfig.monthlyPrice;
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

  const [provider, setProvider] = useState<PaymentProvider>(initialProvider);
  const [status, setStatus] = useState<PaymentStatus>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [externalReference, setExternalReference] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [qrExpiresAt, setQrExpiresAt] = useState<string | null>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [createCheckout, { isLoading: isCreating }] =
    useCreatePaymentCheckoutMutation();
  const [checkPayment] = useCheckBakongPaymentMutation();
  const [simulateAbaPaywayPayment, { isLoading: isSimulating }] =
    useSimulateAbaPaywayPaymentMutation();

  const secondsLeft = useCountdown(qrExpiresAt);

  const stopPolling = () => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  };

  const redirectToSuccess = (paymentProvider: PaymentProvider, txId: string) => {
    const successParams = new URLSearchParams({
      transactionId: txId,
      provider: paymentProvider,
      plan,
      billingCycle,
      amount: displayPrice.toFixed(2),
      currency: "USD",
      status: "paid",
    });
    router.push(`/payments/success?${successParams.toString()}`);
  };

  const startBakongPolling = (txId: string) => {
    stopPolling();
    setStatus("polling");

    pollingRef.current = setInterval(() => {
      checkPayment({ transactionId: txId })
        .unwrap()
        .then((result) => {
          if (result.status === "succeeded") {
            stopPolling();
            setStatus("succeeded");
            setTimeout(() => {
              redirectToSuccess("bakong", txId);
            }, 1200);
            return;
          }

          if (result.status === "failed") {
            stopPolling();
            setStatus("failed");
            setErrorMsg("Payment was not completed. Please try again.");
          }
        })
        .catch(() => {
          // Keep polling for transient network issues.
        });
    }, 5000);
  };

  const initiateCheckout = async (nextProvider: PaymentProvider) => {
    setStatus("loading");
    setErrorMsg(null);
    stopPolling();
    setTransactionId(null);
    setExternalReference(null);
    setQrCode(null);
    setQrExpiresAt(null);

    try {
      const result = await createCheckout({
        plan,
        billingCycle,
        provider: nextProvider,
        currency: "USD",
      }).unwrap();

      setTransactionId(result.transactionId);
      setExternalReference(result.externalReference);
      setQrCode(result.qrCode);
      setQrExpiresAt(result.qrExpirationAt);
      setStatus(result.provider === "bakong" ? "polling" : "ready");

      if (result.provider === "bakong") {
        startBakongPolling(result.transactionId);
      }
    } catch (error) {
      setErrorMsg(
        getApiErrorMessage(error, "Failed to create checkout. Please try again."),
      );
      setStatus("failed");
    }
  };

  useEffect(() => {
    void initiateCheckout(provider);

    return () => {
      stopPolling();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provider, plan, billingCycle]);

  useEffect(() => {
    if (!qrExpiresAt) return;
    if (status !== "ready" && status !== "polling") return;

    const msUntilExpiry = new Date(qrExpiresAt).getTime() - Date.now();
    const timeoutId = window.setTimeout(() => {
      stopPolling();
      setStatus("expired");
      setErrorMsg(
        provider === "aba_payway"
          ? "This ABA PayWay sandbox session expired. Generate a fresh sandbox payment to continue."
          : "This QR code expired before payment was confirmed. Generate a new one to continue.",
      );
    }, Math.max(msUntilExpiry, 0));

    return () => window.clearTimeout(timeoutId);
  }, [provider, qrExpiresAt, status]);

  const canRetry = status === "failed" || status === "expired";
  const showInteractiveState =
    (status === "ready" || status === "polling") && qrCode && transactionId;
  const highlightedFeatures = (PLAN_HIGHLIGHTS[plan] ?? []).slice(0, 4);
  const paymentTitle = provider === "aba_payway" ? "ABA PayWay" : "Bakong KHQR";
  const paymentHint =
    provider === "aba_payway"
      ? "Sandbox checkout for test payments."
      : "Scan once and we will verify it here.";

  const statusView = (() => {
    if (status === "succeeded") {
      return {
        icon: <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />,
        label: "Payment confirmed",
        tone: "border-emerald-200/80 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300",
      };
    }

    if (status === "polling") {
      return {
        icon: <RefreshCw className="size-4 animate-spin text-primary" />,
        label: "Checking payment",
        tone: "border-primary/15 bg-primary/8 text-foreground",
      };
    }

    if (status === "ready") {
      return {
        icon: <Clock className="size-4 text-primary" />,
        label: provider === "aba_payway" ? "Ready to simulate" : "Waiting for payment",
        tone: "border-border/80 bg-card/80 text-foreground",
      };
    }

    if (status === "failed" || status === "expired") {
      return {
        icon: <XCircle className="size-4 text-destructive" />,
        label: errorMsg ?? "Checkout unavailable",
        tone: "border-destructive/20 bg-destructive/8 text-destructive",
      };
    }

    return {
      icon: <Loader2 className="size-4 animate-spin text-primary" />,
      label: "Preparing checkout",
      tone: "border-border/80 bg-card/80 text-foreground",
    };
  })();

  return (
    <div className="space-y-8 pb-12">
      <section className="dashboard-surface p-6 md:p-8">
        <PageHeader
          eyebrow="Secure Checkout"
          title={`Pay for ${planConfig.name}`}
          description={`${formatMoney(displayPrice, "USD")} ${
            billingCycle === "annual" ? "per year" : "today"
          }.`}
          breadcrumbs={[
            { label: "Subscriptions", href: "/subscriptions" },
            { label: "Payments" },
          ]}
          actions={(
            <Link
              href="/subscriptions"
              className="inline-flex items-center gap-2 rounded-[calc(var(--radius-control)-2px)] border border-border/80 bg-card px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent/35"
            >
              <ChevronLeft className="size-4" />
              Back to subscriptions
            </Link>
          )}
        />

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card px-4 py-2 text-sm font-medium text-foreground">
            <span className="text-muted-foreground">{planConfig.name}</span>
            <span>{billingCycle === "annual" ? "Annual" : "Monthly"}</span>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card px-4 py-2 text-sm font-medium text-foreground">
            <span className="text-muted-foreground">Provider</span>
            <span>{paymentTitle}</span>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/8 px-4 py-2 text-sm font-semibold text-foreground">
            <span className="text-muted-foreground">Due</span>
            <span>{formatMoney(displayPrice, "USD")}</span>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_360px]">
        <div className="space-y-6">
          <article className="dashboard-surface p-5 md:p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  Payment Method
                </p>
                <h2 className="mt-2 text-[1.55rem] font-semibold tracking-[-0.03em] text-foreground">
                  Choose your provider
                </h2>
              </div>
              <div
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium ${statusView.tone}`}
                role={status === "failed" || status === "expired" ? "alert" : "status"}
                aria-live={status === "failed" || status === "expired" ? "assertive" : "polite"}
              >
                {statusView.icon}
                <span>{statusView.label}</span>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {(["bakong", "aba_payway"] as PaymentProvider[]).map((option) => {
                const isActive = provider === option;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setProvider(option)}
                    className={`rounded-[calc(var(--radius-panel)-6px)] border px-4 py-4 text-left transition ${
                      isActive
                        ? "border-primary/40 bg-primary/8 shadow-[var(--shadow-control)]"
                        : "border-border/80 bg-card/70 hover:border-primary/25 hover:bg-accent/20"
                    }`}
                  >
                    <p className="text-base font-semibold text-foreground">{providerLabel(option)}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {option === "aba_payway" ? "Sandbox payment" : "QR checkout"}
                    </p>
                  </button>
                );
              })}
            </div>
          </article>

          <article className="dashboard-surface p-5 md:p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  Checkout
                </p>
                <h2 className="mt-2 text-[1.7rem] font-semibold tracking-[-0.04em] text-foreground">
                  {paymentTitle}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">{paymentHint}</p>
              </div>

              {qrExpiresAt && (status === "ready" || status === "polling") ? (
                <CountdownDisplay seconds={secondsLeft} />
              ) : null}
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
              <div className="rounded-[calc(var(--radius-panel)-4px)] border border-border/70 bg-card/80 p-5 shadow-[var(--shadow-control)]">
                <p className="text-center text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  {provider === "aba_payway" ? "Sandbox" : "Scan to pay"}
                </p>

                {(status === "idle" || status === "loading") && (
                  <div className="qr-image mt-4 flex flex-col items-center justify-center gap-3 rounded-[calc(var(--radius-panel)-8px)] bg-surface-subtle">
                    <Loader2 className="size-10 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">
                      Preparing {providerLabel(provider)} checkout...
                    </p>
                  </div>
                )}

                {showInteractiveState && provider === "bakong" && (
                  <div className="relative mt-4">
                    <Image
                      src={
                        qrCode.startsWith("data:") || qrCode.startsWith("http")
                          ? qrCode
                          : `data:image/png;base64,${qrCode}`
                      }
                      alt="Bakong KHQR payment code"
                      className="qr-image rounded-xl"
                      width={230}
                      height={230}
                      unoptimized
                    />
                    {status === "polling" && (
                      <div className="absolute right-2 top-2 rounded-full bg-primary p-1.5 shadow">
                        <RefreshCw className="size-3 animate-spin text-white" />
                      </div>
                    )}
                  </div>
                )}

                {showInteractiveState && provider === "aba_payway" && (
                  <div className="mt-4 space-y-4">
                    <div className="flex justify-center rounded-[calc(var(--radius-panel)-8px)] border border-border bg-white p-4">
                      <QRCodeSVG value={qrCode} size={230} includeMargin />
                    </div>
                  </div>
                )}

                {status === "succeeded" && (
                  <div className="qr-image mt-4 flex flex-col items-center justify-center gap-3 rounded-[calc(var(--radius-panel)-8px)] bg-emerald-50 dark:bg-emerald-950/30">
                    <CheckCircle2 className="size-14 text-emerald-600 dark:text-emerald-400" />
                    <div className="text-center">
                      <p className="text-base font-bold text-emerald-700 dark:text-emerald-300">
                        Payment Confirmed
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Redirecting to confirmation...
                      </p>
                    </div>
                  </div>
                )}

                {(status === "failed" || status === "expired") && (
                  <div className="qr-image mt-4 flex flex-col items-center justify-center gap-3 rounded-[calc(var(--radius-panel)-8px)] bg-red-50 dark:bg-red-950/30">
                    <XCircle className="size-14 text-destructive" />
                    <div className="text-center">
                      <p className="text-sm font-bold text-destructive">
                        {status === "expired" ? "Session Expired" : "Payment Failed"}
                      </p>
                    </div>
                  </div>
                )}

                {canRetry && (
                  <Button
                    onClick={() => void initiateCheckout(provider)}
                    disabled={isCreating}
                    className="mt-4 w-full rounded-full"
                  >
                    {isCreating ? (
                      <>
                        <Loader2 className="mr-2 size-4 animate-spin" />
                        Regenerating...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="mr-2 size-4" />
                        Generate New Checkout
                      </>
                    )}
                  </Button>
                )}
              </div>

              <div className="space-y-4">
                <div className="rounded-[calc(var(--radius-panel)-6px)] border border-border/70 bg-card/80 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-foreground">Reference</p>
                    <span className="max-w-[14rem] truncate text-sm text-muted-foreground">
                      {externalReference ?? "Pending"}
                    </span>
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-foreground">Amount</p>
                    <span className="text-sm text-muted-foreground">{formatMoney(displayPrice, "USD")}</span>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    {providerMethods(provider).map((method) => (
                      <span
                        key={method}
                        className="rounded-full border border-border/70 bg-card px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground"
                      >
                        {method}
                      </span>
                    ))}
                  </div>
                </div>

                {provider === "bakong" &&
                  (status === "polling" || status === "ready") &&
                  transactionId && (
                    <button
                      type="button"
                      onClick={() => {
                        void checkPayment({ transactionId })
                          .unwrap()
                          .then((result) => {
                            if (result.status === "succeeded") {
                              stopPolling();
                              setStatus("succeeded");
                              setTimeout(() => {
                                redirectToSuccess("bakong", transactionId);
                              }, 1000);
                            }
                          });
                      }}
                      className="w-full rounded-[calc(var(--radius-panel)-6px)] border border-border/70 bg-card px-4 py-4 text-left text-sm font-medium text-foreground transition-colors hover:bg-accent/20 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/20"
                    >
                      I&apos;ve paid, check again
                    </button>
                  )}

                {provider === "aba_payway" &&
                  status === "ready" &&
                  transactionId && (
                    <Button
                      onClick={() => {
                        setErrorMsg(null);
                        void simulateAbaPaywayPayment({ transactionId })
                          .unwrap()
                          .then(() => {
                            setStatus("succeeded");
                            setTimeout(() => {
                              redirectToSuccess("aba_payway", transactionId);
                            }, 800);
                          })
                          .catch((error) => {
                            setStatus("failed");
                            setErrorMsg(
                              getApiErrorMessage(
                                error,
                                "Failed to simulate ABA PayWay payment.",
                              ),
                            );
                          });
                      }}
                      disabled={isSimulating}
                      className="w-full rounded-full"
                    >
                      {isSimulating ? (
                        <>
                          <Loader2 className="mr-2 size-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Simulate payment"
                      )}
                    </Button>
                  )}

                <div className="rounded-[calc(var(--radius-panel)-6px)] border border-border/70 bg-surface-subtle p-5">
                  <p className="text-sm font-medium text-muted-foreground">
                    {provider === "aba_payway"
                      ? "This checkout runs in sandbox mode."
                      : "Your subscription activates after payment confirmation."}
                  </p>
                </div>
              </div>
            </div>
          </article>
        </div>

        <aside className="space-y-6">
          <article className="dashboard-surface p-5 md:p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-[calc(var(--radius-control)-4px)] border border-border/70 bg-primary/12 text-primary">
                  {planIcon(plan)}
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">{planConfig.name} Plan</h2>
                  <p className="text-sm text-muted-foreground">
                    {billingCycle === "annual" ? "Annual plan" : "Monthly plan"}
                  </p>
                </div>
              </div>
              <span className="text-lg font-semibold text-foreground">{formatMoney(displayPrice, "USD")}</span>
            </div>

            <div className="mt-5 rounded-[calc(var(--radius-panel)-6px)] border border-border/70 bg-surface-subtle p-5">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                    Total
                  </p>
                  <p className="mt-2 text-[2rem] font-semibold tracking-[-0.05em] text-foreground">
                    {formatMoney(displayPrice, "USD")}
                  </p>
                </div>
                {billingCycle === "annual" && annualSavings > 0 ? (
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                    Save {formatMoney(annualSavings, "USD")}
                  </span>
                ) : null}
              </div>
            </div>

            <div className="mt-5 space-y-2">
              {highlightedFeatures.map((feature) => (
                <div key={feature} className="flex items-start gap-2 text-sm leading-6 text-secondary-foreground">
                  <CheckCircle2 className="mt-1 size-3.5 flex-shrink-0 text-primary" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-border/70 bg-card px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              <Lock className="size-3.5" />
              Secure 256-bit encryption
            </div>
          </article>
        </aside>
      </section>

      <footer className="flex items-center justify-between gap-4 rounded-[calc(var(--radius-panel)-2px)] border border-border/70 bg-card/60 px-5 py-4 text-sm text-muted-foreground">
        <p className="flex items-center gap-1.5">
          <Lock className="size-3.5" />
          Secure checkout
        </p>
        <p>© 2026 Syntrix</p>
      </footer>
    </div>
  );
}
