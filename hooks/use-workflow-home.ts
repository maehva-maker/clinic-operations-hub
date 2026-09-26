"use client";

// hooks/use-workflow-home.ts
// Backs the Workflow Wizard Home: search over all 12 workflow definitions
// (grouped by domain in the view) and the "recent runs" list used to surface
// in-progress/completed examples for resuming.

import { useCallback, useEffect, useMemo, useState } from "react";
import { WORKFLOW_DEFINITIONS } from "@/lib/constants/workflow-definitions";
import { getWorkflowRuns } from "@/services/workflow.service";
import type { WorkflowDefinition, WorkflowRun } from "@/types";

interface UseWorkflowHomeResult {
  search: string;
  setSearch: (value: string) => void;
  filteredDefinitions: WorkflowDefinition[];
  recentRuns: WorkflowRun[];
  isLoadingRuns: boolean;
  refresh: () => Promise<void>;
}

export function useWorkflowHome(): UseWorkflowHomeResult {
  const [search, setSearch] = useState("");
  const [recentRuns, setRecentRuns] = useState<WorkflowRun[]>([]);
  const [isLoadingRuns, setIsLoadingRuns] = useState(true);

  const load = useCallback(async () => {
    setIsLoadingRuns(true);
    const runs = await getWorkflowRuns();
    setRecentRuns(runs);
    setIsLoadingRuns(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filteredDefinitions = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return WORKFLOW_DEFINITIONS;
    return WORKFLOW_DEFINITIONS.filter((definition) => definition.title.toLowerCase().includes(query));
  }, [search]);

  return { search, setSearch, filteredDefinitions, recentRuns, isLoadingRuns, refresh: load };
}
