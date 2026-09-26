"use client";

// components/open-loops/OpenLoopFilterBar.tsx
// Search + the 5 filters named in the Phase 4 brief (Category, Status,
// Priority, Provider, Due Date), plus the List/Board view toggle. Domain is
// handled separately by DomainTabs since it scopes the page more broadly
// than these secondary filters.

import { SearchBar } from "@/components/shared/SearchBar";
import { Select } from "@/components/ui/Select";
import { ViewToggle, type OpenLoopView } from "@/components/open-loops/ViewToggle";
import { CATEGORY_LABEL, categoriesForDomain } from "@/lib/constants/workflow-categories";
import { PROVIDERS } from "@/lib/constants/providers";
import { LOOP_STATUS_LABEL, TASK_PRIORITY_LABEL } from "@/types";
import type { DueDateFilter, LoopStatus, OpenLoopFilters, TaskPriority } from "@/types";

interface OpenLoopFilterBarProps {
  filters: OpenLoopFilters;
  onChange: (patch: Partial<OpenLoopFilters>) => void;
  view: OpenLoopView;
  onViewChange: (view: OpenLoopView) => void;
}

const DUE_DATE_OPTIONS: { value: DueDateFilter; label: string }[] = [
  { value: "all", label: "Any due date" },
  { value: "overdue", label: "Overdue" },
  { value: "today", label: "Due today" },
  { value: "this_week", label: "Due this week" },
  { value: "none", label: "No due date" },
];

export function OpenLoopFilterBar({ filters, onChange, view, onViewChange }: OpenLoopFilterBarProps) {
  const categoryOptions = [
    { value: "all", label: "All categories" },
    ...categoriesForDomain(filters.domain).map((category) => ({
      value: category,
      label: CATEGORY_LABEL[category],
    })),
  ];

  const statusOptions = [
    { value: "all", label: "All statuses" },
    ...(Object.keys(LOOP_STATUS_LABEL) as LoopStatus[]).map((status) => ({
      value: status,
      label: LOOP_STATUS_LABEL[status],
    })),
  ];

  const priorityOptions = [
    { value: "all", label: "All priorities" },
    ...(Object.keys(TASK_PRIORITY_LABEL) as TaskPriority[]).map((priority) => ({
      value: priority,
      label: TASK_PRIORITY_LABEL[priority],
    })),
  ];

  const providerOptions = [
    { value: "all", label: "All providers" },
    ...PROVIDERS.map((provider) => ({ value: provider, label: provider })),
  ];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex-1">
          <SearchBar
            placeholder="Search patient or workflow..."
            value={filters.search}
            onChange={(value) => onChange({ search: value })}
          />
        </div>
        <ViewToggle value={view} onChange={onViewChange} />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <Select
          label="Category"
          hideLabel
          options={categoryOptions}
          value={filters.category}
          onChange={(event) =>
            onChange({ category: event.target.value as OpenLoopFilters["category"] })
          }
        />
        <Select
          label="Status"
          hideLabel
          options={statusOptions}
          value={filters.status}
          onChange={(event) =>
            onChange({ status: event.target.value as OpenLoopFilters["status"] })
          }
        />
        <Select
          label="Priority"
          hideLabel
          options={priorityOptions}
          value={filters.priority}
          onChange={(event) =>
            onChange({ priority: event.target.value as OpenLoopFilters["priority"] })
          }
        />
        <Select
          label="Provider"
          hideLabel
          options={providerOptions}
          value={filters.provider}
          onChange={(event) => onChange({ provider: event.target.value })}
        />
        <Select
          label="Due date"
          hideLabel
          options={DUE_DATE_OPTIONS}
          value={filters.dueDate}
          onChange={(event) => onChange({ dueDate: event.target.value as DueDateFilter })}
        />
      </div>
    </div>
  );
}
