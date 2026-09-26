// components/dashboard/StatCard.tsx
// The "stat-forward" DashboardCard variant: one large number as the body.

import type { LucideIcon } from "lucide-react";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import type { DashboardStat } from "@/types";

interface StatCardProps {
  stat: DashboardStat;
  icon: LucideIcon;
}

export function StatCard({ stat, icon }: StatCardProps) {
  return (
    <DashboardCard
      title={stat.label}
      icon={icon}
      href={stat.href}
      helpText={stat.helpText}
    >
      <p className="text-3xl font-bold text-accent">{stat.value}</p>
    </DashboardCard>
  );
}
