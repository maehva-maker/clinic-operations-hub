// components/workflow/WorkflowCategoryCard.tsx
// One large workflow card on the Wizard Home — reused for every domain
// section so Sleep Medicine and Weight Management render from the exact
// same markup.

import Link from "next/link";
import { ListChecks, ChevronRight } from "lucide-react";
import type { WorkflowDefinition } from "@/types";

interface WorkflowCategoryCardProps {
  definition: WorkflowDefinition;
}

export function WorkflowCategoryCard({ definition }: WorkflowCategoryCardProps) {
  return (
    <Link
      href={`/workflow-wizard/${definition.id}`}
      className="flex flex-col gap-3 rounded-card border border-surface-border bg-white p-5 shadow-card transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-light">
          <ListChecks className="h-5 w-5 text-primary-dark" aria-hidden="true" />
        </div>
        <ChevronRight className="h-5 w-5 shrink-0 text-accent/30" aria-hidden="true" />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-accent">{definition.title}</h3>
        <p className="mt-1 text-xs text-accent/60">
          {definition.steps.length} steps · {definition.requiredInformation.length} required items
        </p>
      </div>
    </Link>
  );
}
