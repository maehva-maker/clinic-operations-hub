// components/open-loops/OpenLoopBoard.tsx
// Kanban view, grouped by status. Click-to-open only — no drag-and-drop —
// keeps the interaction model simple for a beginner user, per the PRD.

import { OpenLoopCard } from "@/components/open-loops/OpenLoopCard";
import { LOOP_STATUS_LABEL } from "@/types";
import type { LoopStatus, OpenLoop } from "@/types";

const COLUMNS: LoopStatus[] = ["new", "in_progress", "waiting", "completed", "escalated"];

interface OpenLoopBoardProps {
  loops: OpenLoop[];
  onSelectLoop: (id: string) => void;
}

export function OpenLoopBoard({ loops, onSelectLoop }: OpenLoopBoardProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {COLUMNS.map((status) => {
        const columnLoops = loops.filter((loop) => loop.status === status);
        return (
          <div key={status} className="flex flex-col gap-3 rounded-card bg-surface p-3">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-accent/60">
                {LOOP_STATUS_LABEL[status]}
              </h3>
              <span className="text-xs font-semibold text-accent/40">{columnLoops.length}</span>
            </div>
            <div className="flex flex-col gap-3">
              {columnLoops.length === 0 ? (
                <p className="rounded-lg border border-dashed border-surface-border p-3 text-center text-xs text-accent/40">
                  No loops
                </p>
              ) : (
                columnLoops.map((loop) => (
                  <OpenLoopCard key={loop.id} loop={loop} onSelect={onSelectLoop} />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
