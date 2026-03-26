"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useResetPasswordMutation } from "@/redux/services/api";

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
        <div className="space-y-1.5">
          <label htmlFor="token" className="text-sm font-medium text-[#344054]">
            Reset Token
          </label>
          <Input
            id="token"
            className="h-11 border-[#d0d5dd] bg-white"
            value={token}
            onChange={(event) => setToken(event.target.value)}
            required
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="new-password" className="text-sm font-medium text-[#344054]">
            New Password
          </label>
          <Input
            id="new-password"
            type="password"
            className="h-11 border-[#d0d5dd] bg-white"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            required
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="confirm-password" className="text-sm font-medium text-[#344054]">
            Confirm Password
          </label>
          <Input
            id="confirm-password"
            type="password"
            className="h-11 border-[#d0d5dd] bg-white"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
          />
        </div>

        {message ? (
          <p className="rounded-lg border border-[#b7e4c7] bg-[#ecfbf2] px-3 py-2 text-sm text-[#067647]">{message}</p>
        ) : null}
        {errorMessage ? (
          <p className="rounded-lg border border-[#fecaca] bg-[#fff1f2] px-3 py-2 text-sm text-[#b42318]">{errorMessage}</p>
        ) : null}

        <Button className="h-11 w-full rounded-xl bg-[#0f172a] text-white hover:bg-[#1e293b]" type="submit" disabled={isLoading}>
          {isLoading ? "Resetting..." : "Reset Password"}
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
