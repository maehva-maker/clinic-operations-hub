import type { ReactNode } from "react";

// app/(auth)/layout.tsx
// Minimal, centered layout for unauthenticated pages — no Sidebar, no
// TopNavigation, no clinic data visible pre-auth.
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-primary-light via-white to-white px-4 py-12">
      {children}
    </div>
  );
}
