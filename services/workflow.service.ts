// services/workflow.service.ts
// The only place that reads/mutates Workflow Runs or evaluates the
// Completion Gate. Phase 10: backed by the real `workflow_runs` Supabase
// table, mirroring the pattern used by open-loops.service.ts and
// documentation.service.ts. Two rules live here that the brief calls out
// specifically:
//   1. "Preventing missed steps" — toggleStepCompletion only allows
//      completing the first not-yet-completed step (and, for the documented
//      run, only after documentation exists for a step that requires it),
//      and only allows un-completing the most recently completed step. A
//      step can never be checked out of order.
//   2. The Completion Gate — getCompletionStatus is the single source of
//      truth for whether a run can be marked complete, used identically by
//      the UI's disabled state and by completeWorkflowRun's own guard.

import { createClient } from "@/lib/supabase/client";
import { getWorkflowDefinition } from "@/lib/constants/workflow-definitions";
import type {
  WorkflowCompletionStatus,
  WorkflowDefinition,
  WorkflowDefinitionId,
  WorkflowRun,
} from "@/types";
import type { Database } from "@/types/database";

type WorkflowRunRow = Database["public"]["Tables"]["workflow_runs"]["Row"];

function rowToWorkflowRun(row: WorkflowRunRow): WorkflowRun {
  return {
    id: row.id,
    workflowId: row.workflow_id as WorkflowDefinitionId,
    patientName: row.patient_name,
    status: row.status,
    completedStepIds: [...row.completed_step_ids],
    confirmedInfoItems: [...row.confirmed_info_items],
    documentationGenerated: row.documentation_generated,
    generatedNoteText: row.generated_note_text,
    startedAt: row.started_at,
    updatedAt: row.updated_at,
    completedAt: row.completed_at,
  };
}

async function fetchRunOrThrow(runId: string): Promise<WorkflowRun> {
  const supabase = createClient();
  const { data, error } = await supabase.from("workflow_runs").select("*").eq("id", runId).maybeSingle();
  if (error) throw new Error(`Couldn't load workflow run: ${error.message}`);
  if (!data) throw new Error(`Workflow run ${runId} not found`);
  return rowToWorkflowRun(data);
}

export async function getWorkflowRuns(): Promise<WorkflowRun[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("workflow_runs")
    .select("*")
    .order("updated_at", { ascending: false });
  if (error) throw new Error(`Couldn't load workflow runs: ${error.message}`);
  return (data ?? []).map(rowToWorkflowRun);
}

export async function getRunById(runId: string): Promise<WorkflowRun | null> {
  const supabase = createClient();
  const { data, error } = await supabase.from("workflow_runs").select("*").eq("id", runId).maybeSingle();
  if (error) throw new Error(`Couldn't load workflow run: ${error.message}`);
  return data ? rowToWorkflowRun(data) : null;
}

export async function getRunsForWorkflow(workflowId: WorkflowDefinitionId): Promise<WorkflowRun[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("workflow_runs")
    .select("*")
    .eq("workflow_id", workflowId)
    .order("updated_at", { ascending: false });
  if (error) throw new Error(`Couldn't load workflow runs: ${error.message}`);
  return (data ?? []).map(rowToWorkflowRun);
}

export async function createWorkflowRun(
  workflowId: WorkflowDefinitionId,
  patientName: string,
): Promise<WorkflowRun> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("You must be signed in to start a workflow.");

  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("workflow_runs")
    .insert({
      user_id: user.id,
      workflow_id: workflowId,
      patient_name: patientName,
      status: "in_progress",
      completed_step_ids: [],
      confirmed_info_items: [],
      documentation_generated: false,
      generated_note_text: null,
      started_at: now,
      updated_at: now,
      completed_at: null,
    })
    .select("*")
    .single();
  if (error) throw new Error(`Couldn't start workflow run: ${error.message}`);
  return rowToWorkflowRun(data);
}

/** The first step not yet marked complete — always the step the UI treats as "current." */
export function getCurrentStepId(definition: WorkflowDefinition, run: WorkflowRun): string | null {
  const nextStep = definition.steps.find((step) => !run.completedStepIds.includes(step.id));
  return nextStep?.id ?? null;
}

async function persistRun(runId: string, patch: Partial<WorkflowRunRow>): Promise<WorkflowRun> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("workflow_runs")
    .update(patch)
    .eq("id", runId)
    .select("*")
    .single();
  if (error) throw new Error(`Couldn't update workflow run: ${error.message}`);
  return rowToWorkflowRun(data);
}

export async function toggleStepCompletion(runId: string, stepId: string): Promise<WorkflowRun> {
  const run = await fetchRunOrThrow(runId);
  const definition = getWorkflowDefinition(run.workflowId);
  const stepIndex = definition.steps.findIndex((step) => step.id === stepId);
  if (stepIndex === -1) {
    throw new Error(`Unknown step ${stepId} for workflow ${run.workflowId}`);
  }

  const isCompleted = run.completedStepIds.includes(stepId);
  let completedStepIds = run.completedStepIds;

  if (isCompleted) {
    // Only the most recently completed step can be unchecked, so completion
    // order can't be scrambled from the other end either.
    const lastCompletedId = run.completedStepIds[run.completedStepIds.length - 1];
    if (lastCompletedId === stepId) {
      completedStepIds = run.completedStepIds.slice(0, -1);
    }
  } else {
    const isNextStep = getCurrentStepId(definition, run) === stepId;
    const step = definition.steps[stepIndex];
    const blockedByDocumentation = step?.requiresDocumentation && !run.documentationGenerated;
    if (isNextStep && !blockedByDocumentation) {
      completedStepIds = [...run.completedStepIds, stepId];
    }
  }

  return persistRun(runId, { completed_step_ids: completedStepIds, updated_at: new Date().toISOString() });
}

export async function toggleRequiredInfoItem(runId: string, item: string): Promise<WorkflowRun> {
  const run = await fetchRunOrThrow(runId);
  const confirmedInfoItems = run.confirmedInfoItems.includes(item)
    ? run.confirmedInfoItems.filter((existing) => existing !== item)
    : [...run.confirmedInfoItems, item];
  return persistRun(runId, { confirmed_info_items: confirmedInfoItems, updated_at: new Date().toISOString() });
}

export async function generateDocumentationForRun(
  runId: string,
  noteText: string,
): Promise<WorkflowRun> {
  const run = await fetchRunOrThrow(runId);
  const definition = getWorkflowDefinition(run.workflowId);

  // If the current step is the documentation step, generating the note also
  // satisfies it — the HVA shouldn't have to check a second box for the same action.
  const currentStepId = getCurrentStepId(definition, run);
  const currentStep = definition.steps.find((step) => step.id === currentStepId);
  const completedStepIds = currentStep?.requiresDocumentation
    ? [...run.completedStepIds, currentStep.id]
    : run.completedStepIds;

  return persistRun(runId, {
    documentation_generated: true,
    generated_note_text: noteText,
    completed_step_ids: completedStepIds,
    updated_at: new Date().toISOString(),
  });
}

/** The single source of truth for the Completion Gate, per the Phase 6 brief. */
export function getCompletionStatus(
  definition: WorkflowDefinition,
  run: WorkflowRun,
): WorkflowCompletionStatus {
  const missingReasons: string[] = [];

  const allStepsComplete = definition.steps.every((step) => run.completedStepIds.includes(step.id));
  const allInfoConfirmed = definition.requiredInformation.every((item) =>
    run.confirmedInfoItems.includes(item),
  );

  if (!allStepsComplete) missingReasons.push("Complete all workflow steps.");
  if (!allInfoConfirmed) missingReasons.push("Confirm all required information.");
  if (!run.documentationGenerated) {
    missingReasons.push("Documentation required before completing this workflow.");
  }

  return { canComplete: missingReasons.length === 0, missingReasons };
}

export async function completeWorkflowRun(runId: string): Promise<WorkflowRun> {
  const run = await fetchRunOrThrow(runId);
  const definition = getWorkflowDefinition(run.workflowId);
  const { canComplete } = getCompletionStatus(definition, run);

  if (!canComplete) {
    throw new Error("Workflow cannot be completed until the Completion Gate is satisfied.");
  }

  const now = new Date().toISOString();
  return persistRun(runId, { status: "completed", completed_at: now, updated_at: now });
}
