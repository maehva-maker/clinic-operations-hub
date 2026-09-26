"use client";

// components/reports/EndOfDayReportView.tsx
// The full End-of-Day Report: Patient Communication, Sleep Medicine and
// Weight Management breakdowns, Outstanding Items (by Waiting On),
// Tomorrow's Priorities, and the Export Center — all generated from
// getEndOfDayReport(), which itself only reads existing Open Loop /
// Documentation records.

import Link from "next/link";
import { ArrowLeft, LineChart } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { DateRangeSelector } from "@/components/reports/DateRangeSelector";
import { SummaryCards } from "@/components/reports/SummaryCards";
import { ReportEntryList } from "@/components/reports/ReportEntryList";
import { OutstandingItemsSection } from "@/components/reports/OutstandingItemsSection";
import { ExportCenterPanel } from "@/components/reports/ExportCenterPanel";
import { useDateRange } from "@/hooks/use-date-range";
import { useEndOfDayReport } from "@/hooks/use-end-of-day-report";

export function EndOfDayReportView() {
  const { range, option, setOption, customStart, customEnd, setCustomStart, setCustomEnd } = useDateRange("today");
  const { report, summary, isLoading } = useEndOfDayReport(range);

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/reports"
        className="inline-flex w-fit items-center gap-1.5 text-xs font-semibold text-secondary-dark hover:underline"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
        Reports & Analytics
      </Link>

      <PageHeader
        title="End-of-Day Report"
        description="Automatically generated from the Activity Timeline — not the EMR, and not a billing summary."
        action={
          <Link href="/reports/productivity">
            <Button variant="secondary">
              <LineChart className="h-4 w-4" aria-hidden="true" />
              Productivity Analytics
            </Button>
          </Link>
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

      {isLoading || !report || !summary ? (
        <p className="text-sm text-accent/60">Building report…</p>
      ) : (
        <>
          <SummaryCards summary={summary} />

          <section className="rounded-card border border-surface-border bg-white p-5 shadow-card">
            <h2 className="mb-3 text-sm font-semibold text-accent">Patient Communication</h2>
            <ReportEntryList entries={report.patientCommunication} emptyMessage="No calls logged in this range." />
          </section>

          <section className="rounded-card border border-surface-border bg-white p-5 shadow-card">
            <h2 className="mb-3 text-sm font-semibold text-accent">Sleep Medicine</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-accent/50">PAP Orders</h3>
                <ReportEntryList entries={report.sleepMedicine.papOrders} />
              </div>
              <div>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-accent/50">Sleep Studies</h3>
                <ReportEntryList entries={report.sleepMedicine.sleepStudies} />
              </div>
              <div>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-accent/50">Referrals</h3>
                <ReportEntryList entries={report.sleepMedicine.referrals} />
              </div>
              <div>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-accent/50">LabCorp</h3>
                <ReportEntryList entries={report.sleepMedicine.labcorp} />
              </div>
            </div>
          </section>

          <section className="rounded-card border border-surface-border bg-white p-5 shadow-card">
            <h2 className="mb-3 text-sm font-semibold text-accent">Weight Management</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-accent/50">GLP-1</h3>
                <ReportEntryList entries={report.weightManagement.glp1} />
              </div>
              <div>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-accent/50">
                  Medication Follow-ups
                </h3>
                <ReportEntryList entries={report.weightManagement.medicationFollowups} />
              </div>
              <div>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-accent/50">Lab Monitoring</h3>
                <ReportEntryList entries={report.weightManagement.labMonitoring} />
              </div>
            </div>
          </section>

          <section className="rounded-card border border-surface-border bg-white p-5 shadow-card">
            <h2 className="mb-3 text-sm font-semibold text-accent">Outstanding Items</h2>
            <OutstandingItemsSection groups={report.outstandingItems} />
          </section>

          <section className="rounded-card border border-surface-border bg-white p-5 shadow-card">
            <h2 className="mb-3 text-sm font-semibold text-accent">Tomorrow&apos;s Priorities</h2>
            {report.tomorrowPriorities.length === 0 ? (
              <p className="text-sm text-accent/50">No follow-ups are due tomorrow.</p>
            ) : (
              <ul className="flex flex-col gap-1.5">
                {report.tomorrowPriorities.map((loop) => (
                  <li
                    key={loop.id}
                    className="rounded-lg border border-surface-border px-3 py-2 text-sm"
                  >
                    <span className="font-medium text-accent">{loop.patientName}</span>
                    <span className="text-accent/60"> — {loop.title}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <ExportCenterPanel report={report} summary={summary} />
        </>
      )}
    </div>
  );
}
