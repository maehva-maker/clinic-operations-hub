import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/LoginForm";
import { Moon } from "lucide-react";

export const metadata: Metadata = {
  title: "Sign In",
};

// app/(auth)/login/page.tsx
// Server component shell around the interactive LoginForm — keeps the page
// itself trivially static while the form owns all client-side state.
export default function LoginPage() {
  return (
    <div className="w-full max-w-[400px]">
      <div className="mb-8 flex flex-col items-center text-center">
        <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white shadow-card">
          <Moon className="h-6 w-6" aria-hidden="true" />
        </span>
        <h1 className="text-xl font-bold text-accent">Clinic Operations Hub</h1>
        <p className="mt-1 text-sm text-accent/60">
          Sleep Medicine · Weight Management
        </p>
      </div>

      <div className="rounded-card border border-surface-border bg-white p-6 shadow-card sm:p-8">
        <LoginForm />
      </div>
    </div>
  );
}
