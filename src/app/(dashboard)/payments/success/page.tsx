import { TopNavigation } from "@/components/dashboard/top-navigation";
import SuccessCard from "@/components/payments/success/SuccessCard";
import SuccessFooter from "@/components/payments/success/SuccessFooter";
import { topNavItems } from "@/features/owner-dashboard/dashboard-mock";

export default function PaymentSuccessPage() {
  return (
    <main className="payment-success-page">
      <TopNavigation items={topNavItems} />

      <div className="dashboard-container mt-10 space-y-6 pb-12">
        <section className="payment-success-header dashboard-surface">
          <p className="payment-success-kicker">Subscription Upgrade</p>
          <h1 className="dashboard-title">Confirmation</h1>
          <p className="dashboard-subtitle mt-2 max-w-2xl">
            Your payment has been confirmed and your plan is now active.
          </p>
        </section>

        <section className="payment-success-shell">
          <section className="payment-success-section">
            <SuccessCard />
          </section>
        </section>

        <SuccessFooter />
      </div>
    </main>
  );
}
