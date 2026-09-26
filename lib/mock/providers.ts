// lib/mock/providers.ts
// The Provider Directory's 2 providers. relatedWorkflowIds reuses the same
// WorkflowDefinitionId type as the Workflow Wizard and SOP Center, so
// "Related Workflows" links straight into Workflow Guides.

import type { Provider } from "@/types";

export const MOCK_PROVIDERS: Provider[] = [
  {
    id: "provider-mashayekhi",
    name: "Dr. Pegah Mashayekhi, MD",
    specialty: "Sleep Medicine & Weight Management",
    clinicDays: ["Monday", "Wednesday", "Friday"],
    notes: "Primary provider for both specialties. Orders most sleep studies and PAP equipment directly; reviews all GLP-1 prior authorizations before submission.",
    relatedWorkflowIds: ["sleep_study", "pap_order", "prior_auth_glp1", "referral"],
  },
  {
    id: "provider-seo",
    name: "Donna Seo, PA",
    specialty: "Sleep Medicine & Weight Management (Supporting Provider)",
    clinicDays: ["Tuesday", "Thursday"],
    notes: "Handles the majority of follow-up visits and new weight management consultations; first point of contact for chart prep questions on her clinic days.",
    relatedWorkflowIds: ["chart_preparation", "scheduling", "new_weight_consult", "weight_followup"],
  },
];
