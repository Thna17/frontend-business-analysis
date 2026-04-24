import { DashboardPage } from "@/components/dashboard/dashboard-page";
import PaymentQRCard from "@/components/payments/PaymentQRCard";
import OrderSummaryCard from "@/components/payments/OrderSummaryCard";
import PaymentFooter from "@/components/payments/PaymentFooter";

export default function PaymentsPage() {
  return (
    <DashboardPage className="pb-[18px]" footer={<PaymentFooter />}>
        <section className="grid lg:grid-cols-[1fr_400px] gap-8 mt-8">
          <div className="flex justify-center items-start">
            <PaymentQRCard />
          </div>

          <div className="flex flex-col gap-6">
            <OrderSummaryCard />
          </div>
        </section>
    </DashboardPage>
  );
}
