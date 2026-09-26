"use client";

// components/open-loops/QuickActionModal.tsx
// Shared modal for the four Quick Actions that simply append a documentation
// entry to the Activity Timeline: Add Documentation, Log Call, Upload Fax,
// Send Email Record. Phase 10: the "attachment" field is a real file picker
// — the chosen file is uploaded to the private `attachments` Storage bucket
// before the activity is saved, and only the resulting storage path (never
// the file itself) is stored on the Activity row. There is no fax/email
// sending backend; this only persists the attachment the HVA already has.

import { useId, useState, type ChangeEvent, type FormEvent } from "react";
import { Modal } from "@/components/ui/Modal";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { uploadFile } from "@/lib/supabase/storage";
import type { ActivityActionType } from "@/types";
import type { AddActivityInput } from "@/services/open-loops.service";

interface QuickActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  actionType: ActivityActionType;
  title: string;
  noteLabel: string;
  notePlaceholder?: string;
  includeAttachment?: boolean;
  onSubmit: (input: AddActivityInput) => Promise<void>;
}

export function QuickActionModal({
  isOpen,
  onClose,
  actionType,
  title,
  noteLabel,
  notePlaceholder,
  includeAttachment = false,
  onSubmit,
}: QuickActionModalProps) {
  const formId = useId();
  const [note, setNote] = useState("");
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function resetAndClose() {
    setNote("");
    setAttachmentFile(null);
    setError(null);
    onClose();
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    setAttachmentFile(event.target.files?.[0] ?? null);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!note.trim()) {
      setError("Enter what happened before saving.");
      return;
    }

    setIsSubmitting(true);
    try {
      let attachmentPath: string | null = null;
      if (attachmentFile) {
        attachmentPath = await uploadFile("attachments", attachmentFile);
      }

      await onSubmit({
        actionType,
        note: note.trim(),
        attachmentName: attachmentFile?.name ?? null,
        attachmentPath,
      });
      resetAndClose();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Couldn't save this activity.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={resetAndClose} title={title}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Textarea
          label={noteLabel}
          id={`${formId}-note`}
          placeholder={notePlaceholder}
          value={note}
          onChange={(event) => setNote(event.target.value)}
          error={error ?? undefined}
          required
        />
        {includeAttachment ? (
          <div className="flex flex-col gap-1.5">
            <label htmlFor={`${formId}-attachment`} className="text-sm font-medium text-accent">
              Attachment (optional)
            </label>
            <input
              type="file"
              id={`${formId}-attachment`}
              onChange={handleFileChange}
              className="block w-full text-sm text-accent/80 file:mr-3 file:rounded-md file:border-0 file:bg-secondary-light file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-secondary-dark hover:file:bg-secondary/20"
            />
            {attachmentFile ? (
              <p className="text-xs text-accent/50">{attachmentFile.name}</p>
            ) : null}
          </div>
        ) : null}
        <div className="mt-2 flex justify-end gap-3">
          <Button type="button" variant="tertiary" onClick={resetAndClose}>
            Cancel
          </Button>
          <Button type="submit" aria-busy={isSubmitting} disabled={isSubmitting}>
            {isSubmitting ? "Saving…" : "Save to Timeline"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
