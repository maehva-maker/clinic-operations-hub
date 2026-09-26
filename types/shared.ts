// types/shared.ts
// Shared primitive types used across the app. These mirror the Phase 1
// Foundation database schema (see claude/phase1-foundation.md) so the UI,
// mock services, and the future Supabase-backed services agree on shape.

export type WorkflowDomain = "sleep_medicine" | "weight_management";

export type SleepLoopCategory =
  | "scheduling"
  | "chart_preparation"
  | "sleep_study"
  | "pap_order"
  | "labcorp"
  | "referral"
  | "roi_medical_records"
  | "ess_questionnaire";

export type WeightLoopCategory =
  | "new_weight_consult"
  | "weight_followup"
  | "medication_followup"
  | "lifestyle_program_followup"
  | "lab_monitoring"
  | "prior_auth_glp1"
  | "bmi_monitoring";

export type OpenLoopCategory = SleepLoopCategory | WeightLoopCategory;

export type LoopStatus =
  | "new"
  | "in_progress"
  | "waiting"
  | "completed"
  | "escalated";

export type TaskStatus = "pending" | "in_progress" | "done" | "skipped";

export type TaskPriority = "low" | "normal" | "high" | "urgent";

export type WaitingOnType =
  | "patient"
  | "insurance"
  | "dream_sleep"
  | "labcorp"
  | "provider"
  | "other";

/** Human-readable labels for each loop status, used by StatusBadge. */
export const LOOP_STATUS_LABEL: Record<LoopStatus, string> = {
  new: "New",
  in_progress: "In Progress",
  waiting: "Waiting",
  completed: "Completed",
  escalated: "Escalated",
};

/** Human-readable labels for each priority, used by PriorityBadge. */
export const TASK_PRIORITY_LABEL: Record<TaskPriority, string> = {
  low: "Low",
  normal: "Normal",
  high: "High",
  urgent: "Urgent",
};

/** Human-readable labels for each workflow domain. */
export const DOMAIN_LABEL: Record<WorkflowDomain, string> = {
  sleep_medicine: "Sleep Medicine",
  weight_management: "Weight Management",
};

/** Human-readable labels for each Waiting Rule target, used in Follow-up and Open Loop UI. */
export const WAITING_ON_LABEL: Record<WaitingOnType, string> = {
  patient: "Patient",
  insurance: "Insurance",
  dream_sleep: "Dream Sleep",
  labcorp: "LabCorp",
  provider: "Provider",
  other: "Other",
};
