"use client";

import { Eye, EyeOff, Lock } from "lucide-react";
import { useId, useState } from "react";
import { AuthField } from "@/components/auth/auth-field";
import { Input } from "@/components/ui/input";

interface AuthPasswordFieldProps {
  id?: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
  hint?: string;
}

export function AuthPasswordField({
  id,
  label,
  value,
  onChange,
  autoComplete,
  hint,
}: AuthPasswordFieldProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const [revealed, setRevealed] = useState(false);

  return (
    <AuthField id={fieldId} label={label} hint={hint} icon={<Lock className="size-4" />}>
      <Input
        id={fieldId}
        type={revealed ? "text" : "password"}
        value={value}
        autoComplete={autoComplete}
        onChange={(event) => onChange(event.target.value)}
        className="auth-input pr-11"
        required
      />
      <button
        type="button"
        className="auth-input-action"
        onClick={() => setRevealed((current) => !current)}
        aria-label={revealed ? "Hide password" : "Show password"}
        aria-pressed={revealed}
      >
        {revealed ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </AuthField>
  );
}
