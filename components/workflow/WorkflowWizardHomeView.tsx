"use client";

// components/workflow/WorkflowWizardHomeView.tsx
// Page 1 — Workflow Wizard Home: the Decision Helper, the two domain
// sections of workflow cards (filterable by search), and recent runs.

import { PageHeader } from "@/components/layout/PageHeader";
import { SearchBar } from "@/components/shared/SearchBar";
import { DecisionHelperPanel } from "@/components/workflow/DecisionHelperPanel";
import { WorkflowCategoryCard } from "@/components/workflow/WorkflowCategoryCard";
import { RecentWorkflowRuns } from "@/components/workflow/RecentWorkflowRuns";
import { OpenLoopEmptyState } from "@/components/open-loops/OpenLoopEmptyState";
import { useWorkflowHome } from "@/hooks/use-workflow-home";
import { DOMAIN_LABEL } from "@/types";
import type { WorkflowDomain } from "@/types";

const DOMAINS: WorkflowDomain[] = ["sleep_medicine", "weight_management"];

export function WorkflowWizardHomeView() {
  const { search, setSearch, filteredDefinitions, recentRuns, isLoadingRuns } = useWorkflowHome();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Workflow Wizard"
        description="Step-by-step guidance for every Sleep Medicine and Weight Management workflow — not just a reference, an active guide."
      />

      <DecisionHelperPanel />

      <SearchBar
        placeholder="Search workflows..."
        value={search}
        onChange={setSearch}
      />

      {filteredDefinitions.length === 0 ? (
        <OpenLoopEmptyState message="No workflows match that search." />
      ) : (
        DOMAINS.map((domain) => {
          const domainDefinitions = filteredDefinitions.filter((definition) => definition.domain === domain);
          if (domainDefinitions.length === 0) return null;

          return (
            <section key={domain} aria-labelledby={`${domain}-heading`} className="flex flex-col gap-3">
              <h2 id={`${domain}-heading`} className="text-lg font-semibold text-accent">
                {DOMAIN_LABEL[domain]}
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {domainDefinitions.map((definition) => (
                  <WorkflowCategoryCard key={definition.id} definition={definition} />
                ))}
              </div>
            </section>
          );
        })
      )}

      <section aria-labelledby="recent-runs-heading" className="rounded-card border border-surface-border bg-white p-5 shadow-card">
        <h2 id="recent-runs-heading" className="mb-3 text-base font-semibold text-accent">
          Recent Workflow Runs
        </h2>
        {isLoadingRuns ? (
          <p className="text-sm text-accent/50">Loading recent runs…</p>
        ) : (
          <RecentWorkflowRuns runs={recentRuns} />
        )}
      </section>
    </div>
  );
}
