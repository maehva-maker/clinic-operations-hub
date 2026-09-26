"use client";

// hooks/use-open-loops.ts
// Orchestrates the Open Loop Tracker's list: fetch, filter state, derived
// status counts, and create. All actual data logic lives in
// services/open-loops.service.ts — this hook only wires that service to
// React state.

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  createOpenLoop,
  filterOpenLoops,
  getOpenLoops,
  getStatusCounts,
  type CreateOpenLoopInput,
} from "@/services/open-loops.service";
import type { LoopStatus, OpenLoop, OpenLoopFilters } from "@/types";

const DEFAULT_FILTERS: OpenLoopFilters = {
  domain: "sleep_medicine",
  category: "all",
  status: "all",
  priority: "all",
  provider: "all",
  dueDate: "all",
  search: "",
};

interface UseOpenLoopsResult {
  loops: OpenLoop[];
  statusCounts: Record<LoopStatus, number>;
  isLoading: boolean;
  error: string | null;
  filters: OpenLoopFilters;
  setFilters: (patch: Partial<OpenLoopFilters>) => void;
  addOpenLoop: (input: CreateOpenLoopInput) => Promise<OpenLoop>;
  refresh: () => Promise<void>;
}

/**
 * `initialFilters` lets another module (e.g. the Patient Directory's "View
 * Open Loops" quick action, via `?search=` / `?domain=`) land the tracker
 * pre-filtered to that patient instead of always starting from the default.
 */
export function useOpenLoops(initialFilters?: Partial<OpenLoopFilters>): UseOpenLoopsResult {
  const [loops, setLoops] = useState<OpenLoop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFiltersState] = useState<OpenLoopFilters>(() => ({
    ...DEFAULT_FILTERS,
    ...initialFilters,
  }));

  const load = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await getOpenLoops();
      setLoops(result);
      setError(null);
    } catch {
      setError("Couldn't load open loops. Try refreshing the page.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const setFilters = useCallback((patch: Partial<OpenLoopFilters>) => {
    setFiltersState((prev) => ({ ...prev, ...patch }));
  }, []);

  const filteredLoops = useMemo(() => filterOpenLoops(loops, filters), [loops, filters]);

  const domainScopedLoops = useMemo(
    () => filterOpenLoops(loops, { ...filters, status: "all" }),
    [loops, filters],
  );

  const statusCounts = useMemo(
    () => getStatusCounts(domainScopedLoops),
    [domainScopedLoops],
  );

  const addOpenLoop = useCallback(
    async (input: CreateOpenLoopInput) => {
      const created = await createOpenLoop(input);
      await load();
      return created;
    },
    [load],
  );

  return {
    loops: filteredLoops,
    statusCounts,
    isLoading,
    error,
    filters,
    setFilters,
    addOpenLoop,
    refresh: load,
  };
}
