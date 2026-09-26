// types/dashboard.ts
// Shapes consumed by the Dashboard page and its widgets. In Phase 3 these
// are populated by lib/mock/dashboard.ts via services/dashboard.service.ts;
// the service boundary is what lets a future phase swap the mock for a real
// Supabase query without touching any component.

import type { TaskPriority, WaitingOnType, WorkflowDomain } from "./shared";

export interface DashboardStat {
  id: string;
  label: string;
  value: number;
  href: string;
  helpText?: string;
}

export interface HighPriorityPatientItem {
  id: string;
  patientName: string;
  reason: string;
  priority: TaskPriority;
  href: string;
}

export interface FollowUpDueItem {
  id: string;
  patientName: string;
  category: string;
  domain: WorkflowDomain;
  waitingOn: WaitingOnType | null;
  dueDate: string; // ISO date
  href: string;
}

export interface ChartPrepItem {
  id: string;
  patientName: string;
  appointmentTime: string; // "9:00 AM"
  href: string;
}

export interface PapOrderPendingItem {
  id: string;
  patientName: string;
  status: string;
  href: string;
}

export interface WeightFollowUpItem {
  id: string;
  patientName: string;
  dueDate: string; // ISO date
  href: string;
}

export interface DashboardData {
  greetingName: string;
  today: string; // ISO date
  stats: {
    openTasks: DashboardStat;
    followUpsDueToday: DashboardStat;
    completedToday: DashboardStat;
    callsCompleted: DashboardStat;
  };
  highPriorityPatients: HighPriorityPatientItem[];
  tomorrowsChartPrep: ChartPrepItem[];
  weightManagementFollowUps: {
    dueThisWeekCount: number;
    items: WeightFollowUpItem[];
  };
  papOrdersPending: PapOrderPendingItem[];
  followUpsDue: FollowUpDueItem[];
}
