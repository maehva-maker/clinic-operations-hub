"use client";

// components/documentation/DocumentationHistoryFilterBar.tsx
// Search + the 4 lookups named in the Phase 5 brief: Patient, Date,
// Template, Category. Search covers patient name, template label, and note
// text together; Patient/Date narrow further when useful on their own.

import { SearchBar } from "@/components/shared/SearchBar";
import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import {
  DOCUMENTATION_CATEGORY_LABEL,
  DOCUMENTATION_CATEGORY_ORDER,
  DOCUMENTATION_TEMPLATES,
  templatesForCategory,
} from "@/lib/constants/documentation-templates";
import type { DocumentationHistoryFilters } from "@/types";

interface DocumentationHistoryFilterBarProps {
  filters: DocumentationHistoryFilters;
  onChange: (patch: Partial<DocumentationHistoryFilters>) => void;
}

export function DocumentationHistoryFilterBar({ filters, onChange }: DocumentationHistoryFilterBarProps) {
  const categoryOptions = [
    { value: "all", label: "All categories" },
    ...DOCUMENTATION_CATEGORY_ORDER.map((category) => ({
      value: category,
      label: DOCUMENTATION_CATEGORY_LABEL[category],
    })),
  ];

  const templateOptions = [
    { value: "all", label: "All templates" },
    ...(filters.category === "all" ? DOCUMENTATION_TEMPLATES : templatesForCategory(filters.category)).map(
      (template) => ({ value: template.id, label: template.label }),
    ),
  ];

  return (
    <div className="flex flex-col gap-3">
      <SearchBar
        placeholder="Search patient, template, or note text..."
        value={filters.search}
        onChange={(value) => onChange({ search: value })}
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Input
          label="Patient"
          hideLabel
          placeholder="Filter by patient"
          value={filters.patientName}
          onChange={(event) => onChange({ patientName: event.target.value })}
        />
        <Input
          label="Date"
          hideLabel
          type="date"
          value={filters.date}
          onChange={(event) => onChange({ date: event.target.value })}
        />
        <Select
          label="Category"
          hideLabel
          options={categoryOptions}
          value={filters.category}
          onChange={(event) =>
            onChange({
              category: event.target.value as DocumentationHistoryFilters["category"],
              templateId: "all",
            })
          }
        />
        <Select
          label="Template"
          hideLabel
          options={templateOptions}
          value={filters.templateId}
          onChange={(event) =>
            onChange({ templateId: event.target.value as DocumentationHistoryFilters["templateId"] })
          }
        />
      </div>
    </div>
  );
}
