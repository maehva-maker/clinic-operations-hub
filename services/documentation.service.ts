// services/documentation.service.ts
// The only place that builds EMR note text or reads/mutates documentation
// history. Two responsibilities live here:
//   1. The Dynamic Template Engine (buildEmrNote) — pure text generation,
//      used identically by the live preview and the saved note, so the
//      preview is guaranteed to look exactly like what gets copied/saved.
//   2. Documentation history storage — Phase 10: backed by the real
//      `documentation_history` Supabase table, mirroring the pattern in
//      services/open-loops.service.ts. When a saved entry is linked to an
//      Open Loop, this service also appends an Activity Timeline entry
//      through open-loops.service, so the two modules stay in sync without
//      any component wiring them together.

import { createClient } from "@/lib/supabase/client";
import { appendActivity } from "@/services/open-loops.service";
import { getTemplateById } from "@/lib/constants/documentation-templates";
import type {
  DocFieldValues,
  DocumentationCategory,
  DocumentationCommonFields,
  DocumentationEntry,
  DocumentationHistoryFilters,
  DocumentationTemplate,
  DocumentationTemplateId,
} from "@/types";
import type { Database } from "@/types/database";

type DocumentationHistoryRow = Database["public"]["Tables"]["documentation_history"]["Row"];

function rowToDocumentationEntry(row: DocumentationHistoryRow): DocumentationEntry {
  return {
    id: row.id,
    templateId: row.template_id as DocumentationTemplateId,
    category: row.category,
    timestamp: row.timestamp,
    noteText: row.note_text,
    common: row.common as DocumentationCommonFields,
    fieldValues: row.field_values as DocFieldValues,
    relatedOpenLoopId: row.related_open_loop_id,
  };
}

function ensureSentence(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) return "";
  return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`;
}

function formatNoteHeader(dateIso: string, time: string): string {
  if (!dateIso || !time) return "";
  const [year, month, day] = dateIso.split("-");
  const [hourStr, minuteStr] = time.split(":");
  const hour24 = Number(hourStr);
  const minute = minuteStr ?? "00";
  const period = hour24 >= 12 ? "PM" : "AM";
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return `${month}/${day}/${(year ?? "").slice(2)} @ ${hour12}:${minute} ${period} – `;
}

/**
 * Template-specific supplementary sentence, built from that template's own
 * fields. Every template not listed here (or with no fields filled in yet)
 * simply contributes no extra sentence — the note still generates from the
 * universal Action/Outcome fields alone.
 */
const TEMPLATE_DETAIL: Partial<
  Record<DocumentationTemplateId, (fields: DocFieldValues) => string>
> = {
  appointment_confirmation: (f) =>
    f.appointmentDate ? `Confirmed for ${f.appointmentDate}${f.appointmentTime ? ` @ ${f.appointmentTime}` : ""}` : "",
  appointment_reschedule: (f) =>
    f.newDate ? `Rescheduled from ${f.oldDate || "prior date"} to ${f.newDate}${f.newTime ? ` @ ${f.newTime}` : ""}` : "",
  voicemail: (f) =>
    [
      f.phone ? `Left voicemail at ${f.phone}` : "",
      f.reason ? `re ${f.reason}` : "",
      f.callbackRequested === "true" ? "Callback requested: Yes" : "",
    ]
      .filter(Boolean)
      .join(". "),
  no_answer: (f) =>
    [f.phone ? `No answer at ${f.phone}` : "", f.attemptNumber ? `(attempt #${f.attemptNumber})` : ""]
      .filter(Boolean)
      .join(" "),
  inbound_call: (f) => (f.reason ? `Pt called re ${f.reason}` : ""),
  sleep_study_coordination: (f) =>
    [
      f.studyType ? f.studyType.replace(/_/g, " ") : "",
      f.facility ? `coordinated with ${f.facility}` : "",
      f.confirmationStatus ? `(${f.confirmationStatus.replace(/_/g, " ")})` : "",
    ]
      .filter(Boolean)
      .join(" "),
  pap_order: (f) =>
    [
      f.dmeSupplier && f.equipment ? `PAP order sent to ${f.dmeSupplier} for ${f.equipment}` : "",
      f.faxConfirmation ? `Fax confirmation #${f.faxConfirmation} received` : "",
    ]
      .filter(Boolean)
      .join(". "),
  pap_followup: (f) =>
    [
      f.complianceStatus ? `Compliance status: ${f.complianceStatus.replace(/_/g, " ")}` : "",
      f.issuesReported ? `Issues reported: ${f.issuesReported}` : "",
    ]
      .filter(Boolean)
      .join(". "),
  lab_review: (f) =>
    [f.labName ? `Reviewed ${f.labName}` : "", f.resultSummary ? `Result summary: ${f.resultSummary}` : "", f.providerNotified === "true" ? "Provider notified: Yes" : ""]
      .filter(Boolean)
      .join(". "),
  referral_followup: (f) =>
    [
      f.referralOffice ? `Followed up with ${f.referralOffice}` : "",
      f.authStatus ? `Authorization status: ${f.authStatus}` : "",
      f.referenceNumber ? `Reference #${f.referenceNumber}` : "",
    ]
      .filter(Boolean)
      .join(". "),
  roi_request: (f) =>
    [
      f.recipient ? `ROI processed for ${f.recipient}` : "",
      f.recordsRequested ? `Records requested: ${f.recordsRequested}` : "",
      f.roiSigned === "true" ? "ROI signed by patient: Yes" : "",
    ]
      .filter(Boolean)
      .join(". "),
  new_consultation_followup: (f) =>
    [f.programInterest ? `Program interest: ${f.programInterest}` : "", f.nextStep ? `Next step: ${f.nextStep}` : ""]
      .filter(Boolean)
      .join(". "),
  glp1_prior_auth: (f) =>
    [
      f.insurance && f.medication ? `Prior authorization submitted to ${f.insurance} for ${f.medication}` : "",
      f.paStatus ? `PA Status: ${f.paStatus}` : "",
      f.referenceNumber ? `Reference #${f.referenceNumber}` : "",
    ]
      .filter(Boolean)
      .join(". "),
  medication_followup: (f) =>
    [
      f.medication ? `Followed up on ${f.medication}` : "",
      f.sideEffects ? `Side effects reported: ${f.sideEffects}` : "",
      f.refillNeeded === "true" ? "Refill needed: Yes" : "",
    ]
      .filter(Boolean)
      .join(". "),
  weight_followup: (f) =>
    [f.currentWeight ? `Current weight: ${f.currentWeight} lbs` : "", f.progressNote ? `Progress note: ${f.progressNote}` : ""]
      .filter(Boolean)
      .join(". "),
  lab_monitoring: (f) =>
    [f.labName ? `Reviewed ${f.labName}` : "", f.resultSummary ? `Result summary: ${f.resultSummary}` : "", f.providerNotified === "true" ? "Provider notified: Yes" : ""]
      .filter(Boolean)
      .join(". "),
  fax_sent: (f) =>
    [f.recipient ? `Fax sent to ${f.recipient}` : "", f.documentsSent ? `Documents sent: ${f.documentsSent}` : "", f.faxConfirmation ? `Fax confirmation #${f.faxConfirmation}` : ""]
      .filter(Boolean)
      .join(". "),
  email_sent: (f) =>
    [f.recipient ? `Email sent to ${f.recipient}` : "", f.subject ? `Subject: ${f.subject}` : "", f.summary ? `Summary: ${f.summary}` : ""]
      .filter(Boolean)
      .join(". "),
  general_note: (f) => (f.details ? f.details : ""),
};

/** The Dynamic Template Engine: same function powers the live preview and the saved note. */
export function buildEmrNote(
  template: DocumentationTemplate,
  common: DocumentationCommonFields,
  fieldValues: DocFieldValues,
): string {
  const header = formatNoteHeader(common.date, common.time);
  const sentences: string[] = [];

  if (common.action) sentences.push(ensureSentence(common.action));
  if (common.outcome) sentences.push(ensureSentence(common.outcome));

  const detail = TEMPLATE_DETAIL[template.id]?.(fieldValues);
  if (detail) sentences.push(ensureSentence(detail));

  if (common.additionalNote) sentences.push(ensureSentence(common.additionalNote));

  return `${header}${sentences.join(" ")}`.trim();
}

export interface DocumentationRequiredCheck {
  isValid: boolean;
  missingFieldLabels: string[];
}

/** Validates the 6 universal required fields plus any required template fields. */
export function validateDocumentationForm(
  template: DocumentationTemplate,
  common: DocumentationCommonFields,
  fieldValues: DocFieldValues,
): DocumentationRequiredCheck {
  const missing: string[] = [];

  if (!common.patientName.trim()) missing.push("Patient");
  if (!common.action.trim()) missing.push("Action");
  if (!common.outcome.trim()) missing.push("Outcome");
  if (!common.date.trim()) missing.push("Date");
  if (!common.time.trim()) missing.push("Time");
  if (!common.performer.trim()) missing.push("Performer");

  template.fields
    .filter((field) => field.required)
    .forEach((field) => {
      if (!fieldValues[field.key]?.trim()) missing.push(field.label);
    });

  return { isValid: missing.length === 0, missingFieldLabels: missing };
}

export async function getDocumentationHistory(): Promise<DocumentationEntry[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("documentation_history")
    .select("*")
    .order("timestamp", { ascending: false });
  if (error) throw new Error(`Couldn't load documentation history: ${error.message}`);
  return (data ?? []).map(rowToDocumentationEntry);
}

export function filterDocumentationHistory(
  entries: DocumentationEntry[],
  filters: DocumentationHistoryFilters,
): DocumentationEntry[] {
  const query = filters.search.trim().toLowerCase();

  return entries.filter((entry) => {
    if (filters.category !== "all" && entry.category !== filters.category) return false;
    if (filters.templateId !== "all" && entry.templateId !== filters.templateId) return false;
    if (filters.date && entry.common.date !== filters.date) return false;
    if (
      filters.patientName.trim() &&
      !entry.common.patientName.toLowerCase().includes(filters.patientName.trim().toLowerCase())
    ) {
      return false;
    }
    if (
      query &&
      !entry.common.patientName.toLowerCase().includes(query) &&
      !entry.noteText.toLowerCase().includes(query) &&
      !getTemplateById(entry.templateId).label.toLowerCase().includes(query)
    ) {
      return false;
    }
    return true;
  });
}

export interface SaveDocumentationInput {
  templateId: DocumentationTemplateId;
  category: DocumentationCategory;
  common: DocumentationCommonFields;
  fieldValues: DocFieldValues;
  noteText: string;
  relatedOpenLoopId: string | null;
}

export async function saveDocumentationEntry(
  input: SaveDocumentationInput,
): Promise<DocumentationEntry> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("You must be signed in to save documentation.");

  const timestamp = new Date().toISOString();
  const { data, error } = await supabase
    .from("documentation_history")
    .insert({
      user_id: user.id,
      template_id: input.templateId,
      category: input.category,
      timestamp,
      note_text: input.noteText,
      common: input.common,
      field_values: input.fieldValues,
      related_open_loop_id: input.relatedOpenLoopId,
    })
    .select("*")
    .single();
  if (error) throw new Error(`Couldn't save documentation entry: ${error.message}`);

  const entry = rowToDocumentationEntry(data);

  if (input.relatedOpenLoopId) {
    await appendActivity(input.relatedOpenLoopId, {
      actionType: "documentation",
      note: entry.noteText,
      performedBy: input.common.performer,
    });
  }

  return entry;
}
