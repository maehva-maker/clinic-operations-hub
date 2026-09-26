"use client";

// components/reports/ReportsHomeView.tsx
// Reports Home: the date selector, the 6 summary cards, and the always-
// tomorrow Follow-up Due Tomorrow table. Links out to the End-of-Day Report
// and Productivity Analytics pages for the detailed views.

import Link from "next/link";
import { ClipboardList, LineChart } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { DateRangeSelector } from "@/components/reports/DateRangeSelector";
import { SummaryCards } from "@/components/reports/SummaryCards";
import { FollowUpDueTomorrowSection } from "@/components/reports/FollowUpDueTomorrowSection";
import { useDateRange } from "@/hooks/use-date-range";
import { useReportsHome } from "@/hooks/use-reports-home";

export function ReportsHomeView() {
  const { range, option, setOption, customStart, customEnd, setCustomStart, setCustomEnd } = useDateRange("today");
  const { summary, followUpsDueTomorrow, isLoading } = useReportsHome(range);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Reports & Analytics"
        description="Operational productivity — calls, documentation, open loops, and workflows — never billing or revenue."
        action={
          <div className="flex flex-wrap gap-2">
            <Link href="/reports/end-of-day">
              <Button variant="secondary">
                <ClipboardList className="h-4 w-4" aria-hidden="true" />
                End-of-Day Report
              </Button>
            </Link>
            <Link href="/reports/productivity">
              <Button variant="secondary">
                <LineChart className="h-4 w-4" aria-hidden="true" />
                Productivity Analytics
              </Button>
            </Link>
          </div>
        }
      />

      <DateRangeSelector
        option={option}
        onOptionChange={setOption}
        customStart={customStart}
        customEnd={customEnd}
        onCustomStartChange={setCustomStart}
        onCustomEndChange={setCustomEnd}
      />

      {isLoading || !summary ? (
        <p className="text-sm text-accent/60">Loading report data…</p>
      ) : (
        <SummaryCards summary={summary} />
      )}

      <FollowUpDueTomorrowSection loops={followUpsDueTomorrow} />
    </div>
  );
}
