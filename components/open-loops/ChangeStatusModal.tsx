"use client";

// components/open-loops/ChangeStatusModal.tsx
// Quick Action: Change Status. Requires an explicit choice — a loop never
// closes itself just because time passed — and logs an optional reason as
// part of the status_change activity entry.

import { useId, useState, type FormEvent } from "react";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { LOOP_STATUS_LABEL } from "@/types";
import type { LoopStatus } from "@/types";

const STATUS_OPTIONS = (Object.keys(LOOP_STATUS_LABEL) as LoopStatus[]).map((value) => ({
  value,
  label: LOOP_STATUS_LABEL[value],
}));

interface ChangeStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStatus: LoopStatus;
  onSubmit: (status: LoopStatus, reason?: string) => Promise<void>;
}

export function ChangeStatusModal({
  isOpen,
  onClose,
  currentStatus,
  onSubmit,
}: ChangeStatusModalProps) {
  const formId = useId();
  const [status, setStatus] = useState<LoopStatus>(currentStatus);
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function resetAndClose() {
    setStatus(currentStatus);
    setReason("");
    onClose();
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(status, reason.trim() || undefined);
      resetAndClose();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={resetAndClose} title="Change Status">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Select
          label="New Status"
          id={`${formId}-status`}
          options={STATUS_OPTIONS}
          value={status}
          onChange={(event) => setStatus(event.target.value as LoopStatus)}
        />
        <Textarea
          label="Reason (optional)"
          id={`${formId}-reason`}
          placeholder="Why is the status changing?"
          value={reason}
          onChange={(event) => setReason(event.target.value)}
        />
        <div className="mt-2 flex justify-end gap-3">
          <Button type="button" variant="tertiary" onClick={resetAndClose}>
            Cancel
          </Button>
          <Button type="submit" aria-busy={isSubmitting} disabled={isSubmitting}>
            {isSubmitting ? "Saving…" : "Update Status"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
