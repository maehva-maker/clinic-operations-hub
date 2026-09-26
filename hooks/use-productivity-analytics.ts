"use client";

// hooks/use-productivity-analytics.ts
// Backs the Productivity Analytics page: the Today/7 Days/30 Days charts,
// plus Personal Productivity (a fixed rolling 7-day window, independent of
// the chart range toggle per the Phase 9 brief — "for personal improvement
// only").

import { useCallback, useEffect, useState } from "react";
import { getPersonalProductivity, getProductivityAnalytics } from "@/services/reports.service";
import type { PersonalProductivity, ProductivityAnalytics, ProductivityRangeOption } from "@/types";

interface UseProductivityAnalyticsResult {
  analytics: ProductivityAnalytics | null;
  personal: PersonalProductivity | null;
  isLoading: boolean;
  range: ProductivityRangeOption;
  setRange: (range: ProductivityRangeOption) => void;
}

export function useProductivityAnalytics(): UseProductivityAnalyticsResult {
  const [range, setRange] = useState<ProductivityRangeOption>("7_days");
  const [analytics, setAnalytics] = useState<ProductivityAnalytics | null>(null);
  const [personal, setPersonal] = useState<PersonalProductivity | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    setIsLoading(true);
    const [analyticsResult, personalResult] = await Promise.all([
      getProductivityAnalytics(range),
      getPersonalProductivity(),
    ]);
    setAnalytics(analyticsResult);
    setPersonal(personalResult);
    setIsLoading(false);
  }, [range]);

  useEffect(() => {
    void load();
  }, [load]);

  return { analytics, personal, isLoading, range, setRange };
}
