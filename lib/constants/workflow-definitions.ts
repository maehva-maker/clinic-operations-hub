// lib/constants/workflow-definitions.ts
// The Workflow Engine's data: all 12 workflows named in the Phase 6 brief
// (7 Sleep Medicine + 5 Weight Management), each as a WorkflowDefinition —
// required information, ordered steps, beginner tips, and the Clinical
// Documentation template it produces. WorkflowDetailView and every panel it
// renders (Progress Tracker, Required Information Panel, Beginner Assistant)
// read only from this data — none of it is hardcoded per page.

import { SLEEP_CATEGORIES, WEIGHT_CATEGORIES } from "@/lib/constants/workflow-categories";
import type { DecisionHelperAction, WorkflowDefinition, WorkflowDefinitionId } from "@/types";

export const WORKFLOW_DEFINITIONS: WorkflowDefinition[] = [
  // ---------------------------------------------------------------- Sleep Medicine
  {
    id: "scheduling",
    domain: "sleep_medicine",
    title: "Appointment Scheduling",
    requiredInformation: ["Patient Name", "DOB", "Reason for Visit", "Preferred Date/Time"],
    steps: [
      { id: "verify-patient", label: "Verify Patient Identity", description: "Confirm patient name and date of birth in PracticeQ before scheduling." },
      { id: "check-availability", label: "Check Provider Availability", description: "Find an open slot with the requested provider that fits the patient's preferred date/time." },
      { id: "book-appointment", label: "Book Appointment", description: "Create the appointment in PracticeQ and select the correct visit type." },
      { id: "confirm-with-patient", label: "Confirm with Patient", description: "Call or message the patient to confirm the date, time, and arrival instructions." },
      { id: "generate-documentation", label: "Generate Documentation", description: "Generate an Appointment Confirmation note for the Activity Timeline.", requiresDocumentation: true },
    ],
    beginnerTips: {
      whenToUse: "A new or existing patient needs an appointment scheduled or rescheduled.",
      commonMistakes: [
        "Booking the wrong visit type, which throws off the provider's schedule.",
        "Forgetting to confirm the appointment back to the patient before ending the call.",
      ],
      timeSavingTips: [
        "Check the provider's schedule for the whole week at once instead of one day at a time.",
      ],
      relatedSoftware: ["PracticeQ"],
    },
    documentationTemplateId: "appointment_confirmation",
  },
  {
    id: "chart_preparation",
    domain: "sleep_medicine",
    title: "Chart Preparation",
    requiredInformation: ["Patient Name", "DOB", "Appointment Date", "Insurance Card on File", "Recent Labs/Studies"],
    steps: [
      { id: "pull-chart", label: "Pull Patient Chart", description: "Open the patient's chart in PracticeQ ahead of tomorrow's visit." },
      { id: "verify-insurance", label: "Verify Insurance on File", description: "Confirm insurance information is current; flag for verification if it has expired." },
      { id: "attach-recent-results", label: "Attach Recent Labs/Studies", description: "Attach any recent lab results or sleep study reports so the provider has them at the visit." },
      { id: "flag-open-items", label: "Flag Open Items for Provider", description: "Note any pending referrals, authorizations, or follow-ups the provider should know about." },
      { id: "generate-documentation", label: "Generate Documentation", description: "Log a General Note confirming the chart is prepared.", requiresDocumentation: true },
    ],
    beginnerTips: {
      whenToUse: "The day before a scheduled visit, for every patient on tomorrow's schedule.",
      commonMistakes: [
        "Skipping the insurance check because the chart \"looks\" complete.",
        "Not flagging open referrals/authorizations, leaving the provider to discover them mid-visit.",
      ],
      timeSavingTips: [
        "Prep charts in appointment order so nothing gets missed at the last minute.",
      ],
      relatedSoftware: ["PracticeQ", "Availity"],
    },
    documentationTemplateId: "general_note",
  },
  {
    id: "sleep_study",
    domain: "sleep_medicine",
    title: "Sleep Study Coordination",
    requiredInformation: ["Patient Name", "DOB", "Insurance", "Diagnosis", "Provider Order"],
    steps: [
      { id: "verify-insurance", label: "Verify Insurance", description: "Confirm the patient's insurance covers the ordered study type in Availity." },
      { id: "confirm-provider-order", label: "Confirm Provider Order", description: "Confirm the provider's order specifies the correct study type and diagnosis." },
      { id: "fax-order", label: "Fax Order", description: "Fax the order and clinical notes to Dream Sleep Center." },
      { id: "upload-confirmation", label: "Upload Confirmation", description: "Upload Dream Sleep Center's confirmation once received." },
      { id: "generate-documentation", label: "Generate Documentation", description: "Generate a Sleep Study Coordination note for the Activity Timeline.", requiresDocumentation: true },
    ],
    beginnerTips: {
      whenToUse: "A provider has ordered a home sleep test, in-lab PSG, or titration study.",
      commonMistakes: [
        "Faxing the order before insurance is verified, risking a denied study.",
        "Not following up when Dream Sleep Center doesn't confirm within 2 business days.",
      ],
      timeSavingTips: [
        "Batch-verify insurance for the week's sleep study orders on Monday morning.",
      ],
      relatedSoftware: ["PracticeQ", "Dream Sleep Center"],
    },
    documentationTemplateId: "sleep_study_coordination",
  },
  {
    id: "pap_order",
    domain: "sleep_medicine",
    title: "PAP Order",
    requiredInformation: ["Patient Name", "DOB", "Insurance", "Equipment Ordered", "DME Supplier"],
    steps: [
      { id: "verify-insurance", label: "Verify Insurance", description: "Confirm DME benefits and any prior authorization requirements in Availity." },
      { id: "confirm-equipment", label: "Confirm Equipment", description: "Confirm the specific PAP device and mask the provider ordered." },
      { id: "send-order-to-dme", label: "Send Order to DME Supplier", description: "Fax the order to NLM (or the patient's preferred DME supplier)." },
      { id: "confirm-fax-received", label: "Confirm Fax Received", description: "Call or check the supplier portal to confirm the order was received." },
      { id: "generate-documentation", label: "Generate Documentation", description: "Generate a PAP Order note for the Activity Timeline.", requiresDocumentation: true },
    ],
    beginnerTips: {
      whenToUse: "A provider orders new PAP equipment or a replacement/upgrade for an existing patient.",
      commonMistakes: [
        "Not recording the fax confirmation number, so there's no proof the order was sent.",
        "Ordering the wrong mask size/type without confirming with the patient first.",
      ],
      timeSavingTips: [
        "Keep NLM's direct order fax number pinned in the SOP Center instead of searching each time.",
      ],
      relatedSoftware: ["PracticeQ", "NLM"],
    },
    documentationTemplateId: "pap_order",
  },
  {
    id: "labcorp",
    domain: "sleep_medicine",
    title: "LabCorp",
    requiredInformation: ["Patient Name", "DOB", "Insurance", "Test(s) Ordered", "Provider Order"],
    steps: [
      { id: "confirm-order", label: "Confirm Provider Order", description: "Confirm which labs the provider ordered and why." },
      { id: "send-to-labcorp", label: "Send Order to LabCorp", description: "Submit the lab order through LabCorp's ordering system." },
      { id: "track-results", label: "Track for Results", description: "Check back for results and flag the chart once they arrive." },
      { id: "generate-documentation", label: "Generate Documentation", description: "Generate a Lab Review note summarizing the results.", requiresDocumentation: true },
    ],
    beginnerTips: {
      whenToUse: "A provider orders labs to be drawn and processed through LabCorp.",
      commonMistakes: [
        "Not confirming the diagnosis code matches the test ordered, which can delay processing.",
      ],
      timeSavingTips: [
        "Set a follow-up date when submitting the order so results are never forgotten.",
      ],
      relatedSoftware: ["PracticeQ", "LabCorp"],
    },
    documentationTemplateId: "lab_review",
  },
  {
    id: "referral",
    domain: "sleep_medicine",
    title: "Referral",
    requiredInformation: ["Patient Name", "DOB", "Insurance", "Referral Reason", "Receiving Office"],
    steps: [
      { id: "confirm-referral-need", label: "Confirm Referral Need", description: "Confirm the provider's referral reason and the receiving specialty office." },
      { id: "collect-roi", label: "Collect Signed ROI", description: "Confirm a signed Release of Information is on file before sending records." },
      { id: "send-referral", label: "Send Referral", description: "Send the referral packet and clinical notes to the receiving office." },
      { id: "follow-up", label: "Follow Up on Status", description: "Call the receiving office to confirm the referral and any pending authorization." },
      { id: "generate-documentation", label: "Generate Documentation", description: "Generate a Referral Follow-up note for the Activity Timeline.", requiresDocumentation: true },
    ],
    beginnerTips: {
      whenToUse: "A provider refers a patient to an outside specialist or office.",
      commonMistakes: [
        "Sending records before the ROI is signed and on file.",
        "Not documenting the reference number from the follow-up call.",
      ],
      timeSavingTips: [
        "Keep a running list of referral offices' direct fax numbers to avoid re-searching each time.",
      ],
      relatedSoftware: ["PracticeQ", "IntakeQ"],
    },
    documentationTemplateId: "referral_followup",
  },
  {
    id: "roi_medical_records",
    domain: "sleep_medicine",
    title: "ROI",
    requiredInformation: ["Patient Name", "DOB", "Recipient", "Records Requested", "Signed ROI Form"],
    steps: [
      { id: "verify-roi-signed", label: "Verify ROI Is Signed", description: "Confirm the patient has signed a Release of Information form on file." },
      { id: "gather-records", label: "Gather Requested Records", description: "Pull the specific records requested — visit notes, sleep study report, etc." },
      { id: "send-records", label: "Send Records", description: "Send the records to the requesting party by fax, secure email, or portal." },
      { id: "generate-documentation", label: "Generate Documentation", description: "Generate an ROI Request note for the Activity Timeline.", requiresDocumentation: true },
    ],
    beginnerTips: {
      whenToUse: "Someone (a patient, another office, or an attorney) requests medical records.",
      commonMistakes: [
        "Sending records without a signed ROI on file — this is a compliance issue, not just a documentation one.",
      ],
      timeSavingTips: [
        "Confirm exactly which records are requested before pulling the whole chart.",
      ],
      relatedSoftware: ["PracticeQ", "IntakeQ"],
    },
    documentationTemplateId: "roi_request",
  },

  // ---------------------------------------------------------------- Weight Management
  {
    id: "new_weight_consult",
    domain: "weight_management",
    title: "New Consultation",
    requiredInformation: ["Patient Name", "DOB", "Insurance", "Weight/BMI", "Program Interest"],
    steps: [
      { id: "verify-insurance", label: "Verify Insurance", description: "Confirm coverage for weight management visits and medications in Availity." },
      { id: "collect-intake", label: "Collect Intake Forms", description: "Confirm IntakeQ forms are complete before the visit." },
      { id: "review-with-provider", label: "Flag for Provider Review", description: "Note the patient's program interest and goals for the provider ahead of the visit." },
      { id: "generate-documentation", label: "Generate Documentation", description: "Generate a New Consultation Follow-up note after the visit.", requiresDocumentation: true },
    ],
    beginnerTips: {
      whenToUse: "A new patient's first weight management consultation is scheduled or has just occurred.",
      commonMistakes: [
        "Not confirming GLP-1 medication coverage before the visit, leading to surprises at prior authorization.",
      ],
      timeSavingTips: [
        "Send IntakeQ forms as soon as the consult is booked, not the day before.",
      ],
      relatedSoftware: ["PracticeQ", "IntakeQ", "Availity"],
    },
    documentationTemplateId: "new_consultation_followup",
  },
  {
    id: "weight_followup",
    domain: "weight_management",
    title: "Follow-up",
    requiredInformation: ["Patient Name", "DOB", "Current Weight", "Progress Since Last Visit"],
    steps: [
      { id: "call-patient", label: "Call Patient", description: "Call the patient for their scheduled monthly weight check-in." },
      { id: "log-weight", label: "Log Current Weight", description: "Record the patient's current weight and how it compares to the last visit." },
      { id: "flag-concerns", label: "Flag Concerns for Provider", description: "Note any concerns (plateau, side effects, non-compliance) for the provider." },
      { id: "generate-documentation", label: "Generate Documentation", description: "Generate a Weight Follow-up note for the Activity Timeline.", requiresDocumentation: true },
    ],
    beginnerTips: {
      whenToUse: "A routine monthly follow-up call for an active weight management patient.",
      commonMistakes: [
        "Logging the weight without a progress note, losing useful context for next month.",
      ],
      timeSavingTips: [
        "Review the last two follow-up notes before calling so you can ask specific questions.",
      ],
      relatedSoftware: ["PracticeQ"],
    },
    documentationTemplateId: "weight_followup",
  },
  {
    id: "prior_auth_glp1",
    domain: "weight_management",
    title: "GLP-1 Prior Authorization",
    requiredInformation: ["Patient Name", "DOB", "Insurance", "Medication", "Provider Order"],
    steps: [
      { id: "confirm-order", label: "Confirm Provider Order", description: "Confirm the exact medication, dose, and diagnosis code the provider ordered." },
      { id: "submit-pa", label: "Submit Prior Authorization", description: "Submit the PA request to insurance through Availity." },
      { id: "track-status", label: "Track PA Status", description: "Check back on the PA status and follow up if it's pending too long." },
      { id: "notify-patient", label: "Notify Patient of Outcome", description: "Call the patient once the PA is approved or denied." },
      { id: "generate-documentation", label: "Generate Documentation", description: "Generate a GLP-1 Prior Authorization note for the Activity Timeline.", requiresDocumentation: true },
    ],
    beginnerTips: {
      whenToUse: "A provider prescribes a GLP-1 medication that requires prior authorization.",
      commonMistakes: [
        "Not recording the PA reference number — insurance will ask for it on every follow-up call.",
        "Leaving a PA in \"Pending\" status without a follow-up date set.",
      ],
      timeSavingTips: [
        "Submit PAs first thing in the morning — most insurers' portals are fastest before midday.",
      ],
      relatedSoftware: ["Availity", "PracticeQ"],
    },
    documentationTemplateId: "glp1_prior_auth",
  },
  {
    id: "medication_followup",
    domain: "weight_management",
    title: "Medication Follow-up",
    requiredInformation: ["Patient Name", "DOB", "Medication", "Side Effects", "Refill Status"],
    steps: [
      { id: "call-patient", label: "Call Patient", description: "Call the patient to check in on their current medication." },
      { id: "log-side-effects", label: "Log Side Effects", description: "Record any side effects the patient reports." },
      { id: "route-refill", label: "Route Refill Request", description: "If a refill is needed, route the request to the provider for approval — never approve it yourself." },
      { id: "generate-documentation", label: "Generate Documentation", description: "Generate a Medication Follow-up note for the Activity Timeline.", requiresDocumentation: true },
    ],
    beginnerTips: {
      whenToUse: "A routine check-in on a patient's active weight management medication.",
      commonMistakes: [
        "Approving or promising a refill directly — refill decisions are the provider's, not the HVA's.",
      ],
      timeSavingTips: [
        "Ask about side effects and refill status in the same call to avoid a second follow-up.",
      ],
      relatedSoftware: ["PracticeQ"],
    },
    documentationTemplateId: "medication_followup",
  },
  {
    id: "lab_monitoring",
    domain: "weight_management",
    title: "Lab Monitoring",
    requiredInformation: ["Patient Name", "DOB", "Test(s) Ordered", "Result Summary"],
    steps: [
      { id: "confirm-order", label: "Confirm Provider Order", description: "Confirm which labs are due for this patient's monitoring schedule." },
      { id: "review-results", label: "Review Results", description: "Review the results once they're back and note anything outside normal range." },
      { id: "notify-provider", label: "Notify Provider if Needed", description: "Notify the provider of any abnormal results before closing the loop." },
      { id: "generate-documentation", label: "Generate Documentation", description: "Generate a Lab Monitoring note for the Activity Timeline.", requiresDocumentation: true },
    ],
    beginnerTips: {
      whenToUse: "Routine lab monitoring for a patient on GLP-1 or other weight management therapy.",
      commonMistakes: [
        "Filing results without notifying the provider of an out-of-range value.",
      ],
      timeSavingTips: [
        "Check the monitoring schedule when the patient is booked, not just when labs come back.",
      ],
      relatedSoftware: ["PracticeQ", "LabCorp"],
    },
    documentationTemplateId: "lab_monitoring",
  },
];

export function getWorkflowDefinition(id: WorkflowDefinitionId): WorkflowDefinition {
  const definition = WORKFLOW_DEFINITIONS.find((item) => item.id === id);
  if (!definition) {
    throw new Error(`Unknown workflow: ${id}`);
  }
  return definition;
}

export function workflowDefinitionsForDomain(
  domain: WorkflowDefinition["domain"],
): WorkflowDefinition[] {
  const ids = domain === "sleep_medicine" ? SLEEP_CATEGORIES : WEIGHT_CATEGORIES;
  return ids.map((id) => getWorkflowDefinition(id));
}

/** "What are you doing today?" quick actions on the Wizard Home. */
export const DECISION_HELPER_ACTIONS: DecisionHelperAction[] = [
  { label: "Scheduling", workflowId: "scheduling" },
  { label: "Prior Authorization", workflowId: "prior_auth_glp1" },
  { label: "Sleep Study", workflowId: "sleep_study" },
  { label: "PAP Order", workflowId: "pap_order" },
  { label: "Referral", workflowId: "referral" },
  // "Lab Review" has no single dedicated workflow — LabCorp is the closest
  // match (Weight Management's own lab workflow is "Lab Monitoring").
  { label: "Lab Review", workflowId: "labcorp" },
];
