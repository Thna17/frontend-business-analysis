"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { Building2, Mail, UserRound } from "lucide-react";
import { AuthField } from "@/components/auth/auth-field";
import { AuthPasswordField } from "@/components/auth/auth-password-field";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { logout as clearAuthState } from "@/store/slices/authSlice";
import { type AppDispatch } from "@/store";
import { useRegisterMutation } from "@/store/api";
import { toast } from "sonner";

function getErrorMessage(error: unknown, fallback: string): string {
  const maybeError = error as { data?: { message?: string } };
  if (
    typeof maybeError === "object" &&
    maybeError !== null &&
    typeof maybeError.data?.message === "string"
  ) {
    return maybeError.data.message;
  }

  return fallback;
}

export default function SignupPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [fullName, setFullName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [register, { isLoading }] = useRegisterMutation();

  const passwordStrength = useMemo(() => {
    if (password.length >= 10) return { label: "Strong", color: "bg-emerald-500", width: "w-full" };
    if (password.length >= 6) return { label: "Medium", color: "bg-amber-500", width: "w-2/3" };
    if (password.length > 0) return { label: "Weak", color: "bg-rose-500", width: "w-1/3" };
    return { label: "Not set", color: "bg-slate-300", width: "w-0" };
  }, [password]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!agreeTerms) {
      toast.error("Please accept terms and conditions.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Password and confirm password do not match.");
      return;
    }

    try {
      dispatch(clearAuthState());

      await register({
        fullName: businessName ? `${fullName} (${businessName})` : fullName,
        email,
        password,
      }).unwrap();

      router.push(`/verify-email?email=${encodeURIComponent(email)}`);
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to create account."));
    }
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Join hundreds of business owners who track their growth with Syntrix."
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <AuthField id="full-name" label="Full name" icon={<UserRound className="size-4" />}>
            <Input
              id="full-name"
              className="auth-input"
              value={fullName}
              autoComplete="name"
              onChange={(event) => setFullName(event.target.value)}
              required
            />
          </AuthField>

          <AuthField
            id="business-name"
            label="Business name"
            hint="Optional"
            icon={<Building2 className="size-4" />}
          >
            <Input
              id="business-name"
              className="auth-input"
              value={businessName}
              autoComplete="organization"
              onChange={(event) => setBusinessName(event.target.value)}
            />
          </AuthField>
        </div>

        <AuthField id="email" label="Work email" icon={<Mail className="size-4" />}>
          <Input
            id="email"
            type="email"
            className="auth-input"
            value={email}
            autoComplete="email"
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </AuthField>

        <div className="grid gap-4 sm:grid-cols-2">
          <AuthPasswordField
            id="password"
            label="Password"
            value={password}
            autoComplete="new-password"
            onChange={setPassword}
          />
          <AuthPasswordField
            id="confirm-password"
            label="Confirm password"
            value={confirmPassword}
            autoComplete="new-password"
            onChange={setConfirmPassword}
          />
        </div>

        <div className="space-y-1.5">
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div className={`h-full rounded-full transition-all duration-200 ${passwordStrength.width} ${passwordStrength.color}`} />
          </div>
          <p className="text-xs text-muted-foreground">Password strength: {passwordStrength.label}</p>
        </div>

        <label className="inline-flex items-center gap-3 text-sm text-muted-foreground">
          <input
            type="checkbox"
            checked={agreeTerms}
            onChange={(event) => setAgreeTerms(event.target.checked)}
            className="size-4 rounded border-border accent-primary"
          />
          <span>I agree to the terms and privacy policy.</span>
        </label>

        <Button className="w-full" size="lg" type="submit" disabled={isLoading}>
          {isLoading ? "Creating account..." : "Create account"}
        </Button>

        <div className="auth-form-footer">
          <p className="text-sm text-muted-foreground">Already have an account?</p>
          <Link href="/login" className="auth-inline-link font-semibold">
            Sign in
          </Link>
        </div>
      </form>

    </AuthShell>
  );
}
