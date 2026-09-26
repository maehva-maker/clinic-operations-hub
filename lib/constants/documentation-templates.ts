// lib/constants/documentation-templates.ts
// Static configuration for all 19 documentation templates: their category,
// their template-specific fields (the universal required fields — Patient,
// Action, Outcome, Date, Time, Performer — are handled once by
// DocumentationForm, not repeated here), and their Beginner Assistant Panel
// content. This is reference data, not logic — the actual note-text
// generation ("Dynamic Template Engine") lives in
// services/documentation.service.ts so the two can change independently.

import type {
  DocumentationCategory,
  DocumentationTemplate,
  DocumentationTemplateId,
} from "@/types";

export const DOCUMENTATION_CATEGORY_LABEL: Record<DocumentationCategory, string> = {
  patient_communication: "Patient Communication",
  sleep_medicine: "Sleep Medicine",
  weight_management: "Weight Management",
  administrative: "Administrative",
};

export const DOCUMENTATION_CATEGORY_ORDER: DocumentationCategory[] = [
  "patient_communication",
  "sleep_medicine",
  "weight_management",
  "administrative",
];

const YES_NO_OPTIONS = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];

const PA_STATUS_OPTIONS = [
  { value: "submitted", label: "Submitted" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "denied", label: "Denied" },
];

export const DOCUMENTATION_TEMPLATES: DocumentationTemplate[] = [
  // ---------------------------------------------------------------- Patient Communication
  {
    id: "appointment_confirmation",
    category: "patient_communication",
    label: "Appointment Confirmation",
    fields: [
      { key: "appointmentDate", label: "Appointment Date", type: "date", required: true },
      { key: "appointmentTime", label: "Appointment Time", type: "time", required: true },
    ],
    help: {
      whenToUse: "Calling a patient to confirm an upcoming appointment.",
      commonMistakes: [
        "Forgetting to remind the patient to arrive 15 minutes early.",
        "Not mentioning the cancellation/no-show policy.",
      ],
      example:
        "09/26 @ 09:30 AM – Called pt re appointment. Pt confirmed attendance for 09/29 @ 10:00 AM. Reminded pt to arrive 15 minutes early and informed pt of the cancellation/no-show policy.",
      relatedSopLabel: "SOP: Appointment Scheduling & Confirmation",
    },
  },
  {
    id: "appointment_reschedule",
    category: "patient_communication",
    label: "Appointment Reschedule",
    fields: [
      { key: "oldDate", label: "Original Date", type: "date", required: true },
      { key: "newDate", label: "New Date", type: "date", required: true },
      { key: "newTime", label: "New Time", type: "time", required: true },
    ],
    help: {
      whenToUse: "A patient asks to move an existing appointment to a new date/time.",
      commonMistakes: [
        "Not confirming the new date and time back to the patient before hanging up.",
        "Forgetting to update the appointment in PracticeQ after documenting.",
      ],
      example:
        "09/26 @ 09:30 AM – Pt requested to reschedule appt from 09/28 to 10/03 @ 2:00 PM. New date confirmed with pt.",
      relatedSopLabel: "SOP: Appointment Scheduling & Confirmation",
    },
  },
  {
    id: "voicemail",
    category: "patient_communication",
    label: "Voicemail",
    fields: [
      { key: "phone", label: "Phone Number", type: "text", required: true, placeholder: "(555) 555-5555" },
      { key: "reason", label: "Reason for Call", type: "text", required: true },
      { key: "callbackRequested", label: "Callback requested", type: "checkbox" },
    ],
    help: {
      whenToUse: "You called a patient and reached voicemail instead of the patient directly.",
      commonMistakes: [
        "Not stating a reason for the call in the note, only \"left voicemail.\"",
        "Forgetting to note whether a callback was requested in the message.",
      ],
      example:
        "09/26 @ 09:30 AM – Left voicemail for pt at (555) 555-5555 re upcoming sleep study. Callback requested: Yes.",
      relatedSopLabel: "SOP: Patient Phone Calls",
    },
  },
  {
    id: "no_answer",
    category: "patient_communication",
    label: "No Answer",
    fields: [
      { key: "phone", label: "Phone Number", type: "text", required: true, placeholder: "(555) 555-5555" },
      { key: "attemptNumber", label: "Attempt #", type: "select", options: [
        { value: "1", label: "1st attempt" },
        { value: "2", label: "2nd attempt" },
        { value: "3", label: "3rd attempt" },
      ], required: true },
    ],
    help: {
      whenToUse: "You called a patient and the call rang without going to voicemail.",
      commonMistakes: [
        "Not tracking which attempt number this is — the clinic escalates after 3 unanswered attempts.",
      ],
      example: "09/26 @ 09:30 AM – Called pt at (555) 555-5555, no answer (2nd attempt). No voicemail left.",
      relatedSopLabel: "SOP: Patient Phone Calls",
    },
  },
  {
    id: "inbound_call",
    category: "patient_communication",
    label: "Inbound Call",
    fields: [
      { key: "reason", label: "Reason for Call", type: "textarea", required: true },
    ],
    help: {
      whenToUse: "A patient calls the clinic directly with a question or request.",
      commonMistakes: [
        "Summarizing too briefly — document what the patient asked and what you told them.",
      ],
      example:
        "09/26 @ 09:30 AM – Pt called re medication side effects. Advised pt to monitor symptoms and call provider if they worsen.",
      relatedSopLabel: "SOP: Patient Phone Calls",
    },
  },

  // ---------------------------------------------------------------- Sleep Medicine
  {
    id: "sleep_study_coordination",
    category: "sleep_medicine",
    label: "Sleep Study Coordination",
    fields: [
      { key: "studyType", label: "Study Type", type: "select", required: true, options: [
        { value: "home_sleep_test", label: "Home Sleep Test" },
        { value: "in_lab_psg", label: "In-Lab PSG" },
        { value: "titration", label: "Titration Study" },
      ] },
      { key: "facility", label: "Facility", type: "text", placeholder: "Dream Sleep Center", required: true },
      { key: "confirmationStatus", label: "Confirmation Status", type: "select", options: [
        { value: "sent", label: "Sent — awaiting confirmation" },
        { value: "confirmed", label: "Confirmed" },
        { value: "scheduled", label: "Scheduled with patient" },
      ], required: true },
    ],
    help: {
      whenToUse: "Coordinating a sleep study order with Dream Sleep Center, including sending the order and scheduling the patient.",
      commonMistakes: [
        "Not documenting the facility's confirmation status, so follow-up timing is unclear.",
        "Forgetting to note the study type, which affects DME/billing downstream.",
      ],
      example:
        "09/26 @ 09:30 AM – Home sleep test order sent to Dream Sleep Center. Awaiting confirmation before scheduling pt.",
      relatedSopLabel: "SOP: Sleep Study Ordering",
    },
  },
  {
    id: "pap_order",
    category: "sleep_medicine",
    label: "PAP Order",
    fields: [
      { key: "dmeSupplier", label: "DME Supplier", type: "text", placeholder: "NLM", required: true },
      { key: "equipment", label: "Equipment", type: "text", placeholder: "ResMed AirSense 11 + mask", required: true },
      { key: "faxConfirmation", label: "Fax Confirmation #", type: "text" },
    ],
    help: {
      whenToUse: "Sending a new PAP (CPAP/BiPAP) equipment order to a DME supplier such as NLM.",
      commonMistakes: [
        "Not recording the fax confirmation number, making it hard to prove the order was sent if the supplier claims otherwise.",
        "Leaving out the specific equipment/mask type ordered.",
      ],
      example:
        "09/26 @ 09:30 AM – PAP order sent to NLM for ResMed AirSense 11 + mask. Fax confirmation #48213 received.",
      relatedSopLabel: "SOP: PAP Equipment Coordination",
    },
  },
  {
    id: "pap_followup",
    category: "sleep_medicine",
    label: "PAP Follow-up",
    fields: [
      { key: "complianceStatus", label: "Compliance Status", type: "select", required: true, options: [
        { value: "compliant", label: "Compliant" },
        { value: "non_compliant", label: "Non-compliant" },
        { value: "unknown", label: "Not yet reviewed" },
      ] },
      { key: "issuesReported", label: "Issues Reported", type: "textarea", placeholder: "Mask fit, pressure, dryness, etc." },
    ],
    help: {
      whenToUse: "Following up with a patient already using PAP therapy to check compliance data or troubleshoot issues.",
      commonMistakes: [
        "Not documenting specific issues reported (mask leak, dryness) — this is what the provider needs to adjust settings.",
      ],
      example:
        "09/26 @ 09:30 AM – Called pt re PAP compliance. Compliance status: Compliant. Pt reports occasional mask leak, advised on refit.",
      relatedSopLabel: "SOP: PAP Equipment Coordination",
    },
  },
  {
    id: "lab_review",
    category: "sleep_medicine",
    label: "Lab Review",
    fields: [
      { key: "labName", label: "Lab / Test Name", type: "text", required: true, placeholder: "A1C, CBC, CMP..." },
      { key: "resultSummary", label: "Result Summary", type: "textarea", required: true },
      { key: "providerNotified", label: "Provider notified", type: "checkbox" },
    ],
    help: {
      whenToUse: "Reviewing lab results that came back and documenting whether the provider has been notified.",
      commonMistakes: [
        "Reviewing results without documenting whether the provider was notified of an abnormal value.",
      ],
      example:
        "09/26 @ 09:30 AM – Reviewed CBC results for pt. Result summary: within normal limits. Provider notified: Yes.",
      relatedSopLabel: "SOP: Lab Review",
    },
  },
  {
    id: "referral_followup",
    category: "sleep_medicine",
    label: "Referral Follow-up",
    fields: [
      { key: "referralOffice", label: "Referral Office", type: "text", required: true },
      { key: "referenceNumber", label: "Reference Number", type: "text" },
      { key: "authStatus", label: "Authorization Status", type: "select", options: PA_STATUS_OPTIONS, required: true },
    ],
    help: {
      whenToUse: "Calling a referral office regarding a pending authorization or scheduling status.",
      commonMistakes: [
        "Forgetting to document the reference number — without it, a second call has to start from scratch.",
      ],
      example:
        "09/26 @ 09:30 AM – Called ENT referral office re pending auth. Authorization status: Pending. Reference #RX88213 provided.",
      relatedSopLabel: "SOP: Referral Management",
    },
  },
  {
    id: "roi_request",
    category: "sleep_medicine",
    label: "ROI Request",
    fields: [
      { key: "recipient", label: "Recipient", type: "text", required: true, placeholder: "Requesting office/party" },
      { key: "recordsRequested", label: "Records Requested", type: "textarea", required: true },
      { key: "roiSigned", label: "ROI signed by patient", type: "checkbox" },
    ],
    help: {
      whenToUse: "Processing a Release of Information request — either sending records out or requesting a signed ROI from the patient.",
      commonMistakes: [
        "Sending records before confirming the ROI is signed on file.",
      ],
      example:
        "09/26 @ 09:30 AM – ROI request processed for ENT referral office. Records requested: sleep study report + clinical notes. ROI signed by patient: Yes.",
      relatedSopLabel: "SOP: ROI / Medical Records",
    },
  },

  // ---------------------------------------------------------------- Weight Management
  {
    id: "new_consultation_followup",
    category: "weight_management",
    label: "New Consultation Follow-up",
    fields: [
      { key: "programInterest", label: "Program Interest", type: "text", placeholder: "GLP-1, lifestyle program, etc." },
      { key: "nextStep", label: "Next Step", type: "textarea", required: true },
    ],
    help: {
      whenToUse: "Following up after a patient's first weight management consultation.",
      commonMistakes: [
        "Not documenting a concrete next step, leaving the loop unclear on what happens next.",
      ],
      example:
        "09/26 @ 09:30 AM – Followed up after new weight consult. Program interest: GLP-1 medication. Next step: schedule lab work before medication start.",
      relatedSopLabel: "SOP: Initial Weight Consultation",
    },
  },
  {
    id: "glp1_prior_auth",
    category: "weight_management",
    label: "GLP-1 Prior Authorization",
    fields: [
      { key: "insurance", label: "Insurance", type: "text", required: true },
      { key: "medication", label: "Medication", type: "text", required: true, placeholder: "Semaglutide, Tirzepatide..." },
      { key: "paStatus", label: "PA Status", type: "select", required: true, options: PA_STATUS_OPTIONS },
      { key: "referenceNumber", label: "Reference Number", type: "text" },
    ],
    help: {
      whenToUse: "Submitting or checking on a GLP-1 medication prior authorization with insurance.",
      commonMistakes: [
        "Not recording the reference number, which insurance will ask for on every follow-up call.",
        "Leaving the PA status as \"Pending\" without a follow-up date set on the open loop.",
      ],
      example:
        "09/26 @ 09:30 AM – GLP-1 prior authorization submitted to insurance for Semaglutide. PA Status: Submitted. Reference #GLP4471.",
      relatedSopLabel: "SOP: Prior Authorization for Weight Medications",
    },
  },
  {
    id: "medication_followup",
    category: "weight_management",
    label: "Medication Follow-up",
    fields: [
      { key: "medication", label: "Medication", type: "text", required: true },
      { key: "sideEffects", label: "Side Effects Reported", type: "textarea" },
      { key: "refillNeeded", label: "Refill needed", type: "checkbox" },
    ],
    help: {
      whenToUse: "Checking in with a patient on an active weight-management medication.",
      commonMistakes: [
        "Documenting side effects without flagging refill needs — the provider needs both to decide next steps.",
        "Routing a refill request without provider approval — the HVA logs the request, the provider approves it.",
      ],
      example:
        "09/26 @ 09:30 AM – Followed up on Semaglutide. Side effects reported: mild nausea, improving. Refill needed: Yes — routed to provider for approval.",
      relatedSopLabel: "SOP: GLP-1 Medication Follow-up",
    },
  },
  {
    id: "weight_followup",
    category: "weight_management",
    label: "Weight Follow-up",
    fields: [
      { key: "currentWeight", label: "Current Weight (lbs)", type: "text", required: true },
      { key: "progressNote", label: "Progress Note", type: "textarea" },
    ],
    help: {
      whenToUse: "Monthly weight check-in call to log progress.",
      commonMistakes: [
        "Recording the weight without any progress note, losing context for the next follow-up.",
      ],
      example:
        "09/26 @ 09:30 AM – Monthly weight follow-up call. Current weight: 214 lbs. Progress note: down 6 lbs since last visit, tolerating medication well.",
      relatedSopLabel: "SOP: Monthly Weight Follow-up",
    },
  },
  {
    id: "lab_monitoring",
    category: "weight_management",
    label: "Lab Monitoring",
    fields: [
      { key: "labName", label: "Lab / Test Name", type: "text", required: true },
      { key: "resultSummary", label: "Result Summary", type: "textarea", required: true },
      { key: "providerNotified", label: "Provider notified", type: "checkbox" },
    ],
    help: {
      whenToUse: "Reviewing routine lab monitoring results for a weight management patient (e.g. metabolic panel while on GLP-1 therapy).",
      commonMistakes: [
        "Not notifying the provider of results outside normal range before closing the loop.",
      ],
      example:
        "09/26 @ 09:30 AM – Reviewed CMP for pt on GLP-1 therapy. Result summary: within normal limits. Provider notified: Yes.",
      relatedSopLabel: "SOP: Lab Monitoring",
    },
  },

  // ---------------------------------------------------------------- Administrative
  {
    id: "fax_sent",
    category: "administrative",
    label: "Fax Sent",
    fields: [
      { key: "recipient", label: "Recipient", type: "text", required: true },
      { key: "documentsSent", label: "Documents Sent", type: "textarea", required: true },
      { key: "faxConfirmation", label: "Fax Confirmation #", type: "text" },
    ],
    help: {
      whenToUse: "Any time a fax is sent as part of a workflow and needs its own documentation entry.",
      commonMistakes: [
        "Not recording the fax confirmation number as proof the fax went through.",
      ],
      example:
        "09/26 @ 09:30 AM – Fax sent to Dream Sleep Center. Documents sent: sleep study order + clinical notes. Fax confirmation #77120.",
      relatedSopLabel: "SOP: General Documentation",
    },
  },
  {
    id: "email_sent",
    category: "administrative",
    label: "Email Sent",
    fields: [
      { key: "recipient", label: "Recipient", type: "text", required: true },
      { key: "subject", label: "Subject", type: "text", required: true },
      { key: "summary", label: "Summary", type: "textarea" },
    ],
    help: {
      whenToUse: "Any time an email is sent as part of a workflow and needs its own documentation entry.",
      commonMistakes: [
        "Copying the entire email body into the note instead of a short summary.",
      ],
      example:
        "09/26 @ 09:30 AM – Email sent to referral office. Subject: Pending authorization follow-up. Summary: requested status update on referral #4471.",
      relatedSopLabel: "SOP: General Documentation",
    },
  },
  {
    id: "general_note",
    category: "administrative",
    label: "General Note",
    fields: [
      { key: "details", label: "Details", type: "textarea", required: true },
    ],
    help: {
      whenToUse: "Anything that doesn't fit a specific template but still needs to be documented.",
      commonMistakes: [
        "Using General Note as a default instead of the closest matching template — a specific template keeps history searchable.",
      ],
      example: "09/26 @ 09:30 AM – Details: pt requested a copy of their visit summary; provided via patient portal.",
      relatedSopLabel: "SOP: General Documentation",
    },
  },
];

export function getTemplateById(id: DocumentationTemplateId): DocumentationTemplate {
  const template = DOCUMENTATION_TEMPLATES.find((item) => item.id === id);
  if (!template) {
    throw new Error(`Unknown documentation template: ${id}`);
  }
  return template;
}

export function templatesForCategory(category: DocumentationCategory): DocumentationTemplate[] {
  return DOCUMENTATION_TEMPLATES.filter((template) => template.category === category);
}

export { YES_NO_OPTIONS };
