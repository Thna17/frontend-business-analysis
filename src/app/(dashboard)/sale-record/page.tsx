import { KpiCard } from "@/components/dashboard/kpi-card";
import { SalesRecordWorkspace } from "@/components/dashboard/sales-record-workspace";
import { TopNavigation } from "@/components/dashboard/top-navigation";
import {
  saleRecordMetrics,
  saleRecordRows,
  topNavItems,
} from "@/features/owner-dashboard/dashboard-mock";

export default function SaleRecordPage() {
  return (
    <div className="dashboard-shell pb-14">
      <TopNavigation items={topNavItems} />

      <div className="dashboard-container mt-10 space-y-7">
        <section>
          <h1 className="dashboard-title">Sales Records</h1>
          <p className="dashboard-subtitle mt-2">Manage and track your business sales transactions</p>
        </section>

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {saleRecordMetrics.map((item) => (
            <KpiCard key={item.title} item={item} />
          ))}
        </section>

        <SalesRecordWorkspace initialRows={saleRecordRows} />

        <footer className="pt-16 text-center text-sm text-[#98a2b3]">
          © 2026 Syntrix. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
