import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";

// app/(dashboard)/not-found.tsx
// Scoped 404 inside the authenticated shell, so a mistyped route still shows
// the Sidebar/TopNav instead of a bare Next.js error page.
export default function DashboardNotFound() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Page not found" />
      <div className="rounded-card border border-surface-border bg-white p-8 text-center shadow-card">
        <p className="text-sm text-accent/60">
          That page doesn&apos;t exist yet.{" "}
          <Link href="/dashboard" className="font-semibold text-secondary-dark hover:underline">
            Return to Dashboard
          </Link>
        </p>
      </div>
    </div>
  );
}
