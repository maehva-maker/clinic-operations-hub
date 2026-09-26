"use client";

// hooks/use-reports-home.ts
// Backs Reports Home: the summary cards for the selected date range, plus
// the always-tomorrow Follow-up Due Tomorrow section.

import { useCallback, useEffect, useState } from "react";
import { getFollowUpsDueTomorrow, getReportsSummary } from "@/services/reports.service";
import type { OpenLoop, ReportDateRange, ReportsSummary } from "@/types";

interface UseReportsHomeResult {
  summary: ReportsSummary | null;
  followUpsDueTomorrow: OpenLoop[];
  isLoading: boolean;
  refresh: () => Promise<void>;
}

export function useReportsHome(range: ReportDateRange): UseReportsHomeResult {
  const [summary, setSummary] = useState<ReportsSummary | null>(null);
  const [followUpsDueTomorrow, setFollowUpsDueTomorrow] = useState<OpenLoop[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    setIsLoading(true);
    const [summaryResult, followUpsResult] = await Promise.all([
      getReportsSummary(range),
      getFollowUpsDueTomorrow(),
    ]);
    setSummary(summaryResult);
    setFollowUpsDueTomorrow(followUpsResult);
    setIsLoading(false);
  }, [range]);

  useEffect(() => {
    void load();
  }, [load]);

  return { summary, followUpsDueTomorrow, isLoading, refresh: load };
}
