import Link from "next/link";
import type { ReactNode } from "react";

// components/dashboard/WidgetListRow.tsx
// The one row pattern every dashboard list-widget (High Priority, Chart
// Prep, PAP Pending, Weight Management, Follow-ups) was each re-implementing
// separately. Extracted here so that pattern exists in exactly one place.

interface WidgetListRowProps {
  href: string;
  label: string;
  primaryText: string;
  secondaryText?: string;
  trailing?: ReactNode;
}

export function WidgetListRow({
  href,
  label,
  primaryText,
  secondaryText,
  trailing,
}: WidgetListRowProps) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="flex items-center justify-between gap-3 rounded-lg px-2 py-1.5 -mx-2 hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40"
    >
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-accent">{primaryText}</p>
        {secondaryText ? (
          <p className="truncate text-xs text-accent/60">{secondaryText}</p>
        ) : null}
      </div>
      {trailing ? <div className="shrink-0">{trailing}</div> : null}
    </Link>
  );
}
