// services/reports.service.ts
// The only place that aggregates Reports & Analytics data. Every function
// here reads from the three existing services (Open Loop Tracker, Clinical
// Documentation, Workflow Wizard) and derives numbers/lists on the fly — it
// never stores its own activity record, per the Phase 9 "never duplicate
// activity data" rule.
//
// Source-of-truth choices worth calling out (also covered in the Phase 9
// build notes):
//   - "Calls Completed" counts Documentation entries in the
//     "patient_communication" category. Every call the PRD asks for
//     (confirmation, reschedule, voicemail, no-answer, inbound) has a
//     matching template, and the PRD's own rule — "Documentation must be
//     created even if the task remains unfinished" — means every call is
//     expected to produce one of these entries, so it's the one place calls
//     are counted without also double-counting a related Open Loop Activity
//     note for the same call.
//   - "This Week" is a rolling 7-day window ending today, not a calendar
//     week, so it never depends on what day of the week "today" is.
//   - "Tomorrow" (Follow-up Due Tomorrow, Tomorrow's Priorities) is always
//     relative to the real current date, independent of whatever date range
//     is selected elsewhere on the page.

import { getOpenLoops } from "@/services/open-loops.service";
import { getDocumentationHistory } from "@/services/documentation.service";
import { getWorkflowRuns } from "@/services/workflow.service";
import { CATEGORY_LABEL } from "@/lib/constants/workflow-categories";
import {
  addDaysIso,
  formatFriendlyDate,
  formatShortDate,
  getTodayIso,
  getTomorrowIso,
  getYesterdayIso,
  isTimestampInRange,
} from "@/lib/utils/date";
import type {
  DocumentationEntry,
  DocumentationTemplateId,
  EndOfDayReportData,
  OpenLoop,
  OpenLoopCategory,
  OutstandingGroup,
  PersonalProductivity,
  ProductivityAnalytics,
  ProductivityRangeOption,
  ReportDateRange,
  ReportDateRangeOption,
  ReportsSummary,
  WorkflowCategoryDatum,
  WorkflowRun,
} from "@/types";

async function loadAll(): Promise<{
  loops: OpenLoop[];
  documentation: DocumentationEntry[];
  workflowRuns: WorkflowRun[];
}> {
  const [loops, documentation, workflowRuns] = await Promise.all([
    getOpenLoops(),
    getDocumentationHistory(),
    getWorkflowRuns(),
  ]);
  return { loops, documentation, workflowRuns };
}

export interface CustomDateRangeInput {
  startDate: string;
  endDate: string;
}

/** Resolves a date range option (plus custom bounds, when given) into concrete ISO start/end dates. */
export function resolveDateRange(
  option: ReportDateRangeOption,
  custom?: CustomDateRangeInput,
): ReportDateRange {
  const today = getTodayIso();

  if (option === "today") {
    return { option, startDate: today, endDate: today };
  }
  if (option === "yesterday") {
    const yesterday = getYesterdayIso();
    return { option, startDate: yesterday, endDate: yesterday };
  }
  if (option === "this_week") {
    return { option, startDate: addDaysIso(today, -6), endDate: today };
  }

  // custom
  const startDate = custom?.startDate || today;
  const endDate = custom?.endDate || today;
  return { option, startDate: startDate <= endDate ? startDate : endDate, endDate: startDate <= endDate ? endDate : startDate };
}

export function formatRangeLabel(range: ReportDateRange): string {
  if (range.startDate === range.endDate) {
    return formatFriendlyDate(range.startDate);
  }
  return `${formatShortDate(range.startDate)} – ${formatShortDate(range.endDate)}, ${range.endDate.slice(0, 4)}`;
}

export async function getReportsSummary(range: ReportDateRange): Promise<ReportsSummary> {
  const { loops, documentation } = await loadAll();

  const docsInRange = documentation.filter((entry) =>
    isTimestampInRange(entry.timestamp, range.startDate, range.endDate),
  );
  const loopsClosedInRange = loops.filter(
    (loop) => loop.status === "completed" && isTimestampInRange(loop.updatedAt, range.startDate, range.endDate),
  );
  const activeFollowUps = loops.filter((loop) => loop.status !== "completed" && loop.dueDate !== null).length;

  return {
    callsCompleted: docsInRange.filter((entry) => entry.category === "patient_communication").length,
    documentationCreated: docsInRange.length,
    openLoopsClosed: loopsClosedInRange.length,
    activeFollowUps,
    papOrders: docsInRange.filter((entry) => entry.templateId === "pap_order").length,
    weightManagementTasks: docsInRange.filter((entry) => entry.category === "weight_management").length,
  };
}

/** Every open (non-completed) loop whose follow-up date is tomorrow, relative to the real current date. */
export async function getFollowUpsDueTomorrow(): Promise<OpenLoop[]> {
  const { loops } = await loadAll();
  const tomorrow = getTomorrowIso();
  return loops
    .filter((loop) => loop.status !== "completed" && loop.dueDate === tomorrow)
    .sort((a, b) => a.patientName.localeCompare(b.patientName));
}

function byTemplate(entries: DocumentationEntry[], templateId: DocumentationTemplateId): DocumentationEntry[] {
  return entries.filter((entry) => entry.templateId === templateId);
}

export async function getEndOfDayReport(range: ReportDateRange): Promise<EndOfDayReportData> {
  const { loops, documentation } = await loadAll();

  const docsInRange = documentation.filter((entry) =>
    isTimestampInRange(entry.timestamp, range.startDate, range.endDate),
  );

  const outstandingLoops = loops.filter((loop) => loop.status !== "completed");
  const groupsByWaitingOn = new Map<OutstandingGroup["waitingOn"], OpenLoop[]>();
  outstandingLoops.forEach((loop) => {
    const key = loop.waitingOn ?? "not_set";
    groupsByWaitingOn.set(key, [...(groupsByWaitingOn.get(key) ?? []), loop]);
  });
  const outstandingItems: OutstandingGroup[] = Array.from(groupsByWaitingOn.entries())
    .map(([waitingOn, groupLoops]) => ({ waitingOn, loops: groupLoops }))
    .sort((a, b) => b.loops.length - a.loops.length);

  const tomorrowPriorities = await getFollowUpsDueTomorrow();

  return {
    range,
    dateLabel: formatRangeLabel(range),
    patientCommunication: docsInRange.filter((entry) => entry.category === "patient_communication"),
    sleepMedicine: {
      papOrders: byTemplate(docsInRange, "pap_order"),
      sleepStudies: byTemplate(docsInRange, "sleep_study_coordination"),
      referrals: byTemplate(docsInRange, "referral_followup"),
      labcorp: byTemplate(docsInRange, "lab_review"),
    },
    weightManagement: {
      glp1: byTemplate(docsInRange, "glp1_prior_auth"),
      medicationFollowups: byTemplate(docsInRange, "medication_followup"),
      labMonitoring: byTemplate(docsInRange, "lab_monitoring"),
    },
    outstandingItems,
    tomorrowPriorities,
  };
}

const PRODUCTIVITY_RANGE_DAYS: Record<ProductivityRangeOption, number> = {
  today: 1,
  "7_days": 7,
  "30_days": 30,
};

function lastNDaysIso(n: number): string[] {
  const today = getTodayIso();
  return Array.from({ length: n }, (_, index) => addDaysIso(today, -(n - 1 - index)));
}

function dayLabel(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00`);
  return date.toLocaleDateString("en-US", { weekday: "short", month: "2-digit", day: "2-digit" });
}

export async function getProductivityAnalytics(
  rangeOption: ProductivityRangeOption,
): Promise<ProductivityAnalytics> {
  const { loops, documentation, workflowRuns } = await loadAll();
  const days = lastNDaysIso(PRODUCTIVITY_RANGE_DAYS[rangeOption]);

  const documentationByDay = days.map((date) => ({
    date,
    label: dayLabel(date),
    value: documentation.filter((entry) => entry.timestamp.slice(0, 10) === date).length,
  }));

  const callsByDay = days.map((date) => ({
    date,
    label: dayLabel(date),
    value: documentation.filter(
      (entry) => entry.category === "patient_communication" && entry.timestamp.slice(0, 10) === date,
    ).length,
  }));

  const openLoopsCompletedByDay = days.map((date) => ({
    date,
    label: dayLabel(date),
    value: loops.filter((loop) => loop.status === "completed" && loop.updatedAt.slice(0, 10) === date).length,
  }));

  const rangeStart = days[0] ?? getTodayIso();
  const rangeEnd = days[days.length - 1] ?? getTodayIso();

  // Distribution comes from Workflow Wizard runs, not Open Loop categories —
  // the Open Loop Tracker already has its own category breakdown, so this
  // chart shows which guided workflows are actually being run instead of
  // just repeating that view. A WorkflowRun's workflowId is the same
  // OpenLoopCategory type the rest of the app uses for category labels.
  const runsInRange = workflowRuns.filter((run) => isTimestampInRange(run.updatedAt, rangeStart, rangeEnd));
  const categoryCounts = new Map<OpenLoopCategory, number>();
  runsInRange.forEach((run) => {
    categoryCounts.set(run.workflowId, (categoryCounts.get(run.workflowId) ?? 0) + 1);
  });
  const workflowCategoryDistribution: WorkflowCategoryDatum[] = Array.from(categoryCounts.entries())
    .map(([category, count]) => ({ category, label: CATEGORY_LABEL[category], count }))
    .sort((a, b) => b.count - a.count);

  return {
    range: rangeOption,
    documentationByDay,
    callsByDay,
    openLoopsCompletedByDay,
    workflowCategoryDistribution,
  };
}

/** "For personal improvement only" — a rolling 7-day window, independent of the Reports Home date selector. */
export async function getPersonalProductivity(days = 7): Promise<PersonalProductivity> {
  const { loops, documentation } = await loadAll();
  const rangeStart = addDaysIso(getTodayIso(), -(days - 1));
  const rangeEnd = getTodayIso();

  const docsInRange = documentation.filter((entry) => isTimestampInRange(entry.timestamp, rangeStart, rangeEnd));
  const callsInRange = docsInRange.filter((entry) => entry.category === "patient_communication");

  const completedCount = loops.filter((loop) => loop.status === "completed").length;
  const waitingCount = loops.filter((loop) => loop.status === "waiting").length;
  const totalLoops = loops.length;

  return {
    avgDocumentationPerDay: Number((docsInRange.length / days).toFixed(1)),
    avgCallsPerDay: Number((callsInRange.length / days).toFixed(1)),
    completionRate: totalLoops === 0 ? 0 : completedCount / totalLoops,
    waitingCount,
    completedCount,
    waitingToCompletedRatio: completedCount === 0 ? null : Number((waitingCount / completedCount).toFixed(2)),
  };
}
