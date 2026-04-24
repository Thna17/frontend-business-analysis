import { DashboardPage } from "@/components/dashboard/dashboard-page";
import SuccessCard from "@/components/payments/success/SuccessCard";
import SuccessFooter from "@/components/payments/success/SuccessFooter";

export default function PaymentSuccessPage() {
  return (
    <DashboardPage className="payment-success-page space-y-6 pb-12" footer={<SuccessFooter />}>
        <section className="payment-success-header dashboard-surface">
          <p className="payment-success-kicker">Subscription Upgrade</p>
          <h1 className="dashboard-title">Payment received</h1>
          <p className="dashboard-subtitle mt-2 max-w-2xl">
            Your plan is active and ready to use.
          </p>
        </section>

        <section className="payment-success-shell">
          <section className="payment-success-section">
            <SuccessCard />
          </section>
        </section>
    </DashboardPage>
  );
}
