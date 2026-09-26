// services/patients.service.ts
// The Patient Directory doesn't store its own activity — it composes a
// patient's Open Loops (Phase 4), Documentation History (Phase 5), and
// Workflow Runs (Phase 6) by matching each module's plain-string patient
// name against this patient's `name` or `aliases`. This is the "no
// duplicated business logic" rule in practice: none of those three modules'
// records are copied or re-typed here, only filtered and merged for display.

import { createClient } from "@/lib/supabase/client";
import { getActivitiesForLoop, getOpenLoops } from "@/services/open-loops.service";
import { getDocumentationHistory } from "@/services/documentation.service";
import { getWorkflowRuns } from "@/services/workflow.service";
import { getWorkflowDefinition } from "@/lib/constants/workflow-definitions";
import { getDueDateBucket } from "@/lib/utils/date";
import type {
  DocumentationEntry,
  OpenLoop,
  Patient,
  UnifiedActivityEntry,
  WorkflowRun,
} from "@/types";
import type { Database } from "@/types/database";

type PatientRow = Database["public"]["Tables"]["patients"]["Row"];

function rowToPatient(row: PatientRow): Patient {
  return {
    id: row.id,
    name: row.name,
    aliases: [...row.aliases],
    dob: row.dob,
    provider: row.provider,
    program: row.program,
    phone: row.phone,
    email: row.email,
  };
}

function patientMatchesName(patient: Patient, name: string): boolean {
  return patient.name === name || patient.aliases.includes(name);
}

export async function getPatients(): Promise<Patient[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from("patients").select("*").order("name", { ascending: true });
  if (error) throw new Error(`Couldn't load patients: ${error.message}`);
  return (data ?? []).map(rowToPatient);
}

export async function getPatientById(id: string): Promise<Patient | null> {
  const supabase = createClient();
  const { data, error } = await supabase.from("patients").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(`Couldn't load patient: ${error.message}`);
  return data ? rowToPatient(data) : null;
}

export async function getOpenLoopsForPatient(patient: Patient): Promise<OpenLoop[]> {
  const loops = await getOpenLoops();
  return loops.filter((loop) => patientMatchesName(patient, loop.patientName));
}

export async function getDocumentationForPatient(patient: Patient): Promise<DocumentationEntry[]> {
  const entries = await getDocumentationHistory();
  return entries.filter((entry) => patientMatchesName(patient, entry.common.patientName));
}

export async function getWorkflowRunsForPatient(patient: Patient): Promise<WorkflowRun[]> {
  const runs = await getWorkflowRuns();
  return runs.filter((run) => patientMatchesName(patient, run.patientName));
}

export function getActiveOpenLoopCount(loops: OpenLoop[]): number {
  return loops.filter((loop) => loop.status !== "completed").length;
}

/** The most recent timestamp across a patient's open loops, documentation, and workflow runs. */
export function getLastContactAt(
  loops: OpenLoop[],
  documentation: DocumentationEntry[],
  workflowRuns: WorkflowRun[],
): string | null {
  const timestamps = [
    ...loops.map((loop) => loop.updatedAt),
    ...documentation.map((entry) => entry.timestamp),
    ...workflowRuns.map((run) => run.updatedAt),
  ];
  if (timestamps.length === 0) return null;
  return timestamps.sort((a, b) => b.localeCompare(a))[0] ?? null;
}

/** The most urgent open loop with a due date — overdue first, then soonest. */
export function getPendingFollowUp(loops: OpenLoop[]): OpenLoop | null {
  const withDueDates = loops.filter((loop) => loop.status !== "completed" && loop.dueDate);
  if (withDueDates.length === 0) return null;

  const bucketRank: Record<string, number> = { overdue: 0, today: 1, this_week: 2, later: 3, none: 4 };
  return [...withDueDates].sort((a, b) => {
    const rankDiff = bucketRank[getDueDateBucket(a.dueDate)]! - bucketRank[getDueDateBucket(b.dueDate)]!;
    if (rankDiff !== 0) return rankDiff;
    return (a.dueDate ?? "").localeCompare(b.dueDate ?? "");
  })[0]!;
}

export interface PatientSummary {
  patient: Patient;
  activeOpenLoopCount: number;
  lastContactAt: string | null;
  pendingFollowUp: OpenLoop | null;
}

/** Aggregated per-patient stats for the Patient Directory list — one pass over each module's data per patient. */
export async function getPatientSummaries(): Promise<PatientSummary[]> {
  const patients = await getPatients();
  return Promise.all(
    patients.map(async (patient) => {
      const [loops, documentation, workflowRuns] = await Promise.all([
        getOpenLoopsForPatient(patient),
        getDocumentationForPatient(patient),
        getWorkflowRunsForPatient(patient),
      ]);
      return {
        patient,
        activeOpenLoopCount: getActiveOpenLoopCount(loops),
        lastContactAt: getLastContactAt(loops, documentation, workflowRuns),
        pendingFollowUp: getPendingFollowUp(loops),
      };
    }),
  );
}

/** The unified, cross-module Activity Timeline shown on a Patient Profile. */
export async function getPatientActivityTimeline(patient: Patient): Promise<UnifiedActivityEntry[]> {
  const [loops, documentation, workflowRuns] = await Promise.all([
    getOpenLoopsForPatient(patient),
    getDocumentationForPatient(patient),
    getWorkflowRunsForPatient(patient),
  ]);

  const loopActivityEntries = await Promise.all(
    loops.map(async (loop) => {
      const activities = await getActivitiesForLoop(loop.id);
      return activities.map(
        (activity): UnifiedActivityEntry => ({
          id: activity.id,
          kind: "open_loop_activity",
          timestamp: activity.timestamp,
          summary: activity.note,
          performedBy: activity.performedBy,
          href: `/open-loops?loop=${loop.id}`,
        }),
      );
    }),
  );

  const documentationEntries: UnifiedActivityEntry[] = documentation.map((entry) => ({
    id: entry.id,
    kind: "documentation",
    timestamp: entry.timestamp,
    summary: entry.noteText,
    performedBy: entry.common.performer,
    href: "/clinical-documentation/history",
  }));

  const workflowEntries: UnifiedActivityEntry[] = workflowRuns.map((run) => {
    const definition = getWorkflowDefinition(run.workflowId);
    const statusLabel = run.status === "completed" ? "completed" : "updated";
    return {
      id: run.id,
      kind: "workflow_run",
      timestamp: run.updatedAt,
      summary: `Workflow ${statusLabel}: ${definition.title}`,
      performedBy: "Mae",
      href: `/workflow-wizard/${run.workflowId}?run=${run.id}`,
    };
  });

  return [...loopActivityEntries.flat(), ...documentationEntries, ...workflowEntries].sort((a, b) =>
    b.timestamp.localeCompare(a.timestamp),
  );
}
