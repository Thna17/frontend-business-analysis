import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AuthFieldProps {
  id: string;
  label: string;
  hint?: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function AuthField({
  id,
  label,
  hint,
  icon,
  children,
  className,
}: AuthFieldProps) {
  return (
    <div className={cn("auth-field", className)}>
      <div className="flex items-center justify-between gap-3">
        <label htmlFor={id} className="auth-field-label">
          {label}
        </label>
        {hint ? <span className="auth-field-hint">{hint}</span> : null}
      </div>
      <div className="auth-input-frame">
        {icon ? <span className="auth-input-icon">{icon}</span> : null}
        {children}
      </div>
    </div>
  );
}
