// lib/utils/date.ts
// Small formatting helpers so date display is consistent across the app.

export function formatFriendlyDate(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00`);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export function formatShortDate(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00`);
  return date.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
  });
}

export function getTodayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export function formatTimelineTimestamp(isoDateTime: string): string {
  const date = new Date(isoDateTime);
  return date.toLocaleString("en-US", {
    month: "2-digit",
    day: "2-digit",
    hour: "numeric",
    minute: "2-digit",
  });
}

/** Adds (or subtracts, with a negative n) days to an ISO date, returning an ISO date. */
export function addDaysIso(isoDate: string, n: number): string {
  const date = new Date(`${isoDate}T00:00:00`);
  date.setDate(date.getDate() + n);
  return date.toISOString().slice(0, 10);
}

export function getYesterdayIso(): string {
  return addDaysIso(getTodayIso(), -1);
}

export function getTomorrowIso(): string {
  return addDaysIso(getTodayIso(), 1);
}

/** True when an ISO datetime's date portion falls within [startDate, endDate], inclusive. */
export function isTimestampInRange(isoDateTime: string, startDate: string, endDate: string): boolean {
  const date = isoDateTime.slice(0, 10);
  return date >= startDate && date <= endDate;
}

export type DueDateBucket = "none" | "overdue" | "today" | "this_week" | "later";

export function getDueDateBucket(dueDate: string | null): DueDateBucket {
  if (!dueDate) return "none";

  const today = getTodayIso();
  if (dueDate < today) return "overdue";
  if (dueDate === today) return "today";

  const weekFromNow = new Date();
  weekFromNow.setDate(weekFromNow.getDate() + 7);
  const weekFromNowIso = weekFromNow.toISOString().slice(0, 10);

  return dueDate <= weekFromNowIso ? "this_week" : "later";
}
