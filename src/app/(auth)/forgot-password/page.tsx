"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForgotPasswordMutation } from "@/redux/services/api";

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

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    setErrorMessage(null);

    try {
      const result = await forgotPassword({ email }).unwrap();
      setMessage(result.message);
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "Unable to submit reset request."));
    }
  };

  return (
    <AuthShell title="Forgot Password" subtitle="Enter your email and we will send a secure password reset link.">
      <form className="space-y-4" onSubmit={handleSubmit}>
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

        {message ? (
          <p className="rounded-lg border border-[#b7e4c7] bg-[#ecfbf2] px-3 py-2 text-sm text-[#067647]">{message}</p>
        ) : null}
        {errorMessage ? (
          <p className="rounded-lg border border-[#fecaca] bg-[#fff1f2] px-3 py-2 text-sm text-[#b42318]">{errorMessage}</p>
        ) : null}

        <Button className="h-11 w-full rounded-xl bg-[#0f172a] text-white hover:bg-[#1e293b]" type="submit" disabled={isLoading}>
          {isLoading ? "Sending..." : "Send Reset Link"}
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
