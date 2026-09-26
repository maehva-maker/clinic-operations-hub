"use client";

// components/documentation/TemplateSidebar.tsx
// Left panel of the Clinical Documentation workspace: search + category
// grouping over all 19 templates. A plain nav list, not a form control, so
// it's a <nav> of buttons rather than a Select.

import { SearchBar } from "@/components/shared/SearchBar";
import { cn } from "@/lib/utils/cn";
import {
  DOCUMENTATION_CATEGORY_LABEL,
  DOCUMENTATION_CATEGORY_ORDER,
} from "@/lib/constants/documentation-templates";
import type { DocumentationCategory, DocumentationTemplate, DocumentationTemplateId } from "@/types";

interface TemplateSidebarProps {
  templates: DocumentationTemplate[];
  selectedTemplateId: DocumentationTemplateId;
  onSelectTemplate: (id: DocumentationTemplateId) => void;
  categoryFilter: DocumentationCategory | "all";
  onCategoryFilterChange: (category: DocumentationCategory | "all") => void;
  search: string;
  onSearchChange: (value: string) => void;
}

export function TemplateSidebar({
  templates,
  selectedTemplateId,
  onSelectTemplate,
  categoryFilter,
  onCategoryFilterChange,
  search,
  onSearchChange,
}: TemplateSidebarProps) {
  return (
    <div className="flex flex-col gap-4">
      <SearchBar
        placeholder="Search templates..."
        value={search}
        onChange={onSearchChange}
      />

      <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by category">
        <button
          type="button"
          onClick={() => onCategoryFilterChange("all")}
          className={cn(
            "rounded-pill px-3 py-1 text-xs font-semibold transition-colors",
            categoryFilter === "all"
              ? "bg-primary text-white"
              : "bg-surface text-accent/60 hover:bg-surface-border/60",
          )}
        >
          All
        </button>
        {DOCUMENTATION_CATEGORY_ORDER.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => onCategoryFilterChange(category)}
            className={cn(
              "rounded-pill px-3 py-1 text-xs font-semibold transition-colors",
              categoryFilter === category
                ? "bg-primary text-white"
                : "bg-surface text-accent/60 hover:bg-surface-border/60",
            )}
          >
            {DOCUMENTATION_CATEGORY_LABEL[category]}
          </button>
        ))}
      </div>

      <nav aria-label="Documentation templates" className="flex flex-col gap-4">
        {DOCUMENTATION_CATEGORY_ORDER.filter(
          (category) => categoryFilter === "all" || categoryFilter === category,
        ).map((category) => {
          const categoryTemplates = templates.filter((template) => template.category === category);
          if (categoryTemplates.length === 0) return null;

          return (
            <div key={category} className="flex flex-col gap-1">
              <h3 className="px-2 text-xs font-semibold uppercase tracking-wide text-accent/40">
                {DOCUMENTATION_CATEGORY_LABEL[category]}
              </h3>
              {categoryTemplates.map((template) => {
                const isActive = template.id === selectedTemplateId;
                return (
                  <button
                    key={template.id}
                    type="button"
                    aria-current={isActive ? "true" : undefined}
                    onClick={() => onSelectTemplate(template.id)}
                    className={cn(
                      "rounded-lg px-2 py-2 text-left text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40",
                      isActive
                        ? "bg-primary-light text-primary-dark"
                        : "text-accent/70 hover:bg-surface",
                    )}
                  >
                    {template.label}
                  </button>
                );
              })}
            </div>
          );
        })}
      </nav>
    </div>
  );
}
