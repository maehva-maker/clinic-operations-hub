"use client";

// components/open-loops/ViewToggle.tsx

import { LayoutGrid, List } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export type OpenLoopView = "table" | "board";

interface ViewToggleProps {
  value: OpenLoopView;
  onChange: (view: OpenLoopView) => void;
}

export function ViewToggle({ value, onChange }: ViewToggleProps) {
  return (
    <div role="group" aria-label="View" className="inline-flex shrink-0 rounded-lg border border-surface-border bg-white p-1">
      <button
        type="button"
        aria-pressed={value === "table"}
        onClick={() => onChange("table")}
        className={cn(
          "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors",
          value === "table" ? "bg-primary-light text-primary-dark" : "text-accent/60 hover:bg-surface",
        )}
      >
        <List className="h-3.5 w-3.5" aria-hidden="true" />
        List
      </button>
      <button
        type="button"
        aria-pressed={value === "board"}
        onClick={() => onChange("board")}
        className={cn(
          "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors",
          value === "board" ? "bg-primary-light text-primary-dark" : "text-accent/60 hover:bg-surface",
        )}
      >
        <LayoutGrid className="h-3.5 w-3.5" aria-hidden="true" />
        Board
      </button>
    </div>
  );
}
