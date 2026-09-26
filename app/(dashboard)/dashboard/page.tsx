"use client";

// app/(dashboard)/dashboard/page.tsx
// The Dashboard — today's workload at a glance. Per the PRD, widgets are
// ordered by urgency (top-left = most time-sensitive) and the page is
// intentionally not filterable; it's a fixed snapshot.

import {
  ListTodo,
  CalendarClock,
  CheckCircle2,
  PhoneCall,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { StatCard } from "@/components/dashboard/StatCard";
import { HighPriorityWidget } from "@/components/dashboard/HighPriorityWidget";
import { ChartPrepWidget } from "@/components/dashboard/ChartPrepWidget";
import { WeightManagementWidget } from "@/components/dashboard/WeightManagementWidget";
import { PapPendingWidget } from "@/components/dashboard/PapPendingWidget";
import { FollowUpWidget } from "@/components/dashboard/FollowUpWidget";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { useDashboardData } from "@/hooks/use-dashboard-data";
import { formatFriendlyDate } from "@/lib/utils/date";

export default function DashboardPage() {
  const { data, isLoading, error } = useDashboardData();

  if (isLoading || !data) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="rounded-card border border-critical bg-critical-light p-6 text-sm text-critical">
        {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={`Good morning, ${data.greetingName}`}
        description={formatFriendlyDate(data.today)}
        action={
          <Button variant="primary">Generate End-of-Day Report</Button>
        }
      />

      {/* 4 stat-forward cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard stat={data.stats.openTasks} icon={ListTodo} />
        <StatCard stat={data.stats.followUpsDueToday} icon={CalendarClock} />
        <StatCard stat={data.stats.completedToday} icon={CheckCircle2} />
        <StatCard stat={data.stats.callsCompleted} icon={PhoneCall} />
      </div>

      {/* 4 list-forward widgets */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <HighPriorityWidget items={data.highPriorityPatients} />
        <ChartPrepWidget items={data.tomorrowsChartPrep} />
        <WeightManagementWidget
          dueThisWeekCount={data.weightManagementFollowUps.dueThisWeekCount}
          items={data.weightManagementFollowUps.items}
        />
        <PapPendingWidget items={data.papOrdersPending} />
      </div>

      {/* Follow-ups Due Today — full width detail list beneath the summary grid */}
      <FollowUpWidget items={data.followUpsDue} />
    </div>
  );
}
