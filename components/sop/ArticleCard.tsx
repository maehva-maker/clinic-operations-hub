// components/sop/ArticleCard.tsx
// One generic card for any SOP content item — a Workflow Guide, a Software
// Guide, or a glossary term — used across the Home page's grids and
// favorites/recently-viewed lists so there's a single card style for all of
// the SOP Center's browsing surfaces.

import Link from "next/link";
import { ChevronRight, type LucideIcon } from "lucide-react";

interface ArticleCardProps {
  href: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
}

export function ArticleCard({ href, title, subtitle, icon: Icon }: ArticleCardProps) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-card border border-surface-border bg-white p-4 shadow-card transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-light">
        <Icon className="h-4 w-4 text-primary-dark" aria-hidden="true" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-accent">{title}</p>
        <p className="truncate text-xs text-accent/60">{subtitle}</p>
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-accent/30" aria-hidden="true" />
    </Link>
  );
}
