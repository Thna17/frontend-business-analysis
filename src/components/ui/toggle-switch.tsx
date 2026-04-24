"use client";

import { cn } from "@/lib/utils";

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (next: boolean) => void;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  id?: string;
}

export function ToggleSwitch({
  checked,
  onChange,
  disabled = false,
  className,
  ...props
}: ToggleSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      {...props}
      className={cn(
        "relative inline-flex h-7 w-14 items-center rounded-full border border-transparent transition-[background-color,border-color,box-shadow] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/25 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        checked ? "bg-primary" : "bg-muted border-border/80",
        disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
        className,
      )}
    >
      <span
        className={cn(
          "absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow-[var(--shadow-control)] transition-transform",
          checked ? "translate-x-7" : "translate-x-0",
        )}
      />
    </button>
  );
}
