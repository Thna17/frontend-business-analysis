import {
  AlertTriangle,
  ArrowUpRight,
  Building2,
  CalendarDays,
  Box,
  DollarSign,
  ShoppingCart,
  Star,
  UserRound,
  UserRoundMinus,
} from "lucide-react";
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
  if (icon === "today") return <ArrowUpRight className={className} />;
  if (icon === "product") return <Box className={className} />;
  if (icon === "star") return <Star className={className} />;
  if (icon === "calendar") return <CalendarDays className={className} />;
  if (icon === "business") return <Building2 className={className} />;
  if (icon === "alert") return <AlertTriangle className="size-5 text-rose-600" />;

  return <DollarSign className={className} />;
}

export function KpiCard({ item }: KpiCardProps) {
  return (
    <Card className="dashboard-kpi-card shadow-none">
      <CardContent className="p-0">
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm font-medium text-muted-foreground">{item.title}</p>
          <MetricIcon icon={item.icon} />
        </div>

        <p className="mt-7 text-[1.95rem] font-semibold tracking-tight text-foreground">{item.value}</p>

        <div className="mt-3 flex items-center gap-2 text-sm">
          {item.change ? (
            <span className={item.changeDirection === "up" ? "text-emerald-600" : "text-rose-600"}>
              {item.change}
            </span>
          ) : null}
          <span className="text-muted-foreground">{item.compareLabel}</span>
        </div>
      </CardContent>
    </Card>
  );
}
