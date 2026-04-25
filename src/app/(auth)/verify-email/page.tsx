"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { KeyRound, Loader2, Mail } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { AuthField } from "@/components/auth/auth-field";
import { AuthShell } from "@/components/auth/auth-shell";
import { StateMessage } from "@/components/shared/state-message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  getHomeRouteByRole,
  isPathAllowedForRole,
  sanitizeNextPath,
} from "@/features/auth/access-control";
import { getApiErrorMessage } from "@/lib/api-error";
import { setCredentials } from "@/store/slices/authSlice";
import { type AppDispatch } from "@/store";
import { useResendVerificationOtpMutation, useVerifyEmailOtpMutation } from "@/store/api";

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

      const requestedNext = sanitizeNextPath(searchParams.get("next"));
      if (requestedNext && isPathAllowedForRole(requestedNext, result.user.role)) {
        router.replace(requestedNext);
        return;
      }

      router.replace(getHomeRouteByRole(result.user.role));
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, "Unable to verify code."));
    }
  };

  const handleResend = async () => {
    setErrorMessage(null);
    setMessage(null);

    try {
      const result = await resendOtp({ email }).unwrap();
      setMessage(result.message);
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, "Unable to resend code."));
    }
  };

  return (
    <AuthShell title="Verify Your Email" subtitle="Enter the 6-digit OTP sent to your email to activate your account.">
      <form className="space-y-4" onSubmit={handleVerify}>
        <AuthField id="email" label="Email" hint="Required" icon={<Mail className="size-4" />}>
          <Input
            id="email"
            type="email"
            className="auth-input"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </AuthField>

        <AuthField id="otp-code" label="Verification Code" hint="6 digits" icon={<KeyRound className="size-4" />}>
          <Input
            id="otp-code"
            inputMode="numeric"
            maxLength={6}
            placeholder="123456"
            className="auth-input tracking-[0.2em]"
            value={code}
            onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))}
            required
          />
        </AuthField>

        {message ? (
          <StateMessage tone="success" message={message} />
        ) : null}
        {errorMessage ? (
          <StateMessage tone="danger" message={errorMessage} />
        ) : (
          <StateMessage
            tone="info"
            compact
            message="Enter the most recent 6-digit code we sent. If the code expires, request a new one below."
          />
        )}

        <Button className="h-11 w-full rounded-xl" variant="dark" type="submit" disabled={isVerifying}>
          {isVerifying ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Verifying...
            </>
          ) : "Verify Email"}
        </Button>

        <Button
          type="button"
          variant="outline"
          className="h-11 w-full rounded-xl"
          onClick={handleResend}
          disabled={isResending || email.trim().length === 0}
        >
          {isResending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Sending...
            </>
          ) : "Resend Code"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Back to{" "}
        <Link href="/login" className="font-semibold text-primary hover:text-primary/80">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
