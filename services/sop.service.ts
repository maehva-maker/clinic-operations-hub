// services/sop.service.ts
// The only place that composes SOP content. A Workflow Guide article is
// never hand-authored in full — it's built here from the Workflow Wizard's
// WorkflowDefinition (Phase 6), the Clinical Documentation template it
// produces (Phase 5), and this phase's own WorkflowGuideMeta (purpose +
// quick-reference basics). That composition is the "no duplicated business
// logic" rule in practice: required fields, steps, and common mistakes are
// read once, from the Workflow Wizard, not re-typed into the SOP Center.

import { getWorkflowDefinition, WORKFLOW_DEFINITIONS } from "@/lib/constants/workflow-definitions";
import { getTemplateById } from "@/lib/constants/documentation-templates";
import { WORKFLOW_GUIDE_META } from "@/lib/constants/sop/workflow-guide-meta";
import { SOFTWARE_GUIDES } from "@/lib/constants/sop/software-guides";
import { GLOSSARY_TERMS } from "@/lib/constants/sop/glossary";
import { matchesSearch } from "@/lib/utils/search";
import type {
  GlossaryTerm,
  SoftwareGuideArticle,
  SoftwareId,
  WorkflowDefinitionId,
  WorkflowGuideArticle,
} from "@/types";

function getWorkflowGuideMeta(workflowId: WorkflowDefinitionId) {
  const meta = WORKFLOW_GUIDE_META.find((item) => item.workflowId === workflowId);
  if (!meta) {
    throw new Error(`No SOP content authored yet for workflow: ${workflowId}`);
  }
  return meta;
}

export function getWorkflowGuideArticle(workflowId: WorkflowDefinitionId): WorkflowGuideArticle {
  const definition = getWorkflowDefinition(workflowId);
  const meta = getWorkflowGuideMeta(workflowId);
  const template = getTemplateById(definition.documentationTemplateId);

  return {
    kind: "workflow_guide",
    id: definition.id,
    title: definition.title,
    domain: definition.domain,
    purpose: meta.purpose,
    whenToUse: definition.beginnerTips.whenToUse,
    requiredFields: definition.requiredInformation,
    steps: definition.steps,
    commonMistakes: definition.beginnerTips.commonMistakes,
    documentationExample: template.help.example,
    relatedSoftware: definition.beginnerTips.relatedSoftware,
    documentationTemplateId: definition.documentationTemplateId,
    quickReference: {
      estimatedTime: meta.estimatedTime,
      softwareNeeded: definition.beginnerTips.relatedSoftware,
      output: meta.output,
      difficulty: meta.difficulty,
      relatedDocumentationTemplateId: definition.documentationTemplateId,
    },
  };
}

export function getAllWorkflowGuideArticles(): WorkflowGuideArticle[] {
  return WORKFLOW_DEFINITIONS.map((definition) => getWorkflowGuideArticle(definition.id));
}

export function getSoftwareGuide(id: SoftwareId): SoftwareGuideArticle {
  const guide = SOFTWARE_GUIDES.find((item) => item.id === id);
  if (!guide) {
    throw new Error(`Unknown software guide: ${id}`);
  }
  return guide;
}

export function getAllSoftwareGuides(): SoftwareGuideArticle[] {
  return SOFTWARE_GUIDES;
}

/** Resolves a related-software label (e.g. "Dream Sleep Center") to its guide, if one exists. */
export function findSoftwareGuideByTitle(title: string): SoftwareGuideArticle | null {
  return SOFTWARE_GUIDES.find((guide) => guide.title.toLowerCase() === title.toLowerCase()) ?? null;
}

export function getGlossaryTerms(): GlossaryTerm[] {
  return GLOSSARY_TERMS;
}

export interface SopSearchResults {
  workflowGuides: WorkflowGuideArticle[];
  softwareGuides: SoftwareGuideArticle[];
  glossaryTerms: GlossaryTerm[];
}

/** Global SOP search across all three content types, built on the shared matchesSearch() utility. */
export function searchSopContent(query: string): SopSearchResults {
  const workflowGuides = getAllWorkflowGuideArticles().filter((article) =>
    matchesSearch(query, article.title, article.purpose, article.whenToUse, article.requiredFields),
  );
  const softwareGuides = getAllSoftwareGuides().filter((guide) =>
    matchesSearch(query, guide.title, guide.whatIsIt, guide.whenToUseIt),
  );
  const glossaryTerms = getGlossaryTerms().filter((term) =>
    matchesSearch(query, term.term, term.definition),
  );

  return { workflowGuides, softwareGuides, glossaryTerms };
}
