"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { Loader2, Mail } from "lucide-react";
import { AuthField } from "@/components/auth/auth-field";
import { AuthPasswordField } from "@/components/auth/auth-password-field";
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
import { useLoginMutation } from "@/store/api";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [login, { isLoading }] = useLoginMutation();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);

    try {
      const result = await login({ email: email.trim(), password }).unwrap();
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
      const message = getApiErrorMessage(error, "Unable to sign in. Please try again.");
      if (message.toLowerCase().includes("verification")) {
        const requestedNext = sanitizeNextPath(searchParams.get("next"));
        const nextQuery = requestedNext ? `&next=${encodeURIComponent(requestedNext)}` : "";
        router.push(`/verify-email?email=${encodeURIComponent(email)}${nextQuery}`);
        return;
      }
      setErrorMessage(message);
      toast.error(message);
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Good to see you again. Your dashboard is ready."
    >
      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        <AuthField id="email" label="Work email" icon={<Mail className="size-4" />}>
          <Input
            id="email"
            type="email"
            className="auth-input"
            value={email}
            autoComplete="email"
            inputMode="email"
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </AuthField>

        <AuthPasswordField
          id="password"
          label="Password"
          value={password}
          autoComplete="current-password"
          onChange={setPassword}
          hint="Case sensitive"
        />

        {errorMessage ? (
          <StateMessage
            tone="danger"
            title="Sign-in failed"
            message={errorMessage}
          />
        ) : (
          <StateMessage
            tone="info"
            compact
            message="Use the same email you registered with. If your account is not verified yet, we will route you to email verification."
          />
        )}

        <div className="flex items-center justify-end py-1">
          <Link href="/forgot-password" className="auth-inline-link">
            Forgot password?
          </Link>
        </div>

        <Button className="w-full" size="lg" type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Signing in...
            </>
          ) : "Sign in"}
        </Button>

        <div className="auth-form-footer">
          <p className="text-sm text-muted-foreground">Don&apos;t have an account?</p>
          <Link href="/signup" className="auth-inline-link font-semibold">
            Create account
          </Link>
        </div>
      </form>
    </AuthShell>
  );
}
