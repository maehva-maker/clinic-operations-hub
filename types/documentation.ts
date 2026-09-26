// types/documentation.ts
// The Clinical Documentation module ("EMR Companion") generates PracticeQ-
// ready note text from structured form fields. It is documentation only —
// it never writes to an EMR — so every shape here describes text and
// metadata, not a clinical record.

export type DocumentationCategory =
  | "patient_communication"
  | "sleep_medicine"
  | "weight_management"
  | "administrative";

export type DocumentationTemplateId =
  // Patient Communication
  | "appointment_confirmation"
  | "appointment_reschedule"
  | "voicemail"
  | "no_answer"
  | "inbound_call"
  // Sleep Medicine
  | "sleep_study_coordination"
  | "pap_order"
  | "pap_followup"
  | "lab_review"
  | "referral_followup"
  | "roi_request"
  // Weight Management
  | "new_consultation_followup"
  | "glp1_prior_auth"
  | "medication_followup"
  | "weight_followup"
  | "lab_monitoring"
  // Administrative
  | "fax_sent"
  | "email_sent"
  | "general_note";

/** Input types the Dynamic Template Engine knows how to render. */
export type DocFieldType = "text" | "textarea" | "select" | "checkbox" | "date" | "time";

export interface DocFieldOption {
  value: string;
  label: string;
}

export interface DocFieldDef {
  key: string;
  label: string;
  type: DocFieldType;
  required?: boolean;
  options?: DocFieldOption[];
  placeholder?: string;
}

/** Beginner Assistant Panel content, one entry per template. */
export interface DocumentationTemplateHelp {
  whenToUse: string;
  commonMistakes: string[];
  example: string;
  relatedSopLabel: string;
}

export interface DocumentationTemplate {
  id: DocumentationTemplateId;
  category: DocumentationCategory;
  label: string;
  /** Template-specific fields, rendered beneath the universal required fields. */
  fields: DocFieldDef[];
  help: DocumentationTemplateHelp;
}

/** Values keyed by DocFieldDef.key, for a template's own fields. */
export type DocFieldValues = Record<string, string>;

/**
 * The 6 fields required by every template regardless of category, per the
 * Phase 5 brief's Required Fields Validation rule.
 */
export interface DocumentationCommonFields {
  patientName: string;
  action: string;
  outcome: string;
  date: string; // ISO date
  time: string; // HH:mm
  performer: string;
  additionalNote: string;
}

export interface DocumentationEntry {
  id: string;
  templateId: DocumentationTemplateId;
  category: DocumentationCategory;
  timestamp: string; // ISO datetime the note was saved
  noteText: string;
  common: DocumentationCommonFields;
  fieldValues: DocFieldValues;
  relatedOpenLoopId: string | null;
}

export interface DocumentationHistoryFilters {
  search: string;
  category: DocumentationCategory | "all";
  templateId: DocumentationTemplateId | "all";
  patientName: string;
  date: string; // ISO date, exact match, "" = any date
}
