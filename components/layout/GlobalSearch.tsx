"use client";

// components/layout/GlobalSearch.tsx
// Phase 10 NEW FEATURE — Universal Global Search. Wraps the existing shared
// SearchBar with a grouped-results dropdown, querying
// services/search.service.ts across Patients, Open Loops, Clinic Contacts,
// and SOP/Workflow Guides. Debounced so every keystroke doesn't re-query
// every module.

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { SearchBar } from "@/components/shared/SearchBar";
import {
  isSearchableQuery,
  runGlobalSearch,
  type GlobalSearchResult,
  type GlobalSearchResults,
} from "@/services/search.service";

const EMPTY_RESULTS: GlobalSearchResults = {
  patients: [],
  openLoops: [],
  clinicContacts: [],
  sopArticles: [],
};

const GROUPS: { key: keyof GlobalSearchResults; label: string }[] = [
  { key: "patients", label: "Patients" },
  { key: "openLoops", label: "Open Loops" },
  { key: "clinicContacts", label: "Clinic Contacts" },
  { key: "sopArticles", label: "SOP & Workflow Guides" },
];

export function GlobalSearch() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GlobalSearchResults>(EMPTY_RESULTS);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isSearchableQuery(query)) {
      setResults(EMPTY_RESULTS);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timeout = setTimeout(() => {
      void runGlobalSearch(query).then((found) => {
        setResults(found);
        setIsLoading(false);
      });
    }, 200);

    return () => clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(result: GlobalSearchResult) {
    setIsOpen(false);
    setQuery("");
    router.push(result.href);
  }

  const hasAnyResults = GROUPS.some((group) => results[group.key].length > 0);
  const showDropdown = isOpen && isSearchableQuery(query);

  return (
    <div ref={containerRef} className="relative w-full">
      <SearchBar
        value={query}
        onChange={(value) => {
          setQuery(value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
      />

      {showDropdown ? (
        <div className="absolute left-0 right-0 top-full z-40 mt-2 max-h-96 overflow-y-auto rounded-lg border border-surface-border bg-white p-2 shadow-xl">
          {isLoading ? (
            <p className="px-2 py-3 text-sm text-accent/50">Searching…</p>
          ) : hasAnyResults ? (
            GROUPS.map((group) => {
              const groupResults = results[group.key];
              if (groupResults.length === 0) return null;
              return (
                <div key={group.key} className="mb-1 last:mb-0">
                  <p className="px-2 py-1 text-xs font-semibold uppercase tracking-wide text-accent/40">
                    {group.label}
                  </p>
                  {groupResults.map((result) => (
                    <button
                      key={`${result.kind}-${result.id}`}
                      type="button"
                      onClick={() => handleSelect(result)}
                      className="flex w-full flex-col rounded-md px-2 py-1.5 text-left hover:bg-surface"
                    >
                      <span className="text-sm font-medium text-accent">{result.title}</span>
                      <span className="text-xs text-accent/50">{result.subtitle}</span>
                    </button>
                  ))}
                </div>
              );
            })
          ) : (
            <p className="px-2 py-3 text-sm text-accent/50">No results for &ldquo;{query}&rdquo;.</p>
          )}
        </div>
      ) : null}
    </div>
  );
}
