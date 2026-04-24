import {
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
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
import { cn } from "@/lib/utils";
import { MetricItem } from "@/features/owner-dashboard/dashboard-mock";

interface KpiCardProps {
  item: MetricItem;
  featured?: boolean;
}

function MetricIcon({ icon }: Pick<MetricItem, "icon">) {
  const className = "size-5 text-primary";

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

export function KpiCard({ item, featured = false }: KpiCardProps) {
  return (
    <Card className={cn(
      "dashboard-kpi-card dashboard-surface-hover shadow-none h-full",
      featured && "dashboard-kpi-card-featured",
    )}>
      <CardContent className="p-0">
        <div className="flex items-start justify-between gap-3">
          <p className="dashboard-kpi-card-label">{item.title}</p>
          <div className="dashboard-kpi-card-icon">
            <MetricIcon icon={item.icon} />
          </div>
        </div>

        <p className="dashboard-kpi-card-value">{item.value}</p>

        <div className="dashboard-kpi-card-footer">
          {item.change ? (
            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
              item.changeDirection === "up"
                ? "bg-emerald-50 text-emerald-700"
                : "bg-rose-50 text-rose-700"
            }`}>
              {item.changeDirection === "up" ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
              {item.change}
            </span>
          ) : null}
          <span className="text-muted-foreground">{item.compareLabel}</span>
        </div>
      </CardContent>
    </Card>
  );
}
