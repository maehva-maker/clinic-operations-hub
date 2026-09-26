"use client";

// hooks/use-end-of-day-report.ts
// Backs the End-of-Day Report page: the full report for the selected date
// range, plus the same summary cards shown on Reports Home so the page can
// lead with the numbers before the detail sections.

import { useCallback, useEffect, useState } from "react";
import { getEndOfDayReport, getReportsSummary } from "@/services/reports.service";
import type { EndOfDayReportData, ReportDateRange, ReportsSummary } from "@/types";

interface UseEndOfDayReportResult {
  report: EndOfDayReportData | null;
  summary: ReportsSummary | null;
  isLoading: boolean;
  refresh: () => Promise<void>;
}

export function useEndOfDayReport(range: ReportDateRange): UseEndOfDayReportResult {
  const [report, setReport] = useState<EndOfDayReportData | null>(null);
  const [summary, setSummary] = useState<ReportsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    setIsLoading(true);
    const [reportResult, summaryResult] = await Promise.all([
      getEndOfDayReport(range),
      getReportsSummary(range),
    ]);
    setReport(reportResult);
    setSummary(summaryResult);
    setIsLoading(false);
  }, [range]);

  useEffect(() => {
    void load();
  }, [load]);

  return { report, summary, isLoading, refresh: load };
}
