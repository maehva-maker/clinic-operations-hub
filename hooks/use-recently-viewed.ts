"use client";

// hooks/use-recently-viewed.ts
// "Automatically show the last viewed SOPs" — mock persistence via
// localStorage, capped and de-duplicated so viewing the same article twice
// just moves it back to the top instead of listing it twice.

import { useCallback, useEffect, useState } from "react";
import type { SopReference } from "@/types";

const STORAGE_KEY = "clinic-ops-hub:sop-recently-viewed";
const MAX_ENTRIES = 8;

function readRecentlyViewed(): SopReference[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SopReference[]) : [];
  } catch {
    return [];
  }
}

function writeRecentlyViewed(items: SopReference[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Storage unavailable — recently viewed simply won't persist this session.
  }
}

interface UseRecentlyViewedResult {
  recentlyViewed: SopReference[];
  recordView: (reference: SopReference) => void;
}

export function useRecentlyViewed(): UseRecentlyViewedResult {
  const [recentlyViewed, setRecentlyViewed] = useState<SopReference[]>([]);

  useEffect(() => {
    setRecentlyViewed(readRecentlyViewed());
  }, []);

  const recordView = useCallback((reference: SopReference) => {
    setRecentlyViewed((prev) => {
      const deduped = prev.filter((item) => !(item.kind === reference.kind && item.id === reference.id));
      const next = [reference, ...deduped].slice(0, MAX_ENTRIES);
      writeRecentlyViewed(next);
      return next;
    });
  }, []);

  return { recentlyViewed, recordView };
}
