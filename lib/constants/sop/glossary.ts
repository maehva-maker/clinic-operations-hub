// lib/constants/sop/glossary.ts
// The Medical Glossary's 12 terms. Each links back to the workflow(s) where
// the term actually comes up, so the glossary is a jumping-off point rather
// than a dead-end definition list.

import type { GlossaryTerm } from "@/types";

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    id: "pap",
    term: "PAP",
    definition:
      "Positive Airway Pressure — the general category of therapy (including CPAP and BiPAP) that keeps a patient's airway open during sleep using a machine and mask.",
    relatedWorkflowIds: ["pap_order"],
  },
  {
    id: "cpap",
    term: "CPAP",
    definition:
      "Continuous Positive Airway Pressure — delivers one steady, constant pressure throughout the night. The most common PAP therapy prescribed for OSA.",
    relatedWorkflowIds: ["pap_order"],
  },
  {
    id: "bipap",
    term: "BiPAP",
    definition:
      "Bilevel Positive Airway Pressure — delivers two pressure levels, higher on inhale and lower on exhale. Often prescribed when CPAP alone isn't tolerated or effective.",
    relatedWorkflowIds: ["pap_order"],
  },
  {
    id: "osa",
    term: "OSA",
    definition:
      "Obstructive Sleep Apnea — repeated airway collapse during sleep causing breathing pauses. The most common diagnosis driving sleep study and PAP order workflows.",
    relatedWorkflowIds: ["sleep_study", "pap_order"],
  },
  {
    id: "ess",
    term: "ESS",
    definition:
      "Epworth Sleepiness Scale — a short questionnaire measuring daytime sleepiness, often completed in IntakeQ before a sleep medicine visit.",
    relatedWorkflowIds: ["sleep_study", "new_weight_consult"],
  },
  {
    id: "roi",
    term: "ROI",
    definition:
      "Release of Information — a signed form authorizing the clinic to send or receive a patient's medical records to/from another party.",
    relatedWorkflowIds: ["roi_medical_records", "referral"],
  },
  {
    id: "pa",
    term: "PA",
    definition:
      "Prior Authorization — insurance approval required before a medication, test, or procedure will be covered. Also the abbreviation for Physician Assistant (Donna Seo, PA) — context tells you which.",
    relatedWorkflowIds: ["prior_auth_glp1", "sleep_study"],
  },
  {
    id: "dme",
    term: "DME",
    definition:
      "Durable Medical Equipment — reusable medical equipment like PAP machines, ordered through suppliers such as NLM.",
    relatedWorkflowIds: ["pap_order"],
  },
  {
    id: "glp1",
    term: "GLP-1",
    definition:
      "A class of medications (e.g. Semaglutide, Tirzepatide) used for weight management and diabetes, often requiring prior authorization from insurance.",
    relatedWorkflowIds: ["prior_auth_glp1", "medication_followup"],
  },
  {
    id: "bmi",
    term: "BMI",
    definition:
      "Body Mass Index — a weight-to-height ratio used to screen for and monitor obesity in weight management patients.",
    relatedWorkflowIds: ["new_weight_consult", "weight_followup"],
  },
  {
    id: "sleep_study",
    term: "Sleep Study",
    definition:
      "A diagnostic test (home sleep test, in-lab PSG, or titration study) that measures breathing, oxygen, and sleep stages to diagnose conditions like OSA.",
    relatedWorkflowIds: ["sleep_study"],
  },
  {
    id: "prior_authorization",
    term: "Prior Authorization",
    definition:
      "The full name behind \"PA\" — the insurance approval process required before certain medications or procedures are covered.",
    relatedWorkflowIds: ["prior_auth_glp1", "sleep_study"],
  },
];
