"use client";

// hooks/use-export-center.ts
// The DOM-facing half of the Export Center — clipboard, print window, and
// file download all live here so services/report-export.service.ts (the
// content builders) stays pure and testable. "Export PDF" hands a printable
// layout to the browser's own print dialog (Chrome's "Save as PDF"
// destination produces a real PDF with no extra library); "Export DOCX"
// downloads that same layout as a Word-openable .doc file via the
// long-standing "HTML with an application/msword MIME type" technique —
// both are described as mock/lightweight exports in the Phase 9 build notes
// rather than a full binary PDF/DOCX generator.

import { useCallback, useState } from "react";
import { buildDailySummaryText, buildPrintableHtml } from "@/services/report-export.service";
import type { ToastMessage } from "@/components/ui/Toast";
import type { EndOfDayReportData, ReportsSummary } from "@/types";

export type ExportStatus = ToastMessage | null;

function makeStatus(text: string, tone: ToastMessage["tone"]): ToastMessage {
  return { id: Date.now(), text, tone };
}

interface UseExportCenterResult {
  status: ExportStatus;
  clearStatus: () => void;
  copyDailySummary: () => Promise<void>;
  exportPdf: () => void;
  exportDocx: () => void;
}

export function useExportCenter(report: EndOfDayReportData | null, summary: ReportsSummary | null): UseExportCenterResult {
  const [status, setStatus] = useState<ExportStatus>(null);

  const clearStatus = useCallback(() => setStatus(null), []);

  const copyDailySummary = useCallback(async () => {
    if (!report || !summary) return;
    try {
      await navigator.clipboard.writeText(buildDailySummaryText(report, summary));
      setStatus(makeStatus("Daily summary copied to clipboard.", "success"));
    } catch {
      setStatus(makeStatus("Couldn't copy — select and copy the text manually.", "error"));
    }
  }, [report, summary]);

  const exportPdf = useCallback(() => {
    if (!report || !summary) return;
    const html = buildPrintableHtml(report, summary);
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      setStatus(makeStatus("Couldn't open the print preview — check your browser's pop-up settings.", "error"));
      return;
    }
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    // Give the new document a beat to finish laying out before printing.
    setTimeout(() => printWindow.print(), 300);
    setStatus(makeStatus('Opened a print preview — choose "Save as PDF" in the print dialog.', "success"));
  }, [report, summary]);

  const exportDocx = useCallback(() => {
    if (!report || !summary) return;
    const html = buildPrintableHtml(report, summary);
    const wordHtml = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">${html
      .replace(/^[\s\S]*<head>/, "<head>")
      .replace(/<\/html>$/, "</html>")}`;
    const blob = new Blob([wordHtml], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `end-of-day-report-${report.range.endDate}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setStatus(makeStatus("Word document downloaded.", "success"));
  }, [report, summary]);

  return { status, clearStatus, copyDailySummary, exportPdf, exportDocx };
}
