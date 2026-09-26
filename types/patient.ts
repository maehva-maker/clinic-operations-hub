// types/patient.ts
// The Patient Directory doesn't own its own patient activity — it composes
// it from Open Loop Tracker (Phase 4), Clinical Documentation (Phase 5), and
// the Workflow Wizard (Phase 6), all of which already store a patient's name
// as a plain string. `aliases` reconciles the different name spellings that
// crept in across those phases' mock data (e.g. Open Loop Tracker's
// "H. Stewart" vs. Clinical Documentation's "Heather Stewart") so
// services/patients.service.ts can match them all to one Patient record.

import type { WorkflowDomain } from "./shared";

export interface Patient {
  id: string;
  name: string;
  /** Other exact name strings this patient appears under in earlier phases' mock data. */
  aliases: string[];
  dob: string; // ISO date
  provider: string;
  /** "Primary Program" in the brief — which domain this patient is principally under. */
  program: WorkflowDomain;
  phone: string;
  email: string;
}

export type UnifiedActivityKind = "open_loop_activity" | "documentation" | "workflow_run";

/** One entry in a patient's unified, cross-module Activity Timeline. */
export interface UnifiedActivityEntry {
  id: string;
  kind: UnifiedActivityKind;
  timestamp: string; // ISO datetime
  summary: string;
  performedBy: string;
  href: string;
}
