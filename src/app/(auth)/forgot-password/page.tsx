"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { Loader2, Mail } from "lucide-react";
import { AuthField } from "@/components/auth/auth-field";
import { AuthShell } from "@/components/auth/auth-shell";
import { StateMessage } from "@/components/shared/state-message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getApiErrorMessage } from "@/lib/api-error";
import { useForgotPasswordMutation } from "@/store/api";

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
      setErrorMessage(getApiErrorMessage(error, "Unable to submit reset request."));
    }
  };

  return (
    <AuthShell title="Forgot Password" subtitle="Enter your email and we will send a secure password reset link.">
      <form className="space-y-4" onSubmit={handleSubmit}>
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

        {message ? (
          <StateMessage tone="success" message={message} />
        ) : null}
        {errorMessage ? (
          <StateMessage tone="danger" message={errorMessage} />
        ) : (
          <StateMessage
            tone="info"
            compact
            message="We will email a reset link if an account exists for this address."
          />
        )}

        <Button className="h-11 w-full rounded-xl" variant="dark" type="submit" disabled={isLoading || email.trim().length === 0}>
          {isLoading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Sending...
            </>
          ) : "Send Reset Link"}
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
