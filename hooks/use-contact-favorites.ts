"use client";

// hooks/use-contact-favorites.ts
// "Favorite Contacts" for the Clinic Directory and Provider Directory —
// built on the same generic usePinned() hook as the SOP Center's Favorites,
// under its own storage key so the two pin lists stay independent.

import { usePinned } from "@/hooks/use-pinned";
import type { ContactReference } from "@/types";

const STORAGE_KEY = "clinic-ops-hub:contact-favorites";

export function useContactFavorites() {
  const { pinned, isPinned, togglePinned } = usePinned<ContactReference>(STORAGE_KEY);
  return { favorites: pinned, isFavorite: isPinned, toggleFavorite: togglePinned };
}
