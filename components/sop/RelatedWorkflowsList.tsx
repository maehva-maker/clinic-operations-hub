// components/sop/RelatedWorkflowsList.tsx
// Reusable "related workflows" chip list — used by Software Guides and
// Medical Glossary terms so both link back into the Workflow Guide library
// the same way.

import Link from "next/link";
import { getWorkflowDefinition } from "@/lib/constants/workflow-definitions";
import type { WorkflowDefinitionId } from "@/types";

interface RelatedWorkflowsListProps {
  workflowIds: WorkflowDefinitionId[];
}

export function RelatedWorkflowsList({ workflowIds }: RelatedWorkflowsListProps) {
  if (workflowIds.length === 0) {
    return <p className="text-sm text-accent/50">No related workflows.</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {workflowIds.map((id) => {
        const definition = getWorkflowDefinition(id);
        return (
          <Link
            key={id}
            href={`/sop/workflows/${id}`}
            className="rounded-pill border border-secondary px-3 py-1.5 text-xs font-semibold text-secondary-dark hover:bg-secondary-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40"
          >
            {definition.title}
          </Link>
        );
      })}
    </div>
  );
}
