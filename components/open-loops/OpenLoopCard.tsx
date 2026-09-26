// components/open-loops/OpenLoopCard.tsx
// Used both as the Kanban card in OpenLoopBoard and as the stacked-card
// fallback OpenLoopTable renders on mobile — one card, two contexts.

import { StatusBadge } from "@/components/ui/StatusBadge";
import { PriorityBadge } from "@/components/ui/PriorityBadge";
import { CATEGORY_LABEL } from "@/lib/constants/workflow-categories";
import { formatShortDate } from "@/lib/utils/date";
import type { OpenLoop } from "@/types";

interface OpenLoopCardProps {
  loop: OpenLoop;
  onSelect: (id: string) => void;
}

export function OpenLoopCard({ loop, onSelect }: OpenLoopCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(loop.id)}
      aria-label={`Open ${loop.patientName}: ${loop.title}`}
      className="flex w-full flex-col gap-2 rounded-card border border-surface-border bg-white p-4 text-left shadow-card transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-semibold text-accent">{loop.patientName}</p>
        <PriorityBadge priority={loop.priority} />
      </div>
      <p className="text-xs text-accent/60">{CATEGORY_LABEL[loop.category]}</p>
      <div className="flex items-center justify-between pt-1">
        <StatusBadge status={loop.status} />
        <span className="text-xs text-accent/50">
          {loop.dueDate ? formatShortDate(loop.dueDate) : "No due date"}
        </span>
      </div>
    </button>
  );
}
