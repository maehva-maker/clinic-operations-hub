"use client";

// components/sop/FavoriteButton.tsx
// Pin/unpin toggle reused by every article header. Favorites state itself
// lives in useFavorites() (localStorage) — this component only renders the
// toggle and reports the click.

import { Star } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface FavoriteButtonProps {
  isFavorite: boolean;
  onToggle: () => void;
  label: string;
}

export function FavoriteButton({ isFavorite, onToggle, label }: FavoriteButtonProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={isFavorite}
      aria-label={isFavorite ? `Remove ${label} from favorites` : `Add ${label} to favorites`}
      className={cn(
        "flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40",
        isFavorite
          ? "border-warning bg-warning-light text-warning"
          : "border-surface-border bg-white text-accent/60 hover:bg-surface",
      )}
    >
      <Star className={cn("h-4 w-4", isFavorite && "fill-warning")} aria-hidden="true" />
      {isFavorite ? "Favorited" : "Favorite"}
    </button>
  );
}
