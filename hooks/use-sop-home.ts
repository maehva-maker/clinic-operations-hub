"use client";

// hooks/use-sop-home.ts
// Backs the SOP Home page: the global search (via the reusable useSearch
// hook) across all three content types, plus favorites and recently viewed.

import { useMemo, useState } from "react";
import { useSearch } from "@/hooks/use-search";
import { useFavorites } from "@/hooks/use-favorites";
import { useRecentlyViewed } from "@/hooks/use-recently-viewed";
import { getAllSoftwareGuides, getAllWorkflowGuideArticles, getGlossaryTerms } from "@/services/sop.service";

export function useSopHome() {
  const [search, setSearch] = useState("");

  const workflowGuides = useMemo(() => getAllWorkflowGuideArticles(), []);
  const softwareGuides = useMemo(() => getAllSoftwareGuides(), []);
  const glossaryTerms = useMemo(() => getGlossaryTerms(), []);

  const filteredWorkflowGuides = useSearch(workflowGuides, search, (article) => [
    article.title,
    article.purpose,
    article.whenToUse,
  ]);
  const filteredSoftwareGuides = useSearch(softwareGuides, search, (guide) => [
    guide.title,
    guide.whatIsIt,
    guide.whenToUseIt,
  ]);
  const filteredGlossaryTerms = useSearch(glossaryTerms, search, (term) => [term.term, term.definition]);

  const { favorites, isFavorite, toggleFavorite } = useFavorites();
  const { recentlyViewed } = useRecentlyViewed();

  const isSearching = search.trim().length > 0;

  return {
    search,
    setSearch,
    isSearching,
    filteredWorkflowGuides,
    filteredSoftwareGuides,
    filteredGlossaryTerms,
    workflowGuides,
    softwareGuides,
    favorites,
    isFavorite,
    toggleFavorite,
    recentlyViewed,
  };
}
