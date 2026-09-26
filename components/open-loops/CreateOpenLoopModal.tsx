"use client";

// components/open-loops/CreateOpenLoopModal.tsx
// "Create New Open Loop" form. Category options are scoped to the domain
// selected inside the form (defaulting to the tracker's active domain) so a
// Weight Management loop can never be filed under a Sleep Medicine category.

import { useId, useState, type FormEvent } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { categoriesForDomain, CATEGORY_LABEL } from "@/lib/constants/workflow-categories";
import { PROVIDERS } from "@/lib/constants/providers";
import { DOMAIN_LABEL, TASK_PRIORITY_LABEL } from "@/types";
import type { CreateOpenLoopInput } from "@/services/open-loops.service";
import type { OpenLoopCategory, TaskPriority, WorkflowDomain } from "@/types";

const DOMAIN_OPTIONS = (Object.keys(DOMAIN_LABEL) as WorkflowDomain[]).map((value) => ({
  value,
  label: DOMAIN_LABEL[value],
}));

const PRIORITY_OPTIONS = (Object.keys(TASK_PRIORITY_LABEL) as TaskPriority[]).map((value) => ({
  value,
  label: TASK_PRIORITY_LABEL[value],
}));

const PROVIDER_OPTIONS = PROVIDERS.map((value) => ({ value, label: value }));

interface CreateOpenLoopModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDomain: WorkflowDomain;
  onCreate: (input: CreateOpenLoopInput) => Promise<unknown>;
}

interface FormState {
  patientName: string;
  patientDob: string;
  domain: WorkflowDomain;
  category: OpenLoopCategory;
  title: string;
  description: string;
  priority: TaskPriority;
  provider: string;
  dueDate: string;
}

function buildInitialState(domain: WorkflowDomain): FormState {
  return {
    patientName: "",
    patientDob: "",
    domain,
    category: categoriesForDomain(domain)[0]!,
    title: "",
    description: "",
    priority: "normal",
    provider: PROVIDERS[0],
    dueDate: "",
  };
}

export function CreateOpenLoopModal({
  isOpen,
  onClose,
  defaultDomain,
  onCreate,
}: CreateOpenLoopModalProps) {
  const formId = useId();
  const [form, setForm] = useState<FormState>(() => buildInitialState(defaultDomain));
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function resetAndClose() {
    setForm(buildInitialState(defaultDomain));
    setErrors({});
    onClose();
  }

  function handleDomainChange(domain: WorkflowDomain) {
    setForm((prev) => ({ ...prev, domain, category: categoriesForDomain(domain)[0]! }));
  }

  function validate(): boolean {
    const nextErrors: Partial<Record<keyof FormState, string>> = {};
    if (!form.patientName.trim()) nextErrors.patientName = "Patient name is required.";
    if (!form.patientDob.trim()) nextErrors.patientDob = "Date of birth is required.";
    if (!form.title.trim()) nextErrors.title = "Give this loop a short title.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onCreate({
        patientName: form.patientName.trim(),
        patientDob: form.patientDob,
        domain: form.domain,
        category: form.category,
        title: form.title.trim(),
        description: form.description.trim(),
        priority: form.priority,
        provider: form.provider,
        dueDate: form.dueDate || null,
      });
      resetAndClose();
    } finally {
      setIsSubmitting(false);
    }
  }

  const categoryOptions = categoriesForDomain(form.domain).map((value) => ({
    value,
    label: CATEGORY_LABEL[value],
  }));

  return (
    <Modal isOpen={isOpen} onClose={resetAndClose} title="Create New Open Loop">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Patient Name"
          id={`${formId}-patient-name`}
          value={form.patientName}
          onChange={(event) => setForm((prev) => ({ ...prev, patientName: event.target.value }))}
          error={errors.patientName}
          required
        />
        <Input
          label="Date of Birth"
          id={`${formId}-patient-dob`}
          type="date"
          value={form.patientDob}
          onChange={(event) => setForm((prev) => ({ ...prev, patientDob: event.target.value }))}
          error={errors.patientDob}
          required
        />

        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Domain"
            id={`${formId}-domain`}
            options={DOMAIN_OPTIONS}
            value={form.domain}
            onChange={(event) => handleDomainChange(event.target.value as WorkflowDomain)}
          />
          <Select
            label="Category"
            id={`${formId}-category`}
            options={categoryOptions}
            value={form.category}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, category: event.target.value as OpenLoopCategory }))
            }
          />
        </div>

        <Input
          label="Title"
          id={`${formId}-title`}
          placeholder="e.g. Schedule 30-day follow-up sleep study"
          value={form.title}
          onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
          error={errors.title}
          required
        />

        <Textarea
          label="Description"
          id={`${formId}-description`}
          placeholder="What needs to happen for this loop to close?"
          value={form.description}
          onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
        />

        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Priority"
            id={`${formId}-priority`}
            options={PRIORITY_OPTIONS}
            value={form.priority}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, priority: event.target.value as TaskPriority }))
            }
          />
          <Select
            label="Provider"
            id={`${formId}-provider`}
            options={PROVIDER_OPTIONS}
            value={form.provider}
            onChange={(event) => setForm((prev) => ({ ...prev, provider: event.target.value }))}
          />
        </div>

        <Input
          label="Due Date (optional)"
          id={`${formId}-due-date`}
          type="date"
          value={form.dueDate}
          onChange={(event) => setForm((prev) => ({ ...prev, dueDate: event.target.value }))}
        />

        <div className="mt-2 flex justify-end gap-3">
          <Button type="button" variant="tertiary" onClick={resetAndClose}>
            Cancel
          </Button>
          <Button type="submit" aria-busy={isSubmitting} disabled={isSubmitting}>
            {isSubmitting ? "Creating…" : "Create Open Loop"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
