// components/sop/CommonMistakeCard.tsx
// Renders one common-mistake as a warning card rather than plain text, per
// the Phase 7 brief — reused by every Workflow Guide and Software Guide.

import { AlertTriangle } from "lucide-react";

interface CommonMistakeCardProps {
  mistake: string;
}

export function CommonMistakeCard({ mistake }: CommonMistakeCardProps) {
  return (
    <div className="flex items-start gap-2 rounded-card border border-warning bg-warning-light px-3 py-2.5">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" aria-hidden="true" />
      <p className="text-sm text-accent/80">{mistake}</p>
    </div>
  );
}
