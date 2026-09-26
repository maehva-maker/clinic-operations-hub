"use client";

// components/workflow/CompletionGateBanner.tsx
// The Completion Gate: a workflow run cannot be marked complete until every
// missing reason from getCompletionStatus() clears. This banner is the only
// place that can trigger completeWorkflowRun(), and it stays disabled until
// the gate is actually satisfied — never just hidden.

import { CheckCircle2, Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { WorkflowCompletionStatus, WorkflowRunStatus } from "@/types";

interface CompletionGateBannerProps {
  status: WorkflowRunStatus;
  completionStatus: WorkflowCompletionStatus;
  onComplete: () => void;
  isCompleting: boolean;
}

export function CompletionGateBanner({
  status,
  completionStatus,
  onComplete,
  isCompleting,
}: CompletionGateBannerProps) {
  if (status === "completed") {
    return (
      <div className="flex items-center gap-2 rounded-card border border-success bg-success-light px-4 py-3 text-sm font-medium text-success">
        <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
        This workflow is complete.
      </div>
    );
  }

  return (
    <div className="rounded-card border border-surface-border bg-white p-4">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-accent">
        <Lock className="h-4 w-4 text-accent/40" aria-hidden="true" />
        Completion Gate
      </h3>

      {!completionStatus.canComplete ? (
        <ul className="mt-2 flex flex-col gap-1 text-xs text-warning">
          {completionStatus.missingReasons.map((reason) => (
            <li key={reason}>• {reason}</li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-xs text-success">Everything required is in place.</p>
      )}

      <Button
        type="button"
        className="mt-3"
        onClick={onComplete}
        disabled={!completionStatus.canComplete || isCompleting}
        aria-busy={isCompleting}
      >
        {isCompleting ? "Completing…" : "Complete Workflow"}
      </Button>
    </div>
  );
}
