"use client";

// components/open-loops/OpenLoopTrackerView.tsx
// Page 1 — Open Loop Tracker. The client-side orchestrator: domain tabs,
// filters, the List/Board toggle, and the result set, plus the Open Loop
// Detail drawer (Page 2), whose open/closed state lives in the URL as
// ?loop=<id> so the drawer is deep-linkable and survives a refresh without
// ever being a separate route. Requires a <Suspense> boundary in page.tsx
// because it reads useSearchParams().

import { useCallback, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { DomainTabs } from "@/components/open-loops/DomainTabs";
import { OpenLoopFilterBar } from "@/components/open-loops/OpenLoopFilterBar";
import { OpenLoopStatusSummary } from "@/components/open-loops/OpenLoopStatusSummary";
import { OpenLoopEmptyState } from "@/components/open-loops/OpenLoopEmptyState";
import { OpenLoopBoard } from "@/components/open-loops/OpenLoopBoard";
import { OpenLoopTable } from "@/components/open-loops/OpenLoopTable";
import { CreateOpenLoopModal } from "@/components/open-loops/CreateOpenLoopModal";
import { OpenLoopDetailDrawer } from "@/components/open-loops/OpenLoopDetailDrawer";
import type { OpenLoopView } from "@/components/open-loops/ViewToggle";
import { useOpenLoops } from "@/hooks/use-open-loops";
import type { OpenLoopFilters, WorkflowDomain } from "@/types";

function isWorkflowDomain(value: string | null): value is WorkflowDomain {
  return value === "sleep_medicine" || value === "weight_management";
}

export function OpenLoopTrackerView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeLoopId = searchParams.get("loop");

  // Deep-linked from the Patient Directory/Profile's "View Open Loops"
  // quick action (?search=<patient name>&domain=<program>). Read once on
  // mount via useState's lazy initializer — the tracker's own filter bar
  // owns the state after that.
  const [initialFilters] = useState<Partial<OpenLoopFilters>>(() => {
    const search = searchParams.get("search");
    const domain = searchParams.get("domain");
    return {
      ...(search ? { search } : {}),
      ...(isWorkflowDomain(domain) ? { domain } : {}),
    };
  });

  const { loops, statusCounts, isLoading, error, filters, setFilters, addOpenLoop } =
    useOpenLoops(initialFilters);
  const [view, setView] = useState<OpenLoopView>("board");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const openDrawer = useCallback(
    (id: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("loop", id);
      router.push(`/open-loops?${params.toString()}`);
    },
    [router, searchParams],
  );

  const closeDrawer = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("loop");
    const query = params.toString();
    router.push(query ? `/open-loops?${query}` : "/open-loops");
  }, [router, searchParams]);

  function handleDomainChange(domain: WorkflowDomain) {
    setFilters({ domain, category: "all" });
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Open Loop Tracker"
        description="Every unresolved workflow, from open to close — not a to-do list."
        action={
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            Create New Open Loop
          </Button>
        }
      />

      <DomainTabs value={filters.domain} onChange={handleDomainChange} />

      <OpenLoopStatusSummary counts={statusCounts} />

      <OpenLoopFilterBar filters={filters} onChange={setFilters} view={view} onViewChange={setView} />

      {error ? (
        <div className="rounded-card border border-critical bg-critical-light p-4 text-sm text-critical">
          {error}
        </div>
      ) : isLoading ? (
        <p className="text-sm text-accent/50">Loading open loops…</p>
      ) : loops.length === 0 ? (
        <OpenLoopEmptyState message="No open loops match these filters." />
      ) : view === "board" ? (
        <OpenLoopBoard loops={loops} onSelectLoop={openDrawer} />
      ) : (
        <OpenLoopTable loops={loops} onSelectLoop={openDrawer} />
      )}

      <CreateOpenLoopModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        defaultDomain={filters.domain}
        onCreate={addOpenLoop}
      />

      <OpenLoopDetailDrawer loopId={activeLoopId} onClose={closeDrawer} />
    </div>
  );
}
