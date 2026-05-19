import { DashboardPage } from "@/components/dashboard/dashboard-page";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import SuccessCard from "@/components/payments/success/SuccessCard";
import SuccessFooter from "@/components/payments/success/SuccessFooter";

// Success page shown after a checkout flow returns to the dashboard.
export default function PaymentSuccessPage() {
  return (
    <DashboardPage className="space-y-8 pb-12" footer={<SuccessFooter />}>
      <section className="dashboard-surface p-6 md:p-8">
        <PageHeader
          eyebrow="Payment Confirmed"
          title="Payment received"
          description="Your subscription is active and ready to use."
          breadcrumbs={[
            { label: "Subscriptions", href: "/subscriptions" },
            { label: "Payments", href: "/payments" },
            { label: "Success" },
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
      </section>

      <SuccessCard />
    </DashboardPage>
  );
}
