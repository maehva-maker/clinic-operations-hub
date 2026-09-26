"use client";

// components/reports/ExportCenterPanel.tsx
// NEW FEATURE — Copy Daily Summary / Export PDF / Export DOCX, all driven by
// the same EndOfDayReportData the page above already rendered, so exporting
// never re-derives or duplicates the underlying activity data.

import { Copy, FileDown, FileText } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";
import { useExportCenter } from "@/hooks/use-export-center";
import type { EndOfDayReportData, ReportsSummary } from "@/types";

interface ExportCenterPanelProps {
  report: EndOfDayReportData | null;
  summary: ReportsSummary | null;
}

export function ExportCenterPanel({ report, summary }: ExportCenterPanelProps) {
  const { status, clearStatus, copyDailySummary, exportPdf, exportDocx } = useExportCenter(report, summary);
  const isReady = Boolean(report && summary);

  return (
    <section className="rounded-card border border-surface-border bg-white p-5 shadow-card">
      <h2 className="mb-1 text-sm font-semibold text-accent">Export Center</h2>
      <p className="mb-4 text-xs text-accent/60">
        Share or file today&apos;s report. PDF opens your browser&apos;s print dialog — choose &quot;Save as PDF&quot;.
      </p>
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" onClick={() => void copyDailySummary()} disabled={!isReady}>
          <Copy className="h-4 w-4" aria-hidden="true" />
          Copy Daily Summary
        </Button>
        <Button variant="secondary" onClick={exportPdf} disabled={!isReady}>
          <FileText className="h-4 w-4" aria-hidden="true" />
          Export PDF
        </Button>
        <Button variant="secondary" onClick={exportDocx} disabled={!isReady}>
          <FileDown className="h-4 w-4" aria-hidden="true" />
          Export DOCX
        </Button>
      </div>

      <Toast toast={status} onDismiss={clearStatus} />
    </section>
  );
}
