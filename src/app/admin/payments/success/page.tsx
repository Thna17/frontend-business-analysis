import { DashboardPage } from "@/components/dashboard/dashboard-page";
import SuccessCard from "@/components/payments/success/SuccessCard";
import SuccessFooter from "@/components/payments/success/SuccessFooter";

// Admin-facing payment success page for sandbox and support flows.
export default function PaymentSuccessPage() {
  return (
    <DashboardPage className="pb-[18px]" footer={<SuccessFooter />}>
        <section className="mt-8">
          <SuccessCard />
        </section>
    </DashboardPage>
  );
}
