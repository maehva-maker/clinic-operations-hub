"use client";

// hooks/use-documentation-history.ts
// Backs the Documentation History page: fetches all saved entries and
// exposes the search/category/template/patient filters from
// DocumentationHistoryFilters. Filtering itself is a pure function in the
// service layer, reused as-is.

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  filterDocumentationHistory,
  getDocumentationHistory,
} from "@/services/documentation.service";
import type { DocumentationEntry, DocumentationHistoryFilters } from "@/types";

const DEFAULT_FILTERS: DocumentationHistoryFilters = {
  search: "",
  category: "all",
  templateId: "all",
  patientName: "",
  date: "",
};

interface UseDocumentationHistoryResult {
  entries: DocumentationEntry[];
  isLoading: boolean;
  filters: DocumentationHistoryFilters;
  setFilters: (patch: Partial<DocumentationHistoryFilters>) => void;
  refresh: () => Promise<void>;
}

export function useDocumentationHistory(): UseDocumentationHistoryResult {
  const [allEntries, setAllEntries] = useState<DocumentationEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFiltersState] = useState<DocumentationHistoryFilters>(DEFAULT_FILTERS);

  const load = useCallback(async () => {
    setIsLoading(true);
    const result = await getDocumentationHistory();
    setAllEntries(result);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const setFilters = useCallback((patch: Partial<DocumentationHistoryFilters>) => {
    setFiltersState((prev) => ({ ...prev, ...patch }));
  }, []);

  const entries = useMemo(
    () => filterDocumentationHistory(allEntries, filters),
    [allEntries, filters],
  );

  return { entries, isLoading, filters, setFilters, refresh: load };
}
