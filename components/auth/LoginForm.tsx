"use client";

// components/auth/LoginForm.tsx
// Fully functional Login UI: inline validation, loading state, and error
// handling, backed by the mock services/auth.service.ts via useAuth(). Real
// Supabase Auth wiring is a drop-in replacement for that service — this
// component doesn't change when that happens.

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/hooks/use-auth";

export function LoginForm() {
  const router = useRouter();
  const { submit, isSubmitting, errorMessage } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const success = await submit({ email, password });
    if (success) {
      router.push("/dashboard");
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      {errorMessage ? (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-lg bg-critical-light px-3 py-2.5 text-sm text-critical"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{errorMessage}</span>
        </div>
      ) : null}

      <Input
        label="Email"
        id="email"
        name="email"
        type="email"
        autoComplete="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="mae@clinic.com"
      />

      <Input
        label="Password"
        id="password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        placeholder="••••••••"
      />

      <Button
        type="submit"
        variant="primary"
        disabled={isSubmitting}
        aria-busy={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? "Signing In..." : "Sign In"}
      </Button>

      <button
        type="button"
        className="text-center text-sm font-medium text-secondary-dark hover:underline"
      >
        Forgot password?
      </button>
    </form>
  );
}
