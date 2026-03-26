"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { setCredentials } from "@/redux/features/auth/authSlice";
import { type AppDispatch } from "@/redux/store";
import { useResendVerificationOtpMutation, useVerifyEmailOtpMutation } from "@/redux/services/api";

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

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();

  const defaultEmail = useMemo(() => searchParams.get("email") ?? "", [searchParams]);
  const [email, setEmail] = useState(defaultEmail);
  const [code, setCode] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [verifyOtp, { isLoading: isVerifying }] = useVerifyEmailOtpMutation();
  const [resendOtp, { isLoading: isResending }] = useResendVerificationOtpMutation();

  const handleVerify = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setMessage(null);

    try {
      const result = await verifyOtp({ email, code }).unwrap();
      dispatch(
        setCredentials({
          user: result.user,
          token: result.accessToken,
        }),
      );
      router.push(result.user.role === "business_owner" ? "/owner" : "/admin");
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "Unable to verify code."));
    }
  };

  const handleResend = async () => {
    setErrorMessage(null);
    setMessage(null);

    try {
      const result = await resendOtp({ email }).unwrap();
      setMessage(result.message);
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "Unable to resend code."));
    }
  };

  return (
    <AuthShell title="Verify Your Email" subtitle="Enter the 6-digit OTP sent to your email to activate your account.">
      <form className="space-y-4" onSubmit={handleVerify}>
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-medium text-[#344054]">
            Email
          </label>
          <Input
            id="email"
            type="email"
            className="h-11 border-[#d0d5dd] bg-white"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="otp-code" className="text-sm font-medium text-[#344054]">
            Verification Code
          </label>
          <Input
            id="otp-code"
            inputMode="numeric"
            maxLength={6}
            placeholder="123456"
            className="h-11 border-[#d0d5dd] bg-white tracking-[0.2em]"
            value={code}
            onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))}
            required
          />
        </div>

        {message ? (
          <p className="rounded-lg border border-[#b7e4c7] bg-[#ecfbf2] px-3 py-2 text-sm text-[#067647]">{message}</p>
        ) : null}
        {errorMessage ? (
          <p className="rounded-lg border border-[#fecaca] bg-[#fff1f2] px-3 py-2 text-sm text-[#b42318]">{errorMessage}</p>
        ) : null}

        <Button className="h-11 w-full rounded-xl bg-[#0f172a] text-white hover:bg-[#1e293b]" type="submit" disabled={isVerifying}>
          {isVerifying ? "Verifying..." : "Verify Email"}
        </Button>

        <Button
          type="button"
          variant="outline"
          className="h-11 w-full rounded-xl"
          onClick={handleResend}
          disabled={isResending}
        >
          {isResending ? "Sending..." : "Resend Code"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-[#667085]">
        Back to{" "}
        <Link href="/login" className="font-semibold text-[#8a6b0b] hover:text-[#6e5504]">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
