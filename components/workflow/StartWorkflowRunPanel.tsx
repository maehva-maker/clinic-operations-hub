"use client";

// components/workflow/StartWorkflowRunPanel.tsx
// Shown when a workflow's Detail page has no active run selected: resume an
// existing in-progress run for this workflow, or start a new one for a
// named patient.

import { useState, type FormEvent } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { formatTimelineTimestamp } from "@/lib/utils/date";
import type { WorkflowRun } from "@/types";

interface StartWorkflowRunPanelProps {
  workflowTitle: string;
  inProgressRuns: WorkflowRun[];
  onResume: (runId: string) => void;
  onStart: (patientName: string) => Promise<void>;
}

export function StartWorkflowRunPanel({
  workflowTitle,
  inProgressRuns,
  onResume,
  onStart,
}: StartWorkflowRunPanelProps) {
  const [patientName, setPatientName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!patientName.trim()) {
      setError("Enter a patient name to start this workflow.");
      return;
    }
    setIsStarting(true);
    try {
      await onStart(patientName.trim());
    } finally {
      setIsStarting(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {inProgressRuns.length > 0 ? (
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-accent/40">
            Resume an In-Progress Run
          </h3>
          <ul className="mt-2 flex flex-col gap-2">
            {inProgressRuns.map((run) => (
              <li key={run.id}>
                <button
                  type="button"
                  onClick={() => onResume(run.id)}
                  className="flex w-full items-center justify-between gap-3 rounded-lg border border-surface-border bg-white px-3 py-2 text-left text-sm hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40"
                >
                  <span className="font-medium text-accent">{run.patientName}</span>
                  <span className="text-xs text-accent/50">
                    Updated {formatTimelineTimestamp(run.updatedAt)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-accent/40">
          Start {workflowTitle}
        </h3>
        <Input
          label="Patient Name"
          value={patientName}
          onChange={(event) => setPatientName(event.target.value)}
          error={error ?? undefined}
        />
        <Button type="submit" className="self-start" aria-busy={isStarting} disabled={isStarting}>
          {isStarting ? "Starting…" : "Start Workflow"}
        </Button>
      </form>
    </div>
  );
}
