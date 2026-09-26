// components/workflow/RecentWorkflowRuns.tsx
// Surfaces the mock in-progress/completed workflow runs on the Wizard Home
// so "resume where you left off" is one click, not a search.

import Link from "next/link";
import { getWorkflowDefinition } from "@/lib/constants/workflow-definitions";
import { formatTimelineTimestamp } from "@/lib/utils/date";
import { cn } from "@/lib/utils/cn";
import type { WorkflowRun } from "@/types";

interface RecentWorkflowRunsProps {
  runs: WorkflowRun[];
}

export function RecentWorkflowRuns({ runs }: RecentWorkflowRunsProps) {
  if (runs.length === 0) {
    return <p className="text-sm text-accent/50">No workflow runs yet.</p>;
  }

  return (
    <ul className="flex flex-col gap-2">
      {runs.slice(0, 8).map((run) => {
        const definition = getWorkflowDefinition(run.workflowId);
        const progress = Math.round((run.completedStepIds.length / definition.steps.length) * 100);

        return (
          <li key={run.id}>
            <Link
              href={`/workflow-wizard/${run.workflowId}?run=${run.id}`}
              className="flex items-center justify-between gap-3 rounded-lg px-2 py-2 -mx-2 hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-accent">
                  {run.patientName} — {definition.title}
                </p>
                <p className="text-xs text-accent/50">
                  Updated {formatTimelineTimestamp(run.updatedAt)}
                </p>
              </div>
              <span
                className={cn(
                  "shrink-0 rounded-pill px-2.5 py-1 text-xs font-medium",
                  run.status === "completed"
                    ? "bg-success-light text-success"
                    : "bg-secondary-light text-secondary-dark",
                )}
              >
                {run.status === "completed" ? "Completed" : `${progress}% complete`}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
