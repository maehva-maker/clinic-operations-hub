// lib/constants/workflow-categories.ts
// Domain-scoped category lists for the Open Loop Tracker's Phase 4 scope.
// The OpenLoopCategory type (types/shared.ts) is broader — it also carries
// categories from later PRD phases (ESS Questionnaire, Lifestyle Program
// Follow-up, BMI Monitoring) — but this phase surfaces only the categories
// named in the Phase 4 brief, so a category never appears somewhere it
// wasn't asked for yet.

import type { OpenLoopCategory, WorkflowDomain } from "@/types";

export const SLEEP_CATEGORIES: OpenLoopCategory[] = [
  "scheduling",
  "chart_preparation",
  "sleep_study",
  "pap_order",
  "labcorp",
  "referral",
  "roi_medical_records",
];

export const WEIGHT_CATEGORIES: OpenLoopCategory[] = [
  "new_weight_consult",
  "weight_followup",
  "prior_auth_glp1",
  "medication_followup",
  "lab_monitoring",
];

export const CATEGORY_LABEL: Record<OpenLoopCategory, string> = {
  scheduling: "Scheduling",
  chart_preparation: "Chart Preparation",
  sleep_study: "Sleep Study",
  pap_order: "PAP Order",
  labcorp: "LabCorp",
  referral: "Referral",
  roi_medical_records: "ROI",
  ess_questionnaire: "ESS Questionnaire",
  new_weight_consult: "New Consultation",
  weight_followup: "Follow-up",
  medication_followup: "Medication Follow-up",
  lifestyle_program_followup: "Lifestyle Program Follow-up",
  lab_monitoring: "Lab Monitoring",
  prior_auth_glp1: "GLP-1 Prior Authorization",
  bmi_monitoring: "BMI Monitoring",
};

export function categoriesForDomain(domain: WorkflowDomain): OpenLoopCategory[] {
  return domain === "sleep_medicine" ? SLEEP_CATEGORIES : WEIGHT_CATEGORIES;
}
