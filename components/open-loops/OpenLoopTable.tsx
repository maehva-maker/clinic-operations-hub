// components/open-loops/OpenLoopTable.tsx
// List view. Desktop/tablet renders a real table (default-sorted by due
// date, soonest first, nulls last); mobile collapses to the same
// OpenLoopCard used in the Kanban board, per the Design System's table
// mobile-behavior rule.

import { StatusBadge } from "@/components/ui/StatusBadge";
import { PriorityBadge } from "@/components/ui/PriorityBadge";
import { OpenLoopCard } from "@/components/open-loops/OpenLoopCard";
import { CATEGORY_LABEL } from "@/lib/constants/workflow-categories";
import { formatShortDate } from "@/lib/utils/date";
import type { OpenLoop } from "@/types";

interface OpenLoopTableProps {
  loops: OpenLoop[];
  onSelectLoop: (id: string) => void;
}

function sortByDueDate(loops: OpenLoop[]): OpenLoop[] {
  return [...loops].sort((a, b) => {
    if (!a.dueDate && !b.dueDate) return 0;
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return a.dueDate.localeCompare(b.dueDate);
  });
}

export function OpenLoopTable({ loops, onSelectLoop }: OpenLoopTableProps) {
  const sorted = sortByDueDate(loops);

  return (
    <>
      <div className="hidden overflow-x-auto rounded-card border border-surface-border bg-white shadow-card md:block">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-surface-border bg-surface text-xs uppercase tracking-wide text-accent/50">
            <tr>
              <th scope="col" className="px-4 py-3 font-semibold">Patient</th>
              <th scope="col" className="px-4 py-3 font-semibold">Category</th>
              <th scope="col" className="px-4 py-3 font-semibold">Status</th>
              <th scope="col" className="px-4 py-3 font-semibold">Priority</th>
              <th scope="col" className="px-4 py-3 font-semibold">Provider</th>
              <th scope="col" className="px-4 py-3 font-semibold">Due Date</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((loop) => (
              <tr
                key={loop.id}
                tabIndex={0}
                role="button"
                aria-label={`Open ${loop.patientName}: ${loop.title}`}
                onClick={() => onSelectLoop(loop.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") onSelectLoop(loop.id);
                }}
                className="cursor-pointer border-b border-surface-border last:border-0 hover:bg-surface focus-visible:outline-none focus-visible:bg-surface"
              >
                <td className="px-4 py-3 font-medium text-accent">{loop.patientName}</td>
                <td className="px-4 py-3 text-accent/70">{CATEGORY_LABEL[loop.category]}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={loop.status} />
                </td>
                <td className="px-4 py-3">
                  <PriorityBadge priority={loop.priority} />
                </td>
                <td className="px-4 py-3 text-accent/70">{loop.provider}</td>
                <td className="px-4 py-3 text-accent/70">
                  {loop.dueDate ? formatShortDate(loop.dueDate) : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 md:hidden">
        {sorted.map((loop) => (
          <OpenLoopCard key={loop.id} loop={loop} onSelect={onSelectLoop} />
        ))}
      </div>
    </>
  );
}
