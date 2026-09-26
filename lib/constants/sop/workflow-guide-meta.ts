// lib/constants/sop/workflow-guide-meta.ts
// The only genuinely new content a Workflow Guide article needs: its
// Purpose paragraph and the 3 Quick Reference fields that aren't already
// derivable from the workflow's own definition (estimated time, output,
// difficulty). services/sop.service.ts merges this with the matching
// WorkflowDefinition (Phase 6) and DocumentationTemplate (Phase 5) to build
// the full article — required fields, steps, mistakes, and related software
// are never re-typed here.

import type { WorkflowGuideMeta } from "@/types";

export const WORKFLOW_GUIDE_META: WorkflowGuideMeta[] = [
  {
    workflowId: "scheduling",
    purpose:
      "Get a patient onto the schedule correctly the first time, so the visit type, provider, and confirmation are all right before the patient ever arrives.",
    estimatedTime: "5–10 minutes",
    output: "A confirmed appointment in PracticeQ + an Appointment Confirmation note",
    difficulty: "beginner",
  },
  {
    workflowId: "chart_preparation",
    purpose:
      "Make sure every chart on tomorrow's schedule is ready — insurance current, recent results attached, open items flagged — so the provider never has to stop mid-visit to track something down.",
    estimatedTime: "10–15 minutes per chart",
    output: "A prepared chart + a General Note confirming prep is complete",
    difficulty: "beginner",
  },
  {
    workflowId: "sleep_study",
    purpose:
      "Turn a provider's sleep study order into a confirmed, scheduled study with Dream Sleep Center, without losing track of insurance verification along the way.",
    estimatedTime: "15–20 minutes",
    output: "A confirmed sleep study order + a Sleep Study Coordination note",
    difficulty: "intermediate",
  },
  {
    workflowId: "pap_order",
    purpose:
      "Get a patient's PAP equipment order to the right DME supplier with proof it was received, so the patient isn't left waiting without a clear status.",
    estimatedTime: "10–15 minutes",
    output: "A confirmed DME order + a PAP Order note",
    difficulty: "beginner",
  },
  {
    workflowId: "labcorp",
    purpose:
      "Submit a provider's lab order to LabCorp and make sure results actually make it back to the chart instead of falling through the cracks.",
    estimatedTime: "10 minutes to order, 5 minutes to review results",
    output: "A submitted lab order + a Lab Review note once results are in",
    difficulty: "beginner",
  },
  {
    workflowId: "referral",
    purpose:
      "Send a patient's referral to the right specialist office with a signed ROI on file, and keep following up until the office confirms it.",
    estimatedTime: "15–20 minutes",
    output: "A sent referral + a Referral Follow-up note",
    difficulty: "intermediate",
  },
  {
    workflowId: "roi_medical_records",
    purpose:
      "Release exactly the records requested, to exactly the right party, only once a signed Release of Information is confirmed on file.",
    estimatedTime: "10–15 minutes",
    output: "Released records + an ROI Request note",
    difficulty: "beginner",
  },
  {
    workflowId: "new_weight_consult",
    purpose:
      "Follow up after a patient's first weight management visit so their program interest and next steps are captured while they're still fresh.",
    estimatedTime: "10 minutes",
    output: "A documented next step + a New Consultation Follow-up note",
    difficulty: "beginner",
  },
  {
    workflowId: "weight_followup",
    purpose:
      "Keep a monthly pulse on an active weight management patient's progress, so trends (or stalls) get noticed early.",
    estimatedTime: "5–10 minutes",
    output: "A logged weight + progress note + a Weight Follow-up note",
    difficulty: "beginner",
  },
  {
    workflowId: "prior_auth_glp1",
    purpose:
      "Get a GLP-1 medication authorized by insurance without the reference number or status getting lost between calls.",
    estimatedTime: "20–30 minutes, plus follow-up",
    output: "A submitted PA + a GLP-1 Prior Authorization note",
    difficulty: "intermediate",
  },
  {
    workflowId: "medication_followup",
    purpose:
      "Check in on how a patient is tolerating their weight management medication, and route any refill request to the provider — never approve one yourself.",
    estimatedTime: "10 minutes",
    output: "A documented check-in + a Medication Follow-up note",
    difficulty: "beginner",
  },
  {
    workflowId: "lab_monitoring",
    purpose:
      "Make sure routine labs tied to a patient's weight management therapy actually get reviewed, and that the provider hears about anything abnormal.",
    estimatedTime: "10 minutes",
    output: "Reviewed results + a Lab Monitoring note",
    difficulty: "beginner",
  },
];
