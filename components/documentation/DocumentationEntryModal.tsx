"use client";

// components/documentation/DocumentationEntryModal.tsx
// Clicking a Documentation History row opens the full generated note in this
// modal, along with its metadata and a Copy action — the same note text a
// person would have copied at save time.

import { Copy } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { getTemplateById } from "@/lib/constants/documentation-templates";
import { CATEGORY_LABEL } from "@/lib/constants/workflow-categories";
import { formatTimelineTimestamp } from "@/lib/utils/date";
import type { DocumentationEntry, OpenLoop } from "@/types";

interface DocumentationEntryModalProps {
  entry: DocumentationEntry | null;
  relatedLoop: OpenLoop | null;
  onClose: () => void;
  onCopy: (text: string) => void;
}

export function DocumentationEntryModal({
  entry,
  relatedLoop,
  onClose,
  onCopy,
}: DocumentationEntryModalProps) {
  if (!entry) return null;

  const template = getTemplateById(entry.templateId);

  return (
    <Modal isOpen={Boolean(entry)} onClose={onClose} title={`${entry.common.patientName} — ${template.label}`}>
      <div className="flex flex-col gap-4">
        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-accent/50">Timestamp</dt>
            <dd className="text-accent">{formatTimelineTimestamp(entry.timestamp)}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-accent/50">Performer</dt>
            <dd className="text-accent">{entry.common.performer}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-accent/50">Category</dt>
            <dd className="text-accent">{template.label}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-accent/50">Related Open Loop</dt>
            <dd className="text-accent">
              {relatedLoop ? `${relatedLoop.patientName} — ${CATEGORY_LABEL[relatedLoop.category]}` : "None"}
            </dd>
          </div>
        </dl>

        <div className="whitespace-pre-wrap rounded-card border border-surface-border bg-surface p-4 text-sm text-accent">
          {entry.noteText}
        </div>

        <Button type="button" variant="secondary" onClick={() => onCopy(entry.noteText)}>
          <Copy className="h-4 w-4" aria-hidden="true" />
          Copy to Clipboard
        </Button>
      </div>
    </Modal>
  );
}
