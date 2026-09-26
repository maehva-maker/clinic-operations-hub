"use client";

// hooks/use-date-range.ts
// Shared Today/Yesterday/This Week/Custom Range state for Reports Home and
// the End-of-Day Report — both pages read the same selector, so the logic
// for resolving an option (plus custom bounds) into concrete dates lives in
// exactly one place: services/reports.service.ts's resolveDateRange().

import { useCallback, useMemo, useState } from "react";
import { resolveDateRange } from "@/services/reports.service";
import { getTodayIso } from "@/lib/utils/date";
import type { ReportDateRange, ReportDateRangeOption } from "@/types";

interface UseDateRangeResult {
  range: ReportDateRange;
  option: ReportDateRangeOption;
  setOption: (option: ReportDateRangeOption) => void;
  customStart: string;
  customEnd: string;
  setCustomStart: (value: string) => void;
  setCustomEnd: (value: string) => void;
}

export function useDateRange(initialOption: ReportDateRangeOption = "today"): UseDateRangeResult {
  const [option, setOption] = useState<ReportDateRangeOption>(initialOption);
  const [customStart, setCustomStart] = useState(getTodayIso());
  const [customEnd, setCustomEnd] = useState(getTodayIso());

  const handleSetOption = useCallback((next: ReportDateRangeOption) => {
    setOption(next);
  }, []);

  const range = useMemo(
    () => resolveDateRange(option, { startDate: customStart, endDate: customEnd }),
    [option, customStart, customEnd],
  );

  return {
    range,
    option,
    setOption: handleSetOption,
    customStart,
    customEnd,
    setCustomStart,
    setCustomEnd,
  };
}
