"use client";

// components/documentation/BeginnerAssistantPanel.tsx
// Collapsible help panel — the "personal learning system" half of this
// module. Content comes straight from the selected template's `help` data,
// so it can never drift out of sync with which template is active.

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { DocumentationTemplate } from "@/types";

interface BeginnerAssistantPanelProps {
  template: DocumentationTemplate;
}

export function BeginnerAssistantPanel({ template }: BeginnerAssistantPanelProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="rounded-card border border-surface-border bg-white shadow-card">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-controls="beginner-assistant-panel-content"
        className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left"
      >
        <span className="flex items-center gap-2 text-sm font-semibold text-accent">
          <GraduationCap className="h-4 w-4 text-secondary-dark" aria-hidden="true" />
          Beginner Assistant
        </span>
        <ChevronDown
          className={cn("h-4 w-4 text-accent/50 transition-transform", isOpen && "rotate-180")}
          aria-hidden="true"
        />
      </button>

      {isOpen ? (
        <div id="beginner-assistant-panel-content" className="flex flex-col gap-4 border-t border-surface-border px-4 py-4 text-sm">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-accent/40">When to Use</h4>
            <p className="mt-1 text-accent/80">{template.help.whenToUse}</p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-accent/40">Common Mistakes</h4>
            <ul className="mt-1 list-disc space-y-1 pl-4 text-accent/80">
              {template.help.commonMistakes.map((mistake) => (
                <li key={mistake}>{mistake}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-accent/40">Documentation Example</h4>
            <p className="mt-1 rounded-lg bg-surface p-3 text-xs text-accent/70">{template.help.example}</p>
          </div>

          <Link
            href="/sop"
            className="inline-flex items-center justify-center rounded-lg border border-secondary px-3 py-2 text-center text-xs font-semibold text-secondary-dark hover:bg-secondary-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40"
          >
            {template.help.relatedSopLabel}
          </Link>
        </div>
      ) : null}
    </div>
  );
}
