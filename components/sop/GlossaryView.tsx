"use client";

// components/sop/GlossaryView.tsx
// Page 4 — Medical Glossary. Search reuses the same useSearch hook as SOP
// Home, and each term links back to the workflow(s) it comes up in via the
// shared RelatedWorkflowsList.

import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { SearchBar } from "@/components/shared/SearchBar";
import { OpenLoopEmptyState } from "@/components/open-loops/OpenLoopEmptyState";
import { RelatedWorkflowsList } from "@/components/sop/RelatedWorkflowsList";
import { useSearch } from "@/hooks/use-search";
import { getGlossaryTerms } from "@/services/sop.service";

export function GlossaryView() {
  const [search, setSearch] = useState("");
  const terms = getGlossaryTerms();
  const filteredTerms = useSearch(terms, search, (term) => [term.term, term.definition]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Medical Glossary"
        description="Clinic terms and abbreviations you'll hear every day, with links to where they come up."
      />

      <SearchBar placeholder="Search terms..." value={search} onChange={setSearch} />

      {filteredTerms.length === 0 ? (
        <OpenLoopEmptyState message="No glossary terms match that search." />
      ) : (
        <dl className="flex flex-col gap-3">
          {filteredTerms.map((term) => (
            <div key={term.id} className="rounded-card border border-surface-border bg-white p-5 shadow-card">
              <dt className="text-base font-semibold text-accent">{term.term}</dt>
              <dd className="mt-1 text-sm text-accent/80">{term.definition}</dd>
              {term.relatedWorkflowIds.length > 0 ? (
                <div className="mt-3">
                  <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-accent/40">
                    Related Workflows
                  </span>
                  <RelatedWorkflowsList workflowIds={term.relatedWorkflowIds} />
                </div>
              ) : null}
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}
