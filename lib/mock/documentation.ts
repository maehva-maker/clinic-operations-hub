// lib/mock/documentation.ts
// Seed data for Documentation History. Patients span both domains; Heather
// Stewart intentionally reuses the "H. Stewart" name from the Open Loop
// Tracker mock data (lib/mock/open-loops.ts, loop-7) so at least one entry
// demonstrates "Link to Existing Open Loop" pointing at a real loop, while
// the rest of the entries stand on their own the way most documentation
// does.

import type { DocumentationEntry } from "@/types";

export const MOCK_DOCUMENTATION_HISTORY: DocumentationEntry[] = [
  {
    id: "doc-1",
    templateId: "appointment_reschedule",
    category: "patient_communication",
    timestamp: "2026-09-19T09:20:00Z",
    noteText:
      "09/19/26 @ 9:20 AM – Pt requested to reschedule appointment. New date confirmed with pt. Rescheduled from 2026-09-28 to 2026-10-03 @ 14:00.",
    common: {
      patientName: "Heather Stewart",
      action: "Pt requested to reschedule appointment",
      outcome: "New date confirmed with pt",
      date: "2026-09-19",
      time: "09:20",
      performer: "Mae",
      additionalNote: "",
    },
    fieldValues: { oldDate: "2026-09-28", newDate: "2026-10-03", newTime: "14:00" },
    relatedOpenLoopId: "loop-7",
  },
  {
    id: "doc-2",
    templateId: "voicemail",
    category: "patient_communication",
    timestamp: "2026-09-24T15:45:00Z",
    noteText:
      "09/24/26 @ 3:45 PM – Called pt re PAP supply reorder. No answer, left voicemail. Left voicemail at (602) 555-0148. re PAP supply reorder. Callback requested: Yes.",
    common: {
      patientName: "Heather Stewart",
      action: "Called pt re PAP supply reorder",
      outcome: "No answer, left voicemail",
      date: "2026-09-24",
      time: "15:45",
      performer: "Mae",
      additionalNote: "",
    },
    fieldValues: { phone: "(602) 555-0148", reason: "PAP supply reorder", callbackRequested: "true" },
    relatedOpenLoopId: null,
  },
  {
    id: "doc-3",
    templateId: "sleep_study_coordination",
    category: "sleep_medicine",
    timestamp: "2026-09-20T11:10:00Z",
    noteText:
      "09/20/26 @ 11:10 AM – Home sleep test ordered for pt. Order sent to Dream Sleep Center. home sleep test coordinated with Dream Sleep Center (sent).",
    common: {
      patientName: "Heather Stewart",
      action: "Home sleep test ordered for pt",
      outcome: "Order sent to Dream Sleep Center",
      date: "2026-09-20",
      time: "11:10",
      performer: "Donna Seo, PA",
      additionalNote: "",
    },
    fieldValues: { studyType: "home_sleep_test", facility: "Dream Sleep Center", confirmationStatus: "sent" },
    relatedOpenLoopId: null,
  },
  {
    id: "doc-4",
    templateId: "glp1_prior_auth",
    category: "weight_management",
    timestamp: "2026-09-23T13:05:00Z",
    noteText:
      "09/23/26 @ 1:05 PM – GLP-1 prior authorization submitted for pt. Awaiting insurance response. Prior authorization submitted to Aetna for Semaglutide. PA Status: submitted. Reference #GLP4471.",
    common: {
      patientName: "Yukiko Britt",
      action: "GLP-1 prior authorization submitted for pt",
      outcome: "Awaiting insurance response",
      date: "2026-09-23",
      time: "13:05",
      performer: "Mae",
      additionalNote: "",
    },
    fieldValues: {
      insurance: "Aetna",
      medication: "Semaglutide",
      paStatus: "submitted",
      referenceNumber: "GLP4471",
    },
    relatedOpenLoopId: null,
  },
  {
    id: "doc-5",
    templateId: "weight_followup",
    category: "weight_management",
    timestamp: "2026-09-25T10:30:00Z",
    noteText:
      "09/25/26 @ 10:30 AM – Monthly weight follow-up call completed. Pt reports tolerating medication well. Current weight: 189 lbs. Progress note: down 5 lbs since last visit.",
    common: {
      patientName: "Yukiko Britt",
      action: "Monthly weight follow-up call completed",
      outcome: "Pt reports tolerating medication well",
      date: "2026-09-25",
      time: "10:30",
      performer: "Mae",
      additionalNote: "",
    },
    fieldValues: { currentWeight: "189", progressNote: "Down 5 lbs since last visit" },
    relatedOpenLoopId: null,
  },
  {
    id: "doc-6",
    templateId: "lab_monitoring",
    category: "weight_management",
    timestamp: "2026-09-22T09:50:00Z",
    noteText:
      "09/22/26 @ 9:50 AM – Reviewed CMP results for pt on GLP-1 therapy. Results within normal limits. Reviewed CMP. Result summary: within normal limits, no action needed. Provider notified: Yes.",
    common: {
      patientName: "Yukiko Britt",
      action: "Reviewed CMP results for pt on GLP-1 therapy",
      outcome: "Results within normal limits",
      date: "2026-09-22",
      time: "09:50",
      performer: "Mae",
      additionalNote: "",
    },
    fieldValues: { labName: "CMP", resultSummary: "Within normal limits, no action needed", providerNotified: "true" },
    relatedOpenLoopId: null,
  },
  {
    id: "doc-7",
    templateId: "pap_order",
    category: "sleep_medicine",
    timestamp: "2026-09-21T14:20:00Z",
    noteText:
      "09/21/26 @ 2:20 PM – PAP unit ordered for pt following diagnostic study. Order sent to NLM. PAP order sent to NLM for ResMed AirSense 11 + nasal mask. Fax confirmation #48213 received.",
    common: {
      patientName: "Maria Johnson",
      action: "PAP unit ordered for pt following diagnostic study",
      outcome: "Order sent to NLM",
      date: "2026-09-21",
      time: "14:20",
      performer: "Mae",
      additionalNote: "",
    },
    fieldValues: { dmeSupplier: "NLM", equipment: "ResMed AirSense 11 + nasal mask", faxConfirmation: "48213" },
    relatedOpenLoopId: null,
  },
  {
    id: "doc-8",
    templateId: "lab_review",
    category: "sleep_medicine",
    timestamp: "2026-09-18T08:40:00Z",
    noteText:
      "09/18/26 @ 8:40 AM – Reviewed A1C results for pt. Results reviewed and filed, no follow-up needed. Reviewed A1C. Result summary: 5.6%, within normal range. Provider notified: Yes.",
    common: {
      patientName: "Maria Johnson",
      action: "Reviewed A1C results for pt",
      outcome: "Results reviewed and filed, no follow-up needed",
      date: "2026-09-18",
      time: "08:40",
      performer: "Mae",
      additionalNote: "",
    },
    fieldValues: { labName: "A1C", resultSummary: "5.6%, within normal range", providerNotified: "true" },
    relatedOpenLoopId: null,
  },
  {
    id: "doc-9",
    templateId: "referral_followup",
    category: "sleep_medicine",
    timestamp: "2026-09-17T16:15:00Z",
    noteText:
      "09/17/26 @ 4:15 PM – Called ENT referral office re pending authorization for pt. Office confirmed auth is still processing. Followed up with Valley ENT Associates. Authorization status: pending. Reference #RX88213.",
    common: {
      patientName: "David Wilson",
      action: "Called ENT referral office re pending authorization for pt",
      outcome: "Office confirmed auth is still processing",
      date: "2026-09-17",
      time: "16:15",
      performer: "Donna Seo, PA",
      additionalNote: "",
    },
    fieldValues: { referralOffice: "Valley ENT Associates", authStatus: "pending", referenceNumber: "RX88213" },
    relatedOpenLoopId: null,
  },
  {
    id: "doc-10",
    templateId: "medication_followup",
    category: "weight_management",
    timestamp: "2026-09-16T12:00:00Z",
    noteText:
      "09/16/26 @ 12:00 PM – Called pt to check in on Tirzepatide. Pt reports mild nausea, otherwise tolerating well. Followed up on Tirzepatide. Side effects reported: mild nausea, improving. Refill needed: Yes.",
    common: {
      patientName: "David Wilson",
      action: "Called pt to check in on Tirzepatide",
      outcome: "Pt reports mild nausea, otherwise tolerating well",
      date: "2026-09-16",
      time: "12:00",
      performer: "Mae",
      additionalNote: "Routed refill request to provider for approval.",
    },
    fieldValues: { medication: "Tirzepatide", sideEffects: "Mild nausea, improving", refillNeeded: "true" },
    relatedOpenLoopId: null,
  },

  // Dated "today" (2026-09-26) so the Phase 9 Reports & Analytics module has
  // same-day activity to summarize in the Today/Yesterday date ranges.
  {
    id: "doc-11",
    templateId: "appointment_confirmation",
    category: "patient_communication",
    timestamp: "2026-09-26T08:15:00Z",
    noteText:
      "09/26/26 @ 8:15 AM – Called pt re appointment. Pt confirmed attendance. Confirmed for 2026-09-29 @ 10:00. Reminded pt to arrive 15 minutes early.",
    common: {
      patientName: "Jorge Alvarez",
      action: "Called pt re appointment",
      outcome: "Pt confirmed attendance",
      date: "2026-09-26",
      time: "08:15",
      performer: "Mae",
      additionalNote: "Reminded pt to arrive 15 minutes early.",
    },
    fieldValues: { appointmentDate: "2026-09-29", appointmentTime: "10:00" },
    relatedOpenLoopId: null,
  },
  {
    id: "doc-12",
    templateId: "no_answer",
    category: "patient_communication",
    timestamp: "2026-09-26T09:40:00Z",
    noteText:
      "09/26/26 @ 9:40 AM – Called pt re sleep study coordination. No answer, will retry this afternoon. No answer at (602) 555-0134 (attempt #1).",
    common: {
      patientName: "Marisol Torres",
      action: "Called pt re sleep study coordination",
      outcome: "No answer, will retry this afternoon",
      date: "2026-09-26",
      time: "09:40",
      performer: "Mae",
      additionalNote: "",
    },
    fieldValues: { phone: "(602) 555-0134", attemptNumber: "1" },
    relatedOpenLoopId: "loop-2",
  },
  {
    id: "doc-13",
    templateId: "pap_order",
    category: "sleep_medicine",
    timestamp: "2026-09-26T11:05:00Z",
    noteText:
      "09/26/26 @ 11:05 AM – PAP unit re-ordered for pt after insurance approval. Order sent to NLM. PAP order sent to NLM for ResMed AirSense 11. Fax confirmation #48901 received.",
    common: {
      patientName: "Jorge Alvarez",
      action: "PAP unit re-ordered for pt after insurance approval",
      outcome: "Order sent to NLM",
      date: "2026-09-26",
      time: "11:05",
      performer: "Mae",
      additionalNote: "",
    },
    fieldValues: { dmeSupplier: "NLM", equipment: "ResMed AirSense 11", faxConfirmation: "48901" },
    relatedOpenLoopId: "loop-1",
  },
  {
    id: "doc-14",
    templateId: "glp1_prior_auth",
    category: "weight_management",
    timestamp: "2026-09-26T13:30:00Z",
    noteText:
      "09/26/26 @ 1:30 PM – GLP-1 prior authorization follow-up call completed for pt. Still pending with Availity. Prior authorization submitted to Availity for Semaglutide. PA Status: pending. Reference #GLP-88213.",
    common: {
      patientName: "Stephanie Nguyen",
      action: "GLP-1 prior authorization follow-up call completed for pt",
      outcome: "Still pending with Availity",
      date: "2026-09-26",
      time: "13:30",
      performer: "Mae",
      additionalNote: "",
    },
    fieldValues: {
      insurance: "Availity",
      medication: "Semaglutide",
      paStatus: "pending",
      referenceNumber: "GLP-88213",
    },
    relatedOpenLoopId: "loop-10",
  },
];
