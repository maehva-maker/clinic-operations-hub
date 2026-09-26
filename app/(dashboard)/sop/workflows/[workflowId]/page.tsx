import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WorkflowGuideView } from "@/components/sop/WorkflowGuideView";
import { WORKFLOW_DEFINITIONS, getWorkflowDefinition } from "@/lib/constants/workflow-definitions";
import type { WorkflowDefinitionId } from "@/types";

interface WorkflowGuidePageProps {
  params: Promise<{ workflowId: string }>;
}

function isWorkflowDefinitionId(value: string): value is WorkflowDefinitionId {
  return WORKFLOW_DEFINITIONS.some((definition) => definition.id === value);
}

export async function generateMetadata({ params }: WorkflowGuidePageProps): Promise<Metadata> {
  const { workflowId } = await params;
  if (!isWorkflowDefinitionId(workflowId)) return { title: "Workflow Guide" };
  return { title: `${getWorkflowDefinition(workflowId).title} — SOP` };
}

export function generateStaticParams() {
  return WORKFLOW_DEFINITIONS.map((definition) => ({ workflowId: definition.id }));
}

export default async function WorkflowGuidePage({ params }: WorkflowGuidePageProps) {
  const { workflowId } = await params;

  if (!isWorkflowDefinitionId(workflowId)) {
    notFound();
  }

  return <WorkflowGuideView workflowId={workflowId} />;
}
