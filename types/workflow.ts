// types/workflow.ts
// The Workflow Wizard guides a beginner HVA through a workflow step by step
// instead of just describing it. A WorkflowDefinition is pure data — title,
// required information, ordered steps, beginner tips, and the documentation
// template it produces — so the UI (Home, Detail, Progress Tracker,
// Beginner Assistant) renders entirely from definitions rather than one-off
// pages per workflow. A WorkflowRun is one in-progress or completed pass
// through a definition for a specific patient.
//
// The 12 workflows named in the Phase 6 brief map one-to-one onto the
// OpenLoopCategory values already scoped per domain in
// lib/constants/workflow-categories.ts (SLEEP_CATEGORIES has exactly the 7
// Sleep Medicine workflows, WEIGHT_CATEGORIES exactly the 5 Weight
// Management ones), so a workflow's id reuses that type rather than
// introducing a parallel enum.

import type { DocumentationTemplateId } from "./documentation";
import type { OpenLoopCategory, WorkflowDomain } from "./shared";

export type WorkflowDefinitionId = OpenLoopCategory;

export interface WorkflowStepDef {
  id: string;
  label: string;
  description: string;
  /** True for the (usually final) step that can only be completed by generating documentation. */
  requiresDocumentation?: boolean;
}

export interface WorkflowBeginnerTips {
  whenToUse: string;
  commonMistakes: string[];
  timeSavingTips: string[];
  relatedSoftware: string[];
}

export interface WorkflowDefinition {
  id: WorkflowDefinitionId;
  domain: WorkflowDomain;
  title: string;
  requiredInformation: string[];
  steps: WorkflowStepDef[];
  beginnerTips: WorkflowBeginnerTips;
  /** The Clinical Documentation template this workflow's steps generate. */
  documentationTemplateId: DocumentationTemplateId;
}

export type WorkflowRunStatus = "in_progress" | "completed";

export interface WorkflowRun {
  id: string;
  workflowId: WorkflowDefinitionId;
  patientName: string;
  status: WorkflowRunStatus;
  completedStepIds: string[];
  confirmedInfoItems: string[];
  documentationGenerated: boolean;
  generatedNoteText: string | null;
  startedAt: string; // ISO datetime
  updatedAt: string; // ISO datetime
  completedAt: string | null; // ISO datetime
}

/** Result of the Completion Gate check — computed, never stored. */
export interface WorkflowCompletionStatus {
  canComplete: boolean;
  missingReasons: string[];
}

/** One "What are you doing today?" quick action on the Wizard Home. */
export interface DecisionHelperAction {
  label: string;
  workflowId: WorkflowDefinitionId;
}
