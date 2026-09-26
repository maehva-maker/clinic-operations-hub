"use client";

// hooks/use-search.ts
// The reusable search hook built on lib/utils/search.ts: filters any list of
// items by a query, given a function that says which fields of an item are
// searchable. Used by the SOP Home's global search and the Medical
// Glossary's search so neither maintains its own filtering logic.

import { useMemo } from "react";
import { matchesSearch } from "@/lib/utils/search";

export function useSearch<T>(
  items: T[],
  query: string,
  getSearchableFields: (item: T) => (string | string[] | undefined | null)[],
): T[] {
  return useMemo(
    () => items.filter((item) => matchesSearch(query, ...getSearchableFields(item))),
    [items, query, getSearchableFields],
  );
}
