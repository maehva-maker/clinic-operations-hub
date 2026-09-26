// components/shared/PlaceholderPage.tsx
// Used by every route flagged `comingSoon` in lib/constants/navigation.ts.
// Keeps the correct shell, header, and nav active while signaling honestly
// that the module's real UI hasn't been built yet, rather than 404ing.

import { PageHeader } from "@/components/layout/PageHeader";
import { Construction } from "lucide-react";

interface PlaceholderPageProps {
  title: string;
  description: string;
  phase: string;
}

export function PlaceholderPage({
  title,
  description,
  phase,
}: PlaceholderPageProps) {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={title} description={description} />
      <div className="flex flex-col items-center justify-center rounded-card border border-dashed border-surface-border bg-white px-6 py-20 text-center shadow-card">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary-light">
          <Construction className="h-6 w-6 text-secondary-dark" aria-hidden="true" />
        </div>
        <h2 className="text-lg font-semibold text-accent">
          {title} is coming in {phase}
        </h2>
        <p className="mt-2 max-w-md text-sm text-accent/60">
          This module is fully specified in the Phase 1.5 PRD and Phase 2
          wireframes. The navigation and page shell are live now; the working
          UI for {title.toLowerCase()} arrives in {phase}.
        </p>
      </div>
    </div>
  );
}
