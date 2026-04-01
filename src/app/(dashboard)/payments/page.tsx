import { TopNavigation } from "@/components/dashboard/top-navigation";
import OrderSummaryCard from "@/components/payments/OrderSummaryCard";
import PaymentFooter from "@/components/payments/PaymentFooter";
import PaymentHero from "@/components/payments/PaymentHero";
import PaymentQRCard from "@/components/payments/PaymentQRCard";
import { topNavItems } from "@/features/owner-dashboard/dashboard-mock";

export default function PaymentsPage() {
  return (
    <main className="payments-page">
      <TopNavigation items={topNavItems} />

      <div className="dashboard-container mt-10 space-y-6 pb-12">
        <PaymentHero />

        <section className="payment-content-shell">
          <div className="payment-content">
            <div className="payment-left">
              <PaymentQRCard />
            </div>

            <div className="payment-right">
              <OrderSummaryCard />
            </div>
          </div>
        </section>

        <PaymentFooter />
      </div>
    </main>
  );
}
