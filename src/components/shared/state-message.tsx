import { ReactNode } from "react";
import { AlertTriangle, CheckCircle2, Info, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type StateTone = "info" | "success" | "warning" | "danger" | "loading";

interface StateMessageProps {
  tone?: StateTone;
  title?: string;
  message: string;
  icon?: ReactNode;
  className?: string;
  compact?: boolean;
}

const toneClassName: Record<StateTone, string> = {
  info: "dashboard-inline-feedback-info",
  success: "dashboard-inline-feedback-success",
  warning: "dashboard-inline-feedback-warning",
  danger: "dashboard-inline-feedback-danger",
  loading: "dashboard-inline-feedback-loading",
};

function defaultIcon(tone: StateTone) {
  if (tone === "success") return <CheckCircle2 className="mt-0.5 size-4 shrink-0" />;
  if (tone === "warning") return <AlertTriangle className="mt-0.5 size-4 shrink-0" />;
  if (tone === "danger") return <AlertTriangle className="mt-0.5 size-4 shrink-0" />;
  if (tone === "loading") return <Loader2 className="mt-0.5 size-4 shrink-0 animate-spin" />;
  return <Info className="mt-0.5 size-4 shrink-0" />;
}

export function StateMessage({
  tone = "info",
  title,
  message,
  icon,
  className,
  compact = false,
}: StateMessageProps) {
  return (
    <div
      role={tone === "danger" ? "alert" : "status"}
      aria-live={tone === "danger" ? "assertive" : "polite"}
      className={cn(
        "dashboard-inline-feedback",
        toneClassName[tone],
        compact && "px-3 py-2",
        className,
      )}
    >
      {icon ?? defaultIcon(tone)}
      <div className="min-w-0 space-y-0.5">
        {title ? <p className="font-semibold text-current">{title}</p> : null}
        <p>{message}</p>
      </div>
    </div>
  );
}
