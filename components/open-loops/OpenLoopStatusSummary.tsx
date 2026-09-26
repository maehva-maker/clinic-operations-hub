// components/open-loops/OpenLoopStatusSummary.tsx
// The "New: 3   In Progress: 5   Waiting: 6..." strip from the wireframes —
// counts reflect the active domain and any other active filters, but ignore
// the Status filter itself so all five numbers stay visible at once.

import { LOOP_STATUS_LABEL } from "@/types";
import type { LoopStatus } from "@/types";

const STATUS_ORDER: LoopStatus[] = ["new", "in_progress", "waiting", "completed", "escalated"];

interface OpenLoopStatusSummaryProps {
  counts: Record<LoopStatus, number>;
}

export function OpenLoopStatusSummary({ counts }: OpenLoopStatusSummaryProps) {
  return (
    <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-accent/70">
      {STATUS_ORDER.map((status) => (
        <span key={status}>
          <span className="font-semibold text-accent">{counts[status]}</span>{" "}
          {LOOP_STATUS_LABEL[status]}
        </span>
      ))}
    </div>
  );
}
