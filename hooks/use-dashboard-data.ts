"use client";

// hooks/use-dashboard-data.ts
// Client-side data-fetching hook for the Dashboard. Orchestrates loading and
// error state around services/dashboard.service.ts so the page component
// stays purely presentational.

import { useEffect, useState } from "react";
import { getDashboardData } from "@/services/dashboard.service";
import type { DashboardData } from "@/types";

interface UseDashboardDataResult {
  data: DashboardData | null;
  isLoading: boolean;
  error: string | null;
}

export function useDashboardData(): UseDashboardDataResult {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        setIsLoading(true);
        const result = await getDashboardData();
        if (isMounted) {
          setData(result);
          setError(null);
        }
      } catch {
        if (isMounted) {
          setError("Couldn't load dashboard data. Try refreshing the page.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void load();

    return () => {
      isMounted = false;
    };
  }, []);

  return { data, isLoading, error };
}
