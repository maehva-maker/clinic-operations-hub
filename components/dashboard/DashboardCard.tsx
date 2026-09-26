// components/dashboard/DashboardCard.tsx
// Generic dashboard widget container. Two variants share one outer shell:
// "stat" (a big number) and "list" (a short preview list) — see the Design
// System's Dashboard Card spec in claude/phase2-wireframes.md.

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { ReactNode } from "react";

interface DashboardCardProps {
  title: string;
  icon: LucideIcon;
  href: string;
  children: ReactNode;
  helpText?: string;
  className?: string;
}

export function DashboardCard({
  title,
  icon: Icon,
  href,
  children,
  helpText,
  className,
}: DashboardCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-card border border-surface-border bg-white p-5 shadow-card",
        className,
      )}
    >
      <div className="flex items-center gap-2 text-accent/60">
        <Icon className="h-4 w-4" aria-hidden="true" />
        <h2 className="text-sm font-medium">{title}</h2>
      </div>

      <div className="mt-3 flex-1">{children}</div>

      <div className="mt-4 flex items-center justify-between border-t border-surface-border pt-3">
        {helpText ? (
          <span className="text-xs text-accent/50">{helpText}</span>
        ) : (
          <span />
        )}
        <Link
          href={href}
          aria-label={`View all: ${title}`}
          className="flex items-center gap-1 text-xs font-semibold text-secondary-dark hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40 rounded"
        >
          View All
          <ArrowRight className="h-3 w-3" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
