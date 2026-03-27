"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Eye, EyeOff, Lock, Mail, UserRound } from "lucide-react";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRegisterMutation } from "@/redux/services/api";

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
  const [fullName, setFullName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [register, { isLoading }] = useRegisterMutation();

  const passwordStrength = useMemo(() => {
    if (password.length >= 10) return { label: "Strong", color: "bg-emerald-500", width: "w-full" };
    if (password.length >= 6) return { label: "Medium", color: "bg-amber-500", width: "w-2/3" };
    if (password.length > 0) return { label: "Weak", color: "bg-rose-500", width: "w-1/3" };
    return { label: "Not set", color: "bg-slate-300", width: "w-0" };
  }, [password]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);

    if (!agreeTerms) {
      setErrorMessage("Please accept terms and conditions.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Password and confirm password do not match.");
      return;
    }

    try {
      await register({
        fullName: businessName ? `${fullName} (${businessName})` : fullName,
        email,
        password,
      }).unwrap();

      router.push(`/verify-email?email=${encodeURIComponent(email)}`);
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "Unable to create account."));
    }
  };

  return (
    <AuthShell title="Create Your Account" subtitle="Start managing sales, analytics, and subscriptions in one platform.">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label htmlFor="full-name" className="text-sm font-medium text-[#344054]">
              Full Name
            </label>
            <div className="relative">
              <UserRound className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#98a2b3]" />
              <Input
                id="full-name"
                className="h-11 border-[#d0d5dd] bg-white pl-9"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="business-name" className="text-sm font-medium text-[#344054]">
              Business Name
            </label>
            <div className="relative">
              <Building2 className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#98a2b3]" />
              <Input
                id="business-name"
                className="h-11 border-[#d0d5dd] bg-white pl-9"
                value={businessName}
                onChange={(event) => setBusinessName(event.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-medium text-[#344054]">
            Email
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#98a2b3]" />
            <Input
              id="email"
              type="email"
              className="h-11 border-[#d0d5dd] bg-white pl-9"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label htmlFor="password" className="text-sm font-medium text-[#344054]">
              Password
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#98a2b3]" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                className="h-11 border-[#d0d5dd] pl-9 pr-10"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
              <button
                type="button"
                className="absolute top-1/2 right-3 -translate-y-1/2 text-[#98a2b3] hover:text-[#667085]"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="confirm-password" className="text-sm font-medium text-[#344054]">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#98a2b3]" />
              <Input
                id="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                className="h-11 border-[#d0d5dd] pl-9 pr-10"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
              />
              <button
                type="button"
                className="absolute top-1/2 right-3 -translate-y-1/2 text-[#98a2b3] hover:text-[#667085]"
                onClick={() => setShowConfirmPassword((value) => !value)}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="h-1.5 w-full rounded-full bg-[#eaecf0]">
            <div className={`h-full rounded-full transition-all ${passwordStrength.width} ${passwordStrength.color}`} />
          </div>
          <p className="text-xs text-[#667085]">Password strength: {passwordStrength.label}</p>
        </div>

        <label className="inline-flex items-center gap-2 text-sm text-[#475467]">
          <input
            type="checkbox"
            checked={agreeTerms}
            onChange={(event) => setAgreeTerms(event.target.checked)}
            className="size-4 rounded border-[#d0d5dd] accent-[#d4af35]"
          />
          I agree to the terms and privacy policy.
        </label>

        {errorMessage ? (
          <p className="rounded-lg border border-[#fecaca] bg-[#fff1f2] px-3 py-2 text-sm text-[#b42318]">{errorMessage}</p>
        ) : null}

        <Button
          className="h-11 w-full rounded-xl bg-[#0f172a] text-sm font-semibold text-white hover:bg-[#1e293b]"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Creating account..." : "Create account"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-[#667085]">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-[#8a6b0b] hover:text-[#6e5504]">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
