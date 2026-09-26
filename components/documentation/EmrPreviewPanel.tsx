"use client";

// components/documentation/EmrPreviewPanel.tsx
// Right panel: the Live EMR Preview plus the Copy/Save actions and the
// "Link to Existing Open Loop" selector. The preview text is exactly what
// gets copied or saved — same buildEmrNote() output, no separate formatting
// step — so there is never a mismatch between what's shown and what's kept.

import { Copy, Link2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { CATEGORY_LABEL } from "@/lib/constants/workflow-categories";
import type { OpenLoop } from "@/types";

interface EmrPreviewPanelProps {
  previewText: string;
  isValid: boolean;
  missingFieldLabels: string[];
  isSaving: boolean;
  onCopy: () => void;
  onSave: () => void;
  relatedOpenLoopId: string | null;
  onRelatedOpenLoopChange: (id: string | null) => void;
  openLoopOptions: OpenLoop[];
}

export function EmrPreviewPanel({
  previewText,
  isValid,
  missingFieldLabels,
  isSaving,
  onCopy,
  onSave,
  relatedOpenLoopId,
  onRelatedOpenLoopChange,
  openLoopOptions,
}: EmrPreviewPanelProps) {
  const openLoopSelectOptions = [
    { value: "", label: "Not linked to an open loop" },
    ...openLoopOptions.map((loop) => ({
      value: loop.id,
      label: `${loop.patientName} — ${CATEGORY_LABEL[loop.category]}`,
    })),
  ];

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wide text-accent/40">
          Live EMR Preview
        </h3>
        <div
          className="mt-2 min-h-[7rem] whitespace-pre-wrap rounded-card border border-surface-border bg-surface p-4 text-sm text-accent"
          aria-live="polite"
        >
          {previewText || (
            <span className="text-accent/40">
              Fill in the required fields to generate this note.
            </span>
          )}
        </div>
      </div>

      {!isValid && missingFieldLabels.length > 0 ? (
        <div role="alert" className="rounded-lg bg-warning-light px-3 py-2 text-xs text-warning">
          Missing: {missingFieldLabels.join(", ")}
        </div>
      ) : null}

      <Select
        label="Link to Existing Open Loop"
        options={openLoopSelectOptions}
        value={relatedOpenLoopId ?? ""}
        onChange={(event) => onRelatedOpenLoopChange(event.target.value || null)}
      />
      {relatedOpenLoopId ? (
        <p className="-mt-2 flex items-center gap-1.5 text-xs text-accent/50">
          <Link2 className="h-3.5 w-3.5" aria-hidden="true" />
          Saving will also append this note to that loop&apos;s Activity Timeline.
        </p>
      ) : null}

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button
          type="button"
          variant="secondary"
          className="flex-1"
          onClick={onCopy}
          disabled={!previewText}
        >
          <Copy className="h-4 w-4" aria-hidden="true" />
          Copy to Clipboard
        </Button>
        <Button
          type="button"
          className="flex-1"
          onClick={onSave}
          disabled={!isValid || isSaving}
          aria-busy={isSaving}
        >
          {isSaving ? "Saving…" : "Save to Activity Timeline"}
        </Button>
      </div>
    </div>
  );
}
