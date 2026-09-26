// types/sop.ts
// The SOP & Learning Center teaches rather than just documents. A Workflow
// Guide article is deliberately NOT its own content — it's composed from the
// Workflow Wizard's WorkflowDefinition (Phase 6) and the Clinical
// Documentation template it produces (Phase 5), plus the small amount of
// genuinely new content this phase adds (Purpose, Quick Reference). Software
// Guides and the Medical Glossary are new content types with no earlier
// phase to compose from.

import type { DocumentationTemplateId } from "./documentation";
import type { WorkflowDomain } from "./shared";
import type { WorkflowDefinitionId, WorkflowStepDef } from "./workflow";

export type ArticleDifficulty = "beginner" | "intermediate";

/** The colored info cards every article opens with. */
export interface QuickReference {
  estimatedTime: string;
  softwareNeeded: string[];
  output: string;
  difficulty: ArticleDifficulty;
  relatedDocumentationTemplateId: DocumentationTemplateId | null;
}

/**
 * The content genuinely new to this phase for a Workflow Guide. Everything
 * else that ends up in the composed article — required fields, steps,
 * common mistakes, related software, the linked documentation template — is
 * read straight from the workflow's WorkflowDefinition (Phase 6) by
 * services/sop.service.ts, so it can never drift out of sync with the
 * Workflow Wizard.
 */
export interface WorkflowGuideMeta {
  workflowId: WorkflowDefinitionId;
  purpose: string;
  estimatedTime: string;
  output: string;
  difficulty: ArticleDifficulty;
}

/** The fully composed article a Workflow Guide page renders. */
export interface WorkflowGuideArticle {
  kind: "workflow_guide";
  id: WorkflowDefinitionId;
  title: string;
  domain: WorkflowDomain;
  purpose: string;
  whenToUse: string;
  requiredFields: string[];
  steps: WorkflowStepDef[];
  commonMistakes: string[];
  documentationExample: string;
  relatedSoftware: string[];
  documentationTemplateId: DocumentationTemplateId;
  quickReference: QuickReference;
}

export type SoftwareId =
  | "practiceq"
  | "intakeq"
  | "availity"
  | "labcorp"
  | "dream_sleep_center"
  | "nlm"
  | "microsoft_teams";

export interface SoftwareGuideArticle {
  kind: "software_guide";
  id: SoftwareId;
  title: string;
  whatIsIt: string;
  whenToUseIt: string;
  navigationSteps: string[];
  requiredFields: string[];
  commonMistakes: string[];
  timeSavingTips: string[];
  relatedWorkflowIds: WorkflowDefinitionId[];
  quickReference: QuickReference;
}

export interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  relatedWorkflowIds: WorkflowDefinitionId[];
}

export type SopItemKind = "workflow_guide" | "software_guide" | "glossary";

/** A pointer to any SOP content item — what Favorites and Recently Viewed store. */
export interface SopReference {
  kind: SopItemKind;
  id: string;
  title: string;
  href: string;
}
