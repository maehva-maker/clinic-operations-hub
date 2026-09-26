import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { WorkflowDetailView } from "@/components/workflow/WorkflowDetailView";
import { WORKFLOW_DEFINITIONS, getWorkflowDefinition } from "@/lib/constants/workflow-definitions";
import type { WorkflowDefinitionId } from "@/types";

interface WorkflowDetailPageProps {
  params: Promise<{ workflowId: string }>;
}

function isWorkflowDefinitionId(value: string): value is WorkflowDefinitionId {
  return WORKFLOW_DEFINITIONS.some((definition) => definition.id === value);
}

export async function generateMetadata({ params }: WorkflowDetailPageProps): Promise<Metadata> {
  const { workflowId } = await params;
  if (!isWorkflowDefinitionId(workflowId)) return { title: "Workflow Wizard" };
  return { title: getWorkflowDefinition(workflowId).title };
}

export function generateStaticParams() {
  return WORKFLOW_DEFINITIONS.map((definition) => ({ workflowId: definition.id }));
}

export default async function WorkflowDetailPage({ params }: WorkflowDetailPageProps) {
  const { workflowId } = await params;

  if (!isWorkflowDefinitionId(workflowId)) {
    notFound();
  }

  return (
    <Suspense fallback={<p className="text-sm text-accent/50">Loading workflow…</p>}>
      <WorkflowDetailView workflowId={workflowId} />
    </Suspense>
  );
}
