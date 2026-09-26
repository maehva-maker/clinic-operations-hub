// services/report-export.service.ts
// Pure content builders for the Export Center — no DOM access here (that
// lives in hooks/use-export-center.ts, which is the "use client" boundary).
// Both the plain-text summary and the printable HTML layout are built from
// the same EndOfDayReportData the End-of-Day Report page already renders,
// so exporting never re-derives or duplicates the underlying activity data.

import { WAITING_ON_LABEL } from "@/types";
import type { DocumentationEntry, EndOfDayReportData, OpenLoop, ReportsSummary } from "@/types";

function docLine(entry: DocumentationEntry): string {
  return `  • ${entry.common.patientName} — ${entry.noteText}`;
}

function loopLine(loop: OpenLoop): string {
  const due = loop.dueDate ? ` (due ${loop.dueDate})` : "";
  return `  • ${loop.patientName} — ${loop.title}${due}`;
}

function section(title: string, lines: string[]): string {
  if (lines.length === 0) return `${title}\n  None.\n`;
  return `${title}\n${lines.join("\n")}\n`;
}

/** The Export Center's "Copy Daily Summary" — a plain-text version of the End-of-Day Report. */
export function buildDailySummaryText(report: EndOfDayReportData, summary: ReportsSummary): string {
  const parts: string[] = [];

  parts.push("CLINIC OPERATIONS HUB — END-OF-DAY REPORT");
  parts.push(report.dateLabel);
  parts.push("");

  parts.push("SUMMARY");
  parts.push(`  Calls Completed: ${summary.callsCompleted}`);
  parts.push(`  Documentation Created: ${summary.documentationCreated}`);
  parts.push(`  Open Loops Closed: ${summary.openLoopsClosed}`);
  parts.push(`  Active Follow-ups: ${summary.activeFollowUps}`);
  parts.push(`  PAP Orders: ${summary.papOrders}`);
  parts.push(`  Weight Management Tasks: ${summary.weightManagementTasks}`);
  parts.push("");

  parts.push(section("PATIENT COMMUNICATION", report.patientCommunication.map(docLine)));

  parts.push("SLEEP MEDICINE");
  parts.push(section("  PAP Orders", report.sleepMedicine.papOrders.map(docLine)));
  parts.push(section("  Sleep Studies", report.sleepMedicine.sleepStudies.map(docLine)));
  parts.push(section("  Referrals", report.sleepMedicine.referrals.map(docLine)));
  parts.push(section("  LabCorp", report.sleepMedicine.labcorp.map(docLine)));

  parts.push("WEIGHT MANAGEMENT");
  parts.push(section("  GLP-1", report.weightManagement.glp1.map(docLine)));
  parts.push(section("  Medication Follow-ups", report.weightManagement.medicationFollowups.map(docLine)));
  parts.push(section("  Lab Monitoring", report.weightManagement.labMonitoring.map(docLine)));

  parts.push("OUTSTANDING ITEMS (by Waiting On)");
  if (report.outstandingItems.length === 0) {
    parts.push("  None.");
  } else {
    report.outstandingItems.forEach((group) => {
      const label = group.waitingOn === "not_set" ? "Not Set" : WAITING_ON_LABEL[group.waitingOn];
      parts.push(`  ${label} (${group.loops.length})`);
      group.loops.forEach((loop) => parts.push(`    - ${loop.patientName} — ${loop.title}`));
    });
  }
  parts.push("");

  parts.push(section("TOMORROW'S PRIORITIES", report.tomorrowPriorities.map(loopLine)));

  return parts.join("\n").trim();
}

const REPORT_STYLES = `
  body { font-family: 'Segoe UI', Arial, sans-serif; color: #1f2937; margin: 0; padding: 32px; }
  h1 { font-size: 20px; margin: 0 0 2px; }
  h2 { font-size: 14px; margin: 20px 0 8px; padding-bottom: 4px; border-bottom: 1px solid #d8dee6; text-transform: uppercase; letter-spacing: 0.03em; }
  h3 { font-size: 12px; margin: 12px 0 4px; color: #4b5563; }
  .subtitle { color: #6b7280; font-size: 13px; margin-bottom: 20px; }
  .summary-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 8px; }
  .summary-card { border: 1px solid #d8dee6; border-radius: 8px; padding: 10px 12px; }
  .summary-card .value { font-size: 20px; font-weight: 700; }
  .summary-card .label { font-size: 11px; color: #6b7280; }
  ul { margin: 4px 0 0; padding-left: 18px; }
  li { font-size: 12px; margin-bottom: 3px; }
  .empty { font-size: 12px; color: #9ca3af; font-style: italic; }
  .group-title { font-size: 12px; font-weight: 600; margin-top: 6px; }
  @media print {
    body { padding: 0; }
    .no-print { display: none; }
  }
`;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function docListHtml(entries: DocumentationEntry[]): string {
  if (entries.length === 0) return `<p class="empty">None.</p>`;
  return `<ul>${entries
    .map((entry) => `<li><strong>${escapeHtml(entry.common.patientName)}</strong> — ${escapeHtml(entry.noteText)}</li>`)
    .join("")}</ul>`;
}

function loopListHtml(loops: OpenLoop[]): string {
  if (loops.length === 0) return `<p class="empty">None.</p>`;
  return `<ul>${loops
    .map(
      (loop) =>
        `<li><strong>${escapeHtml(loop.patientName)}</strong> — ${escapeHtml(loop.title)}${
          loop.dueDate ? ` (due ${loop.dueDate})` : ""
        }</li>`,
    )
    .join("")}</ul>`;
}

/**
 * A realistic, printable HTML layout for the End-of-Day Report. Used both by
 * "Export PDF" (opened and handed to the browser's print dialog — Chrome's
 * "Save as PDF" destination turns this into a real PDF with no extra
 * library) and, wrapped with a Word-compatible MIME type, by "Export DOCX".
 */
export function buildPrintableHtml(report: EndOfDayReportData, summary: ReportsSummary): string {
  const outstandingHtml =
    report.outstandingItems.length === 0
      ? `<p class="empty">None.</p>`
      : report.outstandingItems
          .map((group) => {
            const label = group.waitingOn === "not_set" ? "Not Set" : WAITING_ON_LABEL[group.waitingOn];
            return `<div class="group-title">${escapeHtml(label)} (${group.loops.length})</div>${loopListHtml(
              group.loops,
            )}`;
          })
          .join("");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>End-of-Day Report — ${escapeHtml(report.dateLabel)}</title>
<style>${REPORT_STYLES}</style>
</head>
<body>
  <h1>Clinic Operations Hub — End-of-Day Report</h1>
  <p class="subtitle">${escapeHtml(report.dateLabel)} · Prepared by Mae (HVA)</p>

  <div class="summary-grid">
    <div class="summary-card"><div class="value">${summary.callsCompleted}</div><div class="label">Calls Completed</div></div>
    <div class="summary-card"><div class="value">${summary.documentationCreated}</div><div class="label">Documentation Created</div></div>
    <div class="summary-card"><div class="value">${summary.openLoopsClosed}</div><div class="label">Open Loops Closed</div></div>
    <div class="summary-card"><div class="value">${summary.activeFollowUps}</div><div class="label">Active Follow-ups</div></div>
    <div class="summary-card"><div class="value">${summary.papOrders}</div><div class="label">PAP Orders</div></div>
    <div class="summary-card"><div class="value">${summary.weightManagementTasks}</div><div class="label">Weight Mgmt Tasks</div></div>
  </div>

  <h2>Patient Communication</h2>
  ${docListHtml(report.patientCommunication)}

  <h2>Sleep Medicine</h2>
  <h3>PAP Orders</h3>${docListHtml(report.sleepMedicine.papOrders)}
  <h3>Sleep Studies</h3>${docListHtml(report.sleepMedicine.sleepStudies)}
  <h3>Referrals</h3>${docListHtml(report.sleepMedicine.referrals)}
  <h3>LabCorp</h3>${docListHtml(report.sleepMedicine.labcorp)}

  <h2>Weight Management</h2>
  <h3>GLP-1</h3>${docListHtml(report.weightManagement.glp1)}
  <h3>Medication Follow-ups</h3>${docListHtml(report.weightManagement.medicationFollowups)}
  <h3>Lab Monitoring</h3>${docListHtml(report.weightManagement.labMonitoring)}

  <h2>Outstanding Items (by Waiting On)</h2>
  ${outstandingHtml}

  <h2>Tomorrow's Priorities</h2>
  ${loopListHtml(report.tomorrowPriorities)}
</body>
</html>`;
}
