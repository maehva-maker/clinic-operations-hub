// components/documentation/DynamicField.tsx
// Renders one DocFieldDef using the shared Input/Textarea/Select/Checkbox
// primitives — the "Dynamic Template Engine" on the form side: a template
// only ever contributes data (field definitions), never its own markup.

import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/Checkbox";
import type { DocFieldDef } from "@/types";

interface DynamicFieldProps {
  field: DocFieldDef;
  value: string;
  onChange: (value: string) => void;
  isMissing: boolean;
}

export function DynamicField({ field, value, onChange, isMissing }: DynamicFieldProps) {
  const label = field.required ? `${field.label} *` : field.label;

  if (field.type === "checkbox") {
    return (
      <Checkbox
        label={field.label}
        checked={value === "true"}
        onChange={(event) => onChange(event.target.checked ? "true" : "false")}
      />
    );
  }

  if (field.type === "select") {
    return (
      <Select
        label={label}
        options={[{ value: "", label: "Select…" }, ...(field.options ?? [])]}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        error={isMissing ? `${field.label} is required.` : undefined}
      />
    );
  }

  if (field.type === "textarea") {
    return (
      <Textarea
        label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={field.placeholder}
        error={isMissing ? `${field.label} is required.` : undefined}
      />
    );
  }

  return (
    <Input
      label={label}
      type={field.type === "date" || field.type === "time" ? field.type : "text"}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={field.placeholder}
      error={isMissing ? `${field.label} is required.` : undefined}
    />
  );
}
