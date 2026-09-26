"use client";

// components/shared/SearchBar.tsx
// One shared visual/behavioral treatment for "search" everywhere it appears
// (global Top Navigation search today; Call Log / Clinic Directory / SOP
// Center scoped searches in later phases) — per the Design System's
// SearchBar component spec.

import { Search } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onFocus?: () => void;
  className?: string;
}

export function SearchBar({
  placeholder = "Search patients, open loops, SOPs...",
  value,
  onChange,
  onFocus,
  className,
}: SearchBarProps) {
  return (
    <div
      className={cn(
        "flex w-full items-center gap-2 rounded-lg border border-surface-border bg-white px-3 py-2 text-sm text-accent/70 transition-colors focus-within:border-secondary focus-within:ring-2 focus-within:ring-secondary/20",
        className,
      )}
    >
      <Search className="h-4 w-4 shrink-0 text-accent/40" aria-hidden="true" />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        onFocus={onFocus}
        placeholder={placeholder}
        aria-label="Search"
        className="w-full bg-transparent text-sm text-accent placeholder:text-accent/40 focus:outline-none"
      />
    </div>
  );
}
