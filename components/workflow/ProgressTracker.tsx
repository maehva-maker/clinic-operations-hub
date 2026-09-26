"use client";

// components/workflow/ProgressTracker.tsx
// Left panel of Workflow Detail — Smart Workflow Progress: a percentage bar
// plus every step marked completed (✓), current (→), or remaining (□).
// Steps render entirely from the workflow definition's ordered `steps`
// array, so a new workflow needs no new tracker code.

import { CheckCircle2, ArrowRight, Circle } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { WorkflowRun, WorkflowStepDef } from "@/types";

interface ProgressTrackerProps {
  steps: WorkflowStepDef[];
  run: WorkflowRun;
  currentStepId: string | null;
  progressPercent: number;
  onToggleStep: (stepId: string) => void;
}

export function ProgressTracker({
  steps,
  run,
  currentStepId,
  progressPercent,
  onToggleStep,
}: ProgressTrackerProps) {
  const lastCompletedId = run.completedStepIds[run.completedStepIds.length - 1] ?? null;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold text-accent">Progress</span>
          <span className="font-semibold text-primary-dark">{progressPercent}%</span>
        </div>
        <div
          role="progressbar"
          aria-valuenow={progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Workflow progress"
          className="mt-2 h-2 w-full overflow-hidden rounded-pill bg-surface"
        >
          <div
            className="h-full rounded-pill bg-primary transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <ol className="flex flex-col gap-1">
        {steps.map((step) => {
          const isCompleted = run.completedStepIds.includes(step.id);
          const isCurrent = step.id === currentStepId;
          const isClickable = isCompleted ? step.id === lastCompletedId : isCurrent;

          return (
            <li key={step.id}>
              <button
                type="button"
                disabled={!isClickable}
                onClick={() => onToggleStep(step.id)}
                aria-current={isCurrent ? "step" : undefined}
                className={cn(
                  "flex w-full items-start gap-2 rounded-lg px-2 py-2 text-left text-sm transition-colors",
                  isClickable && "hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40",
                  isCurrent && "bg-secondary-light/60",
                  !isClickable && !isCurrent && "cursor-default",
                )}
              >
                {isCompleted ? (
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden="true" />
                ) : isCurrent ? (
                  <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-secondary-dark" aria-hidden="true" />
                ) : (
                  <Circle className="mt-0.5 h-4 w-4 shrink-0 text-accent/25" aria-hidden="true" />
                )}
                <span
                  className={cn(
                    "font-medium",
                    isCompleted ? "text-accent/50 line-through" : isCurrent ? "text-accent" : "text-accent/60",
                  )}
                >
                  {step.label}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
