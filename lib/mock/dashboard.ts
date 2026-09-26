// lib/mock/dashboard.ts
// Mock data standing in for a real Supabase query. Shaped exactly like
// DashboardData (types/dashboard.ts) so swapping this out later for a real
// services/dashboard.service.ts implementation requires no changes to any
// component that consumes the data.

import type { DashboardData } from "@/types";

export const MOCK_DASHBOARD_DATA: DashboardData = {
  greetingName: "Mae",
  today: new Date().toISOString().slice(0, 10),
  stats: {
    openTasks: {
      id: "open-tasks",
      label: "Open Tasks",
      value: 7,
      href: "/work-queue",
      helpText: "In today's Work Queue",
    },
    followUpsDueToday: {
      id: "followups-due-today",
      label: "Follow-ups Due Today",
      value: 4,
      href: "/open-loops",
      helpText: "Across both domains",
    },
    completedToday: {
      id: "completed-today",
      label: "Completed Today",
      value: 5,
      href: "/work-queue",
      helpText: "Tasks marked done",
    },
    callsCompleted: {
      id: "calls-completed",
      label: "Calls Completed",
      value: 8,
      href: "/call-log",
      helpText: "Logged today",
    },
  },
  highPriorityPatients: [
    {
      id: "hp-1",
      patientName: "J. Alvarez",
      reason: "PAP order — prior authorization due",
      priority: "high",
      href: "/open-loops",
    },
    {
      id: "hp-2",
      patientName: "M. Torres",
      reason: "Sleep study — escalated, overdue",
      priority: "urgent",
      href: "/open-loops",
    },
    {
      id: "hp-3",
      patientName: "R. Chen",
      reason: "Referral — awaiting ROI signature",
      priority: "high",
      href: "/open-loops",
    },
  ],
  tomorrowsChartPrep: [
    { id: "cp-1", patientName: "R. Chen", appointmentTime: "9:00 AM", href: "/open-loops" },
    { id: "cp-2", patientName: "L. Kim", appointmentTime: "10:30 AM", href: "/open-loops" },
    { id: "cp-3", patientName: "D. Patel", appointmentTime: "1:15 PM", href: "/open-loops" },
  ],
  weightManagementFollowUps: {
    dueThisWeekCount: 3,
    items: [
      { id: "wf-1", patientName: "S. Nguyen", dueDate: "2026-09-28", href: "/open-loops" },
      { id: "wf-2", patientName: "K. Brooks", dueDate: "2026-09-29", href: "/open-loops" },
      { id: "wf-3", patientName: "A. Whitfield", dueDate: "2026-09-30", href: "/open-loops" },
    ],
  },
  papOrdersPending: [
    { id: "pap-1", patientName: "J. Alvarez", status: "Awaiting authorization", href: "/open-loops" },
    { id: "pap-2", patientName: "T. Osei", status: "Submitted to NLM", href: "/open-loops" },
  ],
  followUpsDue: [
    {
      id: "fu-1",
      patientName: "J. Alvarez",
      category: "PAP Order",
      domain: "sleep_medicine",
      waitingOn: "insurance",
      dueDate: "2026-09-26",
      href: "/open-loops",
    },
    {
      id: "fu-2",
      patientName: "M. Torres",
      category: "Sleep Study",
      domain: "sleep_medicine",
      waitingOn: "dream_sleep",
      dueDate: "2026-09-26",
      href: "/open-loops",
    },
    {
      id: "fu-3",
      patientName: "S. Nguyen",
      category: "GLP-1 Prior Authorization",
      domain: "weight_management",
      waitingOn: "insurance",
      dueDate: "2026-09-26",
      href: "/open-loops",
    },
    {
      id: "fu-4",
      patientName: "R. Chen",
      category: "Referral",
      domain: "sleep_medicine",
      waitingOn: "patient",
      dueDate: "2026-09-26",
      href: "/open-loops",
    },
  ],
};
