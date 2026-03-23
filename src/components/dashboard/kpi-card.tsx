import { DollarSign, ShoppingCart, UserRound, UserRoundMinus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { MetricItem } from "@/features/owner-dashboard/dashboard-mock";

interface KpiCardProps {
  item: MetricItem;
}

function MetricIcon({ icon }: Pick<MetricItem, "icon">) {
  const className = "size-5 text-[#d4af35]";

  if (icon === "users") return <UserRound className={className} />;
  if (icon === "churn") return <UserRoundMinus className={className} />;
  if (icon === "aov") return <ShoppingCart className={className} />;

  return <DollarSign className={className} />;
}

export function KpiCard({ item }: KpiCardProps) {
  return (
    <Card className="dashboard-kpi-card border-[#e7e9ee] shadow-none">
      <CardContent className="p-0">
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm font-medium text-[#667085]">{item.title}</p>
          <MetricIcon icon={item.icon} />
        </div>

        <p className="mt-7 text-5xl font-semibold tracking-tight text-[#101828]">{item.value}</p>

        <div className="mt-3 flex items-center gap-2 text-sm">
          <span className={item.changeDirection === "up" ? "text-emerald-600" : "text-rose-600"}>
            {item.change}
          </span>
          <span className="text-[#98a2b3]">{item.compareLabel}</span>
        </div>
      </CardContent>
    </Card>
  );
}
