// types/reports.ts
// Reports & Analytics is a read-only aggregation layer — every shape here is
// computed from Open Loop, Documentation, and Workflow Run records that
// already exist (services/reports.service.ts does the aggregating). Nothing
// in this module owns or stores its own activity data.

import type { DocumentationEntry } from "./documentation";
import type { OpenLoop } from "./open-loop";
import type { OpenLoopCategory, WaitingOnType } from "./shared";

export type ReportDateRangeOption = "today" | "yesterday" | "this_week" | "custom";

export interface ReportDateRange {
  option: ReportDateRangeOption;
  /** ISO date, inclusive. */
  startDate: string;
  /** ISO date, inclusive. */
  endDate: string;
}

export interface ReportsSummary {
  callsCompleted: number;
  documentationCreated: number;
  openLoopsClosed: number;
  /** Snapshot, not range-scoped: every open (non-completed) loop with a follow-up date set. */
  activeFollowUps: number;
  papOrders: number;
  weightManagementTasks: number;
}

export interface OutstandingGroup {
  waitingOn: WaitingOnType | "not_set";
  loops: OpenLoop[];
}

export interface EndOfDayReportData {
  range: ReportDateRange;
  dateLabel: string;
  patientCommunication: DocumentationEntry[];
  sleepMedicine: {
    papOrders: DocumentationEntry[];
    sleepStudies: DocumentationEntry[];
    referrals: DocumentationEntry[];
    labcorp: DocumentationEntry[];
  };
  weightManagement: {
    glp1: DocumentationEntry[];
    medicationFollowups: DocumentationEntry[];
    labMonitoring: DocumentationEntry[];
  };
  outstandingItems: OutstandingGroup[];
  tomorrowPriorities: OpenLoop[];
}

export interface ProductivitySeriesPoint {
  date: string; // ISO date
  label: string; // e.g. "Mon 09/22"
  value: number;
}

export interface WorkflowCategoryDatum {
  category: OpenLoopCategory;
  label: string;
  count: number;
}

export type ProductivityRangeOption = "today" | "7_days" | "30_days";

export interface ProductivityAnalytics {
  range: ProductivityRangeOption;
  documentationByDay: ProductivitySeriesPoint[];
  callsByDay: ProductivitySeriesPoint[];
  openLoopsCompletedByDay: ProductivitySeriesPoint[];
  workflowCategoryDistribution: WorkflowCategoryDatum[];
}

export interface PersonalProductivity {
  avgDocumentationPerDay: number;
  avgCallsPerDay: number;
  /** Completed open loops ÷ all open loops seen, 0–1. */
  completionRate: number;
  waitingCount: number;
  completedCount: number;
  /** null when there are no completed loops to form a ratio against. */
  waitingToCompletedRatio: number | null;
}
