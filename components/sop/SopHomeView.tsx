"use client";

// components/sop/SopHomeView.tsx
// Page 1 — SOP Home. Search, Favorites, Workflow Guides, Software Guides,
// Recently Viewed, and a Medical Glossary card, plus the 3 top-level
// category cards into each sub-section. When there's an active search
// query, every section below the search bar switches to showing only
// matches instead of its normal browse view.

import Link from "next/link";
import { BookOpen, Laptop2, Type, Star, History } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { SearchBar } from "@/components/shared/SearchBar";
import { ArticleCard } from "@/components/sop/ArticleCard";
import { OpenLoopEmptyState } from "@/components/open-loops/OpenLoopEmptyState";
import { useSopHome } from "@/hooks/use-sop-home";
import type { SopReference } from "@/types";

function iconForKind(kind: SopReference["kind"]) {
  if (kind === "workflow_guide") return BookOpen;
  if (kind === "software_guide") return Laptop2;
  return Type;
}

export function SopHomeView() {
  const {
    search,
    setSearch,
    isSearching,
    filteredWorkflowGuides,
    filteredSoftwareGuides,
    filteredGlossaryTerms,
    workflowGuides,
    softwareGuides,
    favorites,
    recentlyViewed,
  } = useSopHome();

  const noSearchResults =
    isSearching &&
    filteredWorkflowGuides.length === 0 &&
    filteredSoftwareGuides.length === 0 &&
    filteredGlossaryTerms.length === 0;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="SOP & Learning Center"
        description="A personal training manual — workflows, software, and clinic terminology, taught step by step."
      />

      <SearchBar
        placeholder="Search workflows, software, or glossary terms..."
        value={search}
        onChange={setSearch}
      />

      {!isSearching ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Link
            href="#workflow-guides"
            className="flex flex-col gap-2 rounded-card border border-surface-border bg-white p-5 shadow-card hover:shadow-md"
          >
            <BookOpen className="h-6 w-6 text-primary-dark" aria-hidden="true" />
            <span className="text-sm font-semibold text-accent">Workflow Guides</span>
            <span className="text-xs text-accent/60">{workflowGuides.length} articles</span>
          </Link>
          <Link
            href="#software-guides"
            className="flex flex-col gap-2 rounded-card border border-surface-border bg-white p-5 shadow-card hover:shadow-md"
          >
            <Laptop2 className="h-6 w-6 text-secondary-dark" aria-hidden="true" />
            <span className="text-sm font-semibold text-accent">Software Academy</span>
            <span className="text-xs text-accent/60">{softwareGuides.length} guides</span>
          </Link>
          <Link
            href="/sop/glossary"
            className="flex flex-col gap-2 rounded-card border border-surface-border bg-white p-5 shadow-card hover:shadow-md"
          >
            <Type className="h-6 w-6 text-accent" aria-hidden="true" />
            <span className="text-sm font-semibold text-accent">Medical Glossary</span>
            <span className="text-xs text-accent/60">Searchable clinic terms</span>
          </Link>
        </div>
      ) : null}

      {isSearching ? (
        noSearchResults ? (
          <OpenLoopEmptyState message="No SOP content matches that search." />
        ) : (
          <div className="flex flex-col gap-6">
            {filteredWorkflowGuides.length > 0 ? (
              <section aria-labelledby="search-workflow-heading" className="flex flex-col gap-3">
                <h2 id="search-workflow-heading" className="text-sm font-semibold text-accent">
                  Workflow Guides
                </h2>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredWorkflowGuides.map((article) => (
                    <ArticleCard
                      key={article.id}
                      href={`/sop/workflows/${article.id}`}
                      title={article.title}
                      subtitle={article.purpose}
                      icon={BookOpen}
                    />
                  ))}
                </div>
              </section>
            ) : null}

            {filteredSoftwareGuides.length > 0 ? (
              <section aria-labelledby="search-software-heading" className="flex flex-col gap-3">
                <h2 id="search-software-heading" className="text-sm font-semibold text-accent">
                  Software Academy
                </h2>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredSoftwareGuides.map((guide) => (
                    <ArticleCard
                      key={guide.id}
                      href={`/sop/software/${guide.id}`}
                      title={guide.title}
                      subtitle={guide.whatIsIt}
                      icon={Laptop2}
                    />
                  ))}
                </div>
              </section>
            ) : null}

            {filteredGlossaryTerms.length > 0 ? (
              <section aria-labelledby="search-glossary-heading" className="flex flex-col gap-3">
                <h2 id="search-glossary-heading" className="text-sm font-semibold text-accent">
                  Medical Glossary
                </h2>
                <div className="flex flex-col gap-2">
                  {filteredGlossaryTerms.map((term) => (
                    <Link
                      key={term.id}
                      href="/sop/glossary"
                      className="rounded-lg border border-surface-border bg-white px-4 py-3 hover:bg-surface"
                    >
                      <span className="font-semibold text-accent">{term.term}</span>
                      <span className="text-sm text-accent/70"> — {term.definition}</span>
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        )
      ) : (
        <>
          <section aria-labelledby="favorites-heading" className="flex flex-col gap-3">
            <h2 id="favorites-heading" className="flex items-center gap-2 text-sm font-semibold text-accent">
              <Star className="h-4 w-4 text-warning" aria-hidden="true" />
              Favorites
            </h2>
            {favorites.length === 0 ? (
              <p className="text-sm text-accent/50">Pin a guide from its article page to see it here.</p>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {favorites.map((favorite) => (
                  <ArticleCard
                    key={`${favorite.kind}-${favorite.id}`}
                    href={favorite.href}
                    title={favorite.title}
                    subtitle={favorite.kind === "workflow_guide" ? "Workflow Guide" : favorite.kind === "software_guide" ? "Software Guide" : "Glossary Term"}
                    icon={iconForKind(favorite.kind)}
                  />
                ))}
              </div>
            )}
          </section>

          <section id="workflow-guides" aria-labelledby="workflow-guides-heading" className="flex flex-col gap-3">
            <h2 id="workflow-guides-heading" className="text-base font-semibold text-accent">
              Workflow Guides
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {workflowGuides.map((article) => (
                <ArticleCard
                  key={article.id}
                  href={`/sop/workflows/${article.id}`}
                  title={article.title}
                  subtitle={article.purpose}
                  icon={BookOpen}
                />
              ))}
            </div>
          </section>

          <section id="software-guides" aria-labelledby="software-guides-heading" className="flex flex-col gap-3">
            <h2 id="software-guides-heading" className="text-base font-semibold text-accent">
              Software Academy
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {softwareGuides.map((guide) => (
                <ArticleCard
                  key={guide.id}
                  href={`/sop/software/${guide.id}`}
                  title={guide.title}
                  subtitle={guide.whatIsIt}
                  icon={Laptop2}
                />
              ))}
            </div>
          </section>

          <section aria-labelledby="recently-viewed-heading" className="flex flex-col gap-3">
            <h2 id="recently-viewed-heading" className="flex items-center gap-2 text-sm font-semibold text-accent">
              <History className="h-4 w-4 text-accent/50" aria-hidden="true" />
              Recently Viewed
            </h2>
            {recentlyViewed.length === 0 ? (
              <p className="text-sm text-accent/50">Guides you open will show up here.</p>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {recentlyViewed.map((item) => (
                  <ArticleCard
                    key={`${item.kind}-${item.id}`}
                    href={item.href}
                    title={item.title}
                    subtitle={item.kind === "workflow_guide" ? "Workflow Guide" : item.kind === "software_guide" ? "Software Guide" : "Glossary Term"}
                    icon={iconForKind(item.kind)}
                  />
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
