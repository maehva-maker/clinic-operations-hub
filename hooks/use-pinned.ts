"use client";

// hooks/use-pinned.ts
// The generic "pin this" hook behind both the SOP Center's Favorites
// (use-favorites.ts) and the Clinic/Provider Directory's Favorite Contacts
// (use-contact-favorites.ts). Mock/local persistence via localStorage, keyed
// by a caller-supplied storage key so the two features never share state —
// pinning a workflow guide and pinning a clinic contact are independent.

import { useCallback, useEffect, useState } from "react";

interface PinnableItem {
  kind: string;
  id: string;
}

function readPinned<T>(storageKey: string): T[] {
  try {
    const raw = window.localStorage.getItem(storageKey);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

function writePinned<T>(storageKey: string, items: T[]): void {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(items));
  } catch {
    // Storage unavailable — pins simply won't persist this session.
  }
}

interface UsePinnedResult<T extends PinnableItem> {
  pinned: T[];
  isPinned: (kind: T["kind"], id: string) => boolean;
  togglePinned: (item: T) => void;
}

export function usePinned<T extends PinnableItem>(storageKey: string): UsePinnedResult<T> {
  const [pinned, setPinned] = useState<T[]>([]);

  useEffect(() => {
    setPinned(readPinned<T>(storageKey));
  }, [storageKey]);

  const isPinned = useCallback(
    (kind: T["kind"], id: string) => pinned.some((item) => item.kind === kind && item.id === id),
    [pinned],
  );

  const togglePinned = useCallback(
    (item: T) => {
      setPinned((prev) => {
        const exists = prev.some((existing) => existing.kind === item.kind && existing.id === item.id);
        const next = exists
          ? prev.filter((existing) => !(existing.kind === item.kind && existing.id === item.id))
          : [item, ...prev];
        writePinned(storageKey, next);
        return next;
      });
    },
    [storageKey],
  );

  return { pinned, isPinned, togglePinned };
}
