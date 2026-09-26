"use client";

// components/workflow/RequiredInformationPanel.tsx
// The Required Information Panel: everything the HVA needs in hand before
// (and while) working the steps. Unconfirmed items are visually highlighted
// per the brief, using the same Checkbox primitive as Clinical Documentation.

import { AlertTriangle } from "lucide-react";
import { Checkbox } from "@/components/ui/Checkbox";
import { cn } from "@/lib/utils/cn";

interface RequiredInformationPanelProps {
  requiredInformation: string[];
  confirmedItems: string[];
  onToggleItem: (item: string) => void;
  /** Before a run exists there's nothing to confirm against yet — show the checklist for reference only. */
  readOnly?: boolean;
}

export function RequiredInformationPanel({
  requiredInformation,
  confirmedItems,
  onToggleItem,
  readOnly = false,
}: RequiredInformationPanelProps) {
  const missingCount = requiredInformation.filter((item) => !confirmedItems.includes(item)).length;

  return (
    <section aria-labelledby="required-info-heading" className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 id="required-info-heading" className="text-xs font-semibold uppercase tracking-wide text-accent/40">
          Required Information
        </h3>
        {missingCount > 0 ? (
          <span className="flex items-center gap-1 text-xs font-medium text-warning">
            <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
            {missingCount} missing
          </span>
        ) : (
          <span className="text-xs font-medium text-success">All confirmed</span>
        )}
      </div>

      <ul className="flex flex-col gap-2">
        {requiredInformation.map((item) => {
          const isConfirmed = confirmedItems.includes(item);
          return (
            <li
              key={item}
              className={cn(
                "rounded-lg border px-3 py-2",
                isConfirmed ? "border-surface-border bg-white" : "border-warning bg-warning-light",
              )}
            >
              <Checkbox
                label={item}
                checked={isConfirmed}
                disabled={readOnly}
                onChange={() => onToggleItem(item)}
              />
            </li>
          );
        })}
      </ul>
    </section>
  );
}
