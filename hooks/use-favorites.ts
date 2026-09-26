"use client";

// hooks/use-favorites.ts
// "Pin SOPs" — a thin wrapper over the generic usePinned() hook (hooks/use-
// pinned.ts), which the Clinic/Provider Directory's Favorite Contacts
// (use-contact-favorites.ts) also builds on, so the pin/persist logic itself
// exists in exactly one place.

import { usePinned } from "@/hooks/use-pinned";
import type { SopReference } from "@/types";

const STORAGE_KEY = "clinic-ops-hub:sop-favorites";

export function useFavorites() {
  const { pinned, isPinned, togglePinned } = usePinned<SopReference>(STORAGE_KEY);
  return { favorites: pinned, isFavorite: isPinned, toggleFavorite: togglePinned };
}
