"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { KeyRound } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthField } from "@/components/auth/auth-field";
import { AuthPasswordField } from "@/components/auth/auth-password-field";
import { AuthShell } from "@/components/auth/auth-shell";
import { StateMessage } from "@/components/shared/state-message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useResetPasswordMutation } from "@/store/api";

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

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tokenFromQuery = useMemo(() => searchParams.get("token") ?? "", [searchParams]);

  const [token, setToken] = useState(tokenFromQuery);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    setErrorMessage(null);

    if (newPassword !== confirmPassword) {
      setErrorMessage("Password and confirm password do not match.");
      return;
    }

    try {
      const result = await resetPassword({ token, newPassword }).unwrap();
      setMessage(result.message);
      setTimeout(() => {
        router.push("/login");
      }, 1200);
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "Unable to reset password."));
    }
  };

  return (
    <AuthShell title="Reset Password" subtitle="Set your new password using the secure token from your email.">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <AuthField id="token" label="Reset Token" hint="From email" icon={<KeyRound className="size-4" />}>
          <Input
            id="token"
            className="auth-input"
            value={token}
            onChange={(event) => setToken(event.target.value)}
            required
          />
        </AuthField>

        <AuthPasswordField
          id="new-password"
          label="New Password"
          value={newPassword}
          onChange={setNewPassword}
          autoComplete="new-password"
        />

        <AuthPasswordField
          id="confirm-password"
          label="Confirm Password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          autoComplete="new-password"
        />

        {message ? (
          <StateMessage tone="success" message={message} />
        ) : null}
        {errorMessage ? (
          <StateMessage tone="danger" message={errorMessage} />
        ) : null}

        <Button className="h-11 w-full rounded-xl" variant="dark" type="submit" disabled={isLoading}>
          {isLoading ? "Resetting..." : "Reset Password"}
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
