"use client";

// components/workflow/DecisionHelperPanel.tsx
// "What are you doing today?" — the Wizard Home's fastest path in. Selecting
// an action jumps straight into that workflow's Detail page rather than
// making the HVA find the right card first.

import { useRouter } from "next/navigation";
import { Compass } from "lucide-react";
import { DECISION_HELPER_ACTIONS } from "@/lib/constants/workflow-definitions";

export function DecisionHelperPanel() {
  const router = useRouter();

  return (
    <section
      aria-labelledby="decision-helper-heading"
      className="rounded-card border border-secondary bg-secondary-light/40 p-5"
    >
      <h2 id="decision-helper-heading" className="flex items-center gap-2 text-base font-semibold text-accent">
        <Compass className="h-5 w-5 text-secondary-dark" aria-hidden="true" />
        What are you doing today?
      </h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {DECISION_HELPER_ACTIONS.map((action) => (
          <button
            key={action.label}
            type="button"
            onClick={() => router.push(`/workflow-wizard/${action.workflowId}`)}
            className="rounded-pill border border-secondary bg-white px-4 py-2 text-sm font-semibold text-secondary-dark transition-colors hover:bg-secondary-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40"
          >
            {action.label}
          </button>
        ))}
      </div>
    </section>
  );
}
