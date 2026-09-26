// components/sop/QuickReferenceCard.tsx
// The colored info-card row every article opens with: Estimated Time,
// Software Needed, Output, Difficulty, Related Documentation Template. One
// component, reused by both Workflow Guides and Software Guides so the two
// article types look and behave identically at a glance.

import { Clock, Wrench, FileOutput, GaugeCircle, FileText } from "lucide-react";
import { getTemplateById } from "@/lib/constants/documentation-templates";
import { cn } from "@/lib/utils/cn";
import type { QuickReference } from "@/types";

interface QuickReferenceCardProps {
  quickReference: QuickReference;
}

const DIFFICULTY_STYLES: Record<QuickReference["difficulty"], string> = {
  beginner: "bg-success-light text-success",
  intermediate: "bg-warning-light text-warning",
};

const DIFFICULTY_LABEL: Record<QuickReference["difficulty"], string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
};

function Tile({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof Clock;
  label: string;
  value: string;
  tone?: string;
}) {
  return (
    <div className="flex flex-col gap-1 rounded-card border border-surface-border bg-surface p-3">
      <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-accent/40">
        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
        {label}
      </span>
      <span className={cn("text-sm font-medium text-accent", tone)}>{value}</span>
    </div>
  );
}

export function QuickReferenceCard({ quickReference }: QuickReferenceCardProps) {
  const template = quickReference.relatedDocumentationTemplateId
    ? getTemplateById(quickReference.relatedDocumentationTemplateId)
    : null;

  return (
    <div
      aria-label="Quick reference"
      className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
    >
      <Tile icon={Clock} label="Estimated Time" value={quickReference.estimatedTime} />
      <Tile icon={Wrench} label="Software Needed" value={quickReference.softwareNeeded.join(", ")} />
      <Tile icon={FileOutput} label="Output" value={quickReference.output} />
      <div className="flex flex-col gap-1 rounded-card border border-surface-border bg-surface p-3">
        <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-accent/40">
          <GaugeCircle className="h-3.5 w-3.5" aria-hidden="true" />
          Difficulty
        </span>
        <span
          className={cn(
            "inline-flex w-fit items-center rounded-pill px-2 py-0.5 text-xs font-semibold",
            DIFFICULTY_STYLES[quickReference.difficulty],
          )}
        >
          {DIFFICULTY_LABEL[quickReference.difficulty]}
        </span>
      </div>
      <Tile icon={FileText} label="Related Documentation" value={template ? template.label : "None"} />
    </div>
  );
}
