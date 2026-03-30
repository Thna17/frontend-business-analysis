"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  getHomeRouteByRole,
  isPathAllowedForRole,
  sanitizeNextPath,
} from "@/features/auth/access-control";
import { setCredentials } from "@/store/slices/authSlice";
import { type AppDispatch } from "@/store";
import { useLoginMutation } from "@/store/api";

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

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [login, { isLoading }] = useLoginMutation();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);

    try {
      const result = await login({ email, password }).unwrap();
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
      const message = getErrorMessage(error, "Unable to sign in. Please try again.");
      if (message.toLowerCase().includes("verification")) {
        const requestedNext = sanitizeNextPath(searchParams.get("next"));
        const nextQuery = requestedNext ? `&next=${encodeURIComponent(requestedNext)}` : "";
        router.push(`/verify-email?email=${encodeURIComponent(email)}${nextQuery}`);
        return;
      }
      setErrorMessage(message);
    }
  };

  return (
    <AuthShell title="Welcome Back" subtitle="Sign in to continue managing your analytics and business operations.">
      <form className="space-y-4" onSubmit={handleSubmit}>
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

        <div className="flex items-center justify-end py-1">
          <Link href="/forgot-password" className="text-sm font-medium text-[#8a6b0b] hover:text-[#6e5504]">
            Forgot password?
          </Link>
        </div>

        {errorMessage ? (
          <p className="rounded-lg border border-[#fecaca] bg-[#fff1f2] px-3 py-2 text-sm text-[#b42318]">{errorMessage}</p>
        ) : null}

        <Button
          className="h-11 w-full rounded-xl bg-[#0f172a] text-sm font-semibold text-white hover:bg-[#1e293b]"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-[#667085]">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-semibold text-[#8a6b0b] hover:text-[#6e5504]">
          Create account
        </Link>
      </p>
    </AuthShell>
  );
}
