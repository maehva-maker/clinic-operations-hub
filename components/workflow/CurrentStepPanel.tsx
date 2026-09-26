"use client";

// components/workflow/CurrentStepPanel.tsx
// Center panel of Workflow Detail: the step the HVA should be working on
// right now, per getCurrentStepId() — always the first not-yet-completed
// step, so there's never ambiguity about what's next.

import { CheckCircle2, FileText } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { WorkflowRun, WorkflowStepDef } from "@/types";

interface CurrentStepPanelProps {
  step: WorkflowStepDef | null;
  run: WorkflowRun;
  onMarkComplete: () => void;
  onOpenDocumentationModal: () => void;
}

export function CurrentStepPanel({ step, run, onMarkComplete, onOpenDocumentationModal }: CurrentStepPanelProps) {
  if (!step) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-card border border-dashed border-success bg-success-light px-6 py-10 text-center">
        <CheckCircle2 className="h-8 w-8 text-success" aria-hidden="true" />
        <p className="text-sm font-semibold text-success">All steps are complete.</p>
        <p className="text-xs text-accent/60">
          Use the Completion Gate below to finish this workflow.
        </p>
      </div>
    );
  }

  const isDocStepBlocked = step.requiresDocumentation && !run.documentationGenerated;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wide text-accent/40">Current Step</h3>
        <h2 className="mt-1 text-lg font-semibold text-accent">{step.label}</h2>
        <p className="mt-1 text-sm text-accent/70">{step.description}</p>
      </div>

      {step.requiresDocumentation ? (
        <Button type="button" onClick={onOpenDocumentationModal} className="self-start">
          <FileText className="h-4 w-4" aria-hidden="true" />
          {run.documentationGenerated ? "Documentation Generated ✓" : "Generate Documentation"}
        </Button>
      ) : (
        <Button type="button" onClick={onMarkComplete} className="self-start">
          <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
          Mark Step Complete
        </Button>
      )}

      {isDocStepBlocked ? (
        <p className="text-xs text-warning">
          Generate documentation to complete this step.
        </p>
      ) : null}
    </div>
  );
}
