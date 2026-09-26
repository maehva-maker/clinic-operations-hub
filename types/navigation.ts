// types/navigation.ts

import type { LucideIcon } from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Badge count shown on the right side of the nav row, e.g. escalated loops. */
  badgeCount?: number;
  /** Marks a route that isn't built yet (Phase 3 placeholder). */
  comingSoon?: boolean;
}
