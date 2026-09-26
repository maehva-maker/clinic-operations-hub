"use client";

// components/open-loops/DomainTabs.tsx
// The Sleep Medicine / Weight Management split that scopes every list and
// filter in the Open Loop Tracker. Built generically enough to be reused by
// the SOP & Learning Center in a later phase, per the wireframes.

import { cn } from "@/lib/utils/cn";
import { DOMAIN_LABEL } from "@/types";
import type { WorkflowDomain } from "@/types";

const DOMAINS: WorkflowDomain[] = ["sleep_medicine", "weight_management"];

interface DomainTabsProps {
  value: WorkflowDomain;
  onChange: (domain: WorkflowDomain) => void;
}

export function DomainTabs({ value, onChange }: DomainTabsProps) {
  return (
    <div role="tablist" aria-label="Workflow domain" className="flex gap-6 border-b border-surface-border">
      {DOMAINS.map((domain) => {
        const isActive = domain === value;
        return (
          <button
            key={domain}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(domain)}
            className={cn(
              "-mb-px border-b-2 px-1 pb-3 text-sm font-semibold transition-colors focus-visible:outline-none",
              isActive
                ? "border-primary text-primary-dark"
                : "border-transparent text-accent/50 hover:text-accent",
            )}
          >
            {DOMAIN_LABEL[domain]}
          </button>
        );
      })}
    </div>
  );
}
