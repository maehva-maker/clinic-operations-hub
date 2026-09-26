"use client";

// components/documentation/DocumentationForm.tsx
// Center panel: the 6 universal required fields (Patient, Action, Outcome,
// Date, Time, Performer) that every template shares, followed by that
// template's own dynamic fields. Missing required fields are indicated
// inline rather than only at submit time.

import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { DynamicField } from "@/components/documentation/DynamicField";
import { PROVIDERS } from "@/lib/constants/providers";
import type { DocFieldValues, DocumentationCommonFields, DocumentationTemplate } from "@/types";

const PERFORMER_OPTIONS = [{ value: "Mae", label: "Mae (HVA)" }, ...PROVIDERS.map((p) => ({ value: p, label: p }))];

interface DocumentationFormProps {
  template: DocumentationTemplate;
  common: DocumentationCommonFields;
  onCommonChange: (patch: Partial<DocumentationCommonFields>) => void;
  fieldValues: DocFieldValues;
  onFieldChange: (key: string, value: string) => void;
  missingFieldLabels: string[];
}

export function DocumentationForm({
  template,
  common,
  onCommonChange,
  fieldValues,
  onFieldChange,
  missingFieldLabels,
}: DocumentationFormProps) {
  const isMissing = (label: string) => missingFieldLabels.includes(label);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-base font-semibold text-accent">{template.label}</h2>
        <p className="mt-0.5 text-xs text-accent/50">
          Fields marked with * are required before this note can be generated.
        </p>
      </div>

      <section aria-labelledby="required-fields-heading" className="flex flex-col gap-4">
        <h3 id="required-fields-heading" className="text-xs font-semibold uppercase tracking-wide text-accent/40">
          Required Fields
        </h3>

        <Input
          label="Patient *"
          value={common.patientName}
          onChange={(event) => onCommonChange({ patientName: event.target.value })}
          error={isMissing("Patient") ? "Patient is required." : undefined}
        />

        <Textarea
          label="Action *"
          placeholder="What did you do? e.g. Called pt re appointment"
          value={common.action}
          onChange={(event) => onCommonChange({ action: event.target.value })}
          rows={2}
          error={isMissing("Action") ? "Action is required." : undefined}
        />

        <Textarea
          label="Outcome *"
          placeholder="What was the result? e.g. Pt confirmed attendance"
          value={common.outcome}
          onChange={(event) => onCommonChange({ outcome: event.target.value })}
          rows={2}
          error={isMissing("Outcome") ? "Outcome is required." : undefined}
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Date *"
            type="date"
            value={common.date}
            onChange={(event) => onCommonChange({ date: event.target.value })}
            error={isMissing("Date") ? "Date is required." : undefined}
          />
          <Input
            label="Time *"
            type="time"
            value={common.time}
            onChange={(event) => onCommonChange({ time: event.target.value })}
            error={isMissing("Time") ? "Time is required." : undefined}
          />
        </div>

        <Select
          label="Performer *"
          options={PERFORMER_OPTIONS}
          value={common.performer}
          onChange={(event) => onCommonChange({ performer: event.target.value })}
          error={isMissing("Performer") ? "Performer is required." : undefined}
        />
      </section>

      {template.fields.length > 0 ? (
        <section aria-labelledby="template-fields-heading" className="flex flex-col gap-4">
          <h3 id="template-fields-heading" className="text-xs font-semibold uppercase tracking-wide text-accent/40">
            {template.label} Details
          </h3>
          {template.fields.map((field) => (
            <DynamicField
              key={field.key}
              field={field}
              value={fieldValues[field.key] ?? ""}
              onChange={(value) => onFieldChange(field.key, value)}
              isMissing={isMissing(field.label)}
            />
          ))}
        </section>
      ) : null}

      <section aria-labelledby="additional-note-heading">
        <h3 id="additional-note-heading" className="sr-only">
          Additional Note
        </h3>
        <Textarea
          label="Additional Note (optional)"
          placeholder="Anything else worth documenting?"
          value={common.additionalNote}
          onChange={(event) => onCommonChange({ additionalNote: event.target.value })}
        />
      </section>
    </div>
  );
}
