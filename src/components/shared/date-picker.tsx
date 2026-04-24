import { CalendarDays } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function DatePicker({
  value,
  onChange,
  className,
  ariaLabel = "Choose date",
}: {
  value: string,
  onChange: (v: string) => void,
  className?: string,
  ariaLabel?: string,
}) {
  return (
    <div className={cn("flex h-11 min-w-0 items-center gap-2 rounded-[var(--radius-control)] border border-[color:var(--control-border)] bg-[var(--control-bg)] px-3 shadow-[var(--shadow-control)]", className)}>
      <CalendarDays className="size-4 shrink-0 text-muted-foreground" />
      <Input
        type="date"
        aria-label={ariaLabel}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-full min-w-0 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
      />
    </div>
  );
}

export function DateRangePicker({ 
  startDate, 
  endDate, 
  onStartDateChange, 
  onEndDateChange,
  className,
  startAriaLabel = "Choose start date",
  endAriaLabel = "Choose end date",
}: { 
  startDate: string, endDate: string, onStartDateChange: (v: string) => void, onEndDateChange: (v: string) => void, className?: string, startAriaLabel?: string, endAriaLabel?: string 
}) {
  return (
    <div className={cn("flex h-11 min-w-0 items-center gap-2 rounded-[var(--radius-control)] border border-[color:var(--control-border)] bg-[var(--control-bg)] px-3 shadow-[var(--shadow-control)]", className)}>
      <CalendarDays className="size-4 shrink-0 text-muted-foreground" />
      <Input
        type="date"
        aria-label={startAriaLabel}
        value={startDate}
        onChange={(e) => onStartDateChange(e.target.value)}
        className="h-full min-w-0 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0 !w-[130px]"
      />
      <span className="text-muted-foreground font-medium px-1">-</span>
      <Input
        type="date"
        aria-label={endAriaLabel}
        value={endDate}
        onChange={(e) => onEndDateChange(e.target.value)}
        className="h-full min-w-0 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0 !w-[130px]"
      />
    </div>
  );
}
