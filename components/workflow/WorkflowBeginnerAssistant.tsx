"use client";

// components/workflow/WorkflowBeginnerAssistant.tsx
// Right panel of Workflow Detail. Same collapsible pattern as Clinical
// Documentation's BeginnerAssistantPanel, adapted to a workflow's own help
// shape (time-saving tips and related software instead of a single example).

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { getTemplateById } from "@/lib/constants/documentation-templates";
import type { WorkflowDefinition } from "@/types";

interface WorkflowBeginnerAssistantProps {
  definition: WorkflowDefinition;
}

export function WorkflowBeginnerAssistant({ definition }: WorkflowBeginnerAssistantProps) {
  const [isOpen, setIsOpen] = useState(true);
  const template = getTemplateById(definition.documentationTemplateId);

  return (
    <div className="rounded-card border border-surface-border bg-white shadow-card">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-controls="workflow-beginner-assistant-content"
        className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left"
      >
        <span className="flex items-center gap-2 text-sm font-semibold text-accent">
          <GraduationCap className="h-4 w-4 text-secondary-dark" aria-hidden="true" />
          Beginner Assistant
        </span>
        <ChevronDown className={cn("h-4 w-4 text-accent/50 transition-transform", isOpen && "rotate-180")} aria-hidden="true" />
      </button>

      {isOpen ? (
        <div id="workflow-beginner-assistant-content" className="flex flex-col gap-4 border-t border-surface-border px-4 py-4 text-sm">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-accent/40">When to Use</h4>
            <p className="mt-1 text-accent/80">{definition.beginnerTips.whenToUse}</p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-accent/40">Required Fields</h4>
            <ul className="mt-1 list-disc space-y-1 pl-4 text-accent/80">
              {definition.requiredInformation.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-accent/40">Common Mistakes</h4>
            <ul className="mt-1 list-disc space-y-1 pl-4 text-accent/80">
              {definition.beginnerTips.commonMistakes.map((mistake) => (
                <li key={mistake}>{mistake}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-accent/40">Time-Saving Tips</h4>
            <ul className="mt-1 list-disc space-y-1 pl-4 text-accent/80">
              {definition.beginnerTips.timeSavingTips.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-accent/40">Related Software</h4>
            <p className="mt-1 text-accent/80">{definition.beginnerTips.relatedSoftware.join(", ")}</p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-accent/40">Related Documentation</h4>
            <Link
              href="/clinical-documentation"
              className="mt-1 inline-flex items-center justify-center rounded-lg border border-secondary px-3 py-2 text-center text-xs font-semibold text-secondary-dark hover:bg-secondary-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40"
            >
              {template.label}
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
