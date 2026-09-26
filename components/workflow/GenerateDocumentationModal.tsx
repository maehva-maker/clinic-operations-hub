"use client";

// components/workflow/GenerateDocumentationModal.tsx
// Opened from the documentation step of a workflow. Reuses the same
// template metadata Clinical Documentation uses (lib/constants/
// documentation-templates.ts) so the example and field guidance shown here
// is guaranteed to match that module — the wizard doesn't maintain its own
// copy of what "PAP Order" documentation should look like.

import { useId, useState, type FormEvent } from "react";
import { Modal } from "@/components/ui/Modal";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { getTemplateById } from "@/lib/constants/documentation-templates";
import type { DocumentationTemplateId } from "@/types";

interface GenerateDocumentationModalProps {
  isOpen: boolean;
  onClose: () => void;
  templateId: DocumentationTemplateId;
  onSubmit: (noteText: string) => Promise<void>;
}

export function GenerateDocumentationModal({
  isOpen,
  onClose,
  templateId,
  onSubmit,
}: GenerateDocumentationModalProps) {
  const formId = useId();
  const template = getTemplateById(templateId);
  const [noteText, setNoteText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  function resetAndClose() {
    setNoteText("");
    setError(null);
    onClose();
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!noteText.trim()) {
      setError("Enter the note text before generating.");
      return;
    }
    setIsSaving(true);
    try {
      await onSubmit(noteText.trim());
      resetAndClose();
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={resetAndClose} title={`Generate Documentation — ${template.label}`}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <p className="text-xs text-accent/60">
          Example: <span className="italic">{template.help.example}</span>
        </p>
        <Textarea
          label="Documentation Note"
          id={`${formId}-note`}
          placeholder="Write the note for this step..."
          value={noteText}
          onChange={(event) => setNoteText(event.target.value)}
          error={error ?? undefined}
          rows={4}
          required
        />
        <p className="text-xs text-accent/50">
          For a fully guided note with all of {template.label}&apos;s fields, use Clinical Documentation
          directly — this quick note is enough to satisfy this workflow&apos;s Completion Gate.
        </p>
        <div className="mt-2 flex justify-end gap-3">
          <Button type="button" variant="tertiary" onClick={resetAndClose}>
            Cancel
          </Button>
          <Button type="submit" aria-busy={isSaving} disabled={isSaving}>
            {isSaving ? "Generating…" : "Generate Documentation"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
