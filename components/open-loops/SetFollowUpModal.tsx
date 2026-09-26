"use client";

// components/open-loops/SetFollowUpModal.tsx
// Quick Action: Set Follow-up Date. Pairs a due date with an optional
// Waiting Rule target (who/what the loop is waiting on) so the tracker can
// answer "what am I blocked on?" without opening the timeline.

import { useId, useState, type FormEvent } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { WAITING_ON_LABEL } from "@/types";
import type { WaitingOnType } from "@/types";

const WAITING_ON_OPTIONS = [
  { value: "", label: "Not waiting on anyone" },
  ...(Object.keys(WAITING_ON_LABEL) as WaitingOnType[]).map((value) => ({
    value,
    label: WAITING_ON_LABEL[value],
  })),
];

interface SetFollowUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDueDate: string | null;
  currentWaitingOn: WaitingOnType | null;
  onSubmit: (dueDate: string, waitingOn: WaitingOnType | null) => Promise<void>;
}

export function SetFollowUpModal({
  isOpen,
  onClose,
  currentDueDate,
  currentWaitingOn,
  onSubmit,
}: SetFollowUpModalProps) {
  const formId = useId();
  const [dueDate, setDueDate] = useState(currentDueDate ?? "");
  const [waitingOn, setWaitingOn] = useState<string>(currentWaitingOn ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function resetAndClose() {
    setDueDate(currentDueDate ?? "");
    setWaitingOn(currentWaitingOn ?? "");
    setError(null);
    onClose();
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!dueDate) {
      setError("Choose a follow-up date.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(dueDate, (waitingOn as WaitingOnType) || null);
      resetAndClose();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={resetAndClose} title="Set Follow-up Date">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Follow-up Date"
          id={`${formId}-due-date`}
          type="date"
          value={dueDate}
          onChange={(event) => setDueDate(event.target.value)}
          error={error ?? undefined}
          required
        />
        <Select
          label="Waiting On"
          id={`${formId}-waiting-on`}
          options={WAITING_ON_OPTIONS}
          value={waitingOn}
          onChange={(event) => setWaitingOn(event.target.value)}
        />
        <div className="mt-2 flex justify-end gap-3">
          <Button type="button" variant="tertiary" onClick={resetAndClose}>
            Cancel
          </Button>
          <Button type="submit" aria-busy={isSubmitting} disabled={isSubmitting}>
            {isSubmitting ? "Saving…" : "Save Follow-up"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
