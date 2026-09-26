// lib/constants/navigation.ts
// Single source of truth for Sidebar navigation, per the Phase 1 Foundation
// IA: 7 primary modules above a divider, 3 secondary quick links below it.
// Routes not yet built in Phase 3 are flagged `comingSoon` and render a
// placeholder page rather than a 404.

import {
  LayoutDashboard,
  ListChecks,
  CalendarCheck2,
  PhoneCall,
  FileText,
  Wand2,
  BookOpen,
  Settings as SettingsIcon,
  Users,
  Building2,
  ClipboardList,
} from "lucide-react";
import type { NavItem } from "@/types";

export const PRIMARY_NAV: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  {
    label: "Open Loop Tracker",
    href: "/open-loops",
    icon: ListChecks,
  },
  {
    label: "Daily Work Queue",
    href: "/work-queue",
    icon: CalendarCheck2,
    comingSoon: true,
  },
  { label: "Call Log", href: "/call-log", icon: PhoneCall, comingSoon: true },
  {
    label: "Clinical Documentation",
    href: "/clinical-documentation",
    icon: FileText,
  },
  {
    label: "Workflow Wizard",
    href: "/workflow-wizard",
    icon: Wand2,
  },
  {
    label: "SOP & Learning Center",
    href: "/sop",
    icon: BookOpen,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: SettingsIcon,
    comingSoon: true,
  },
];

export const SECONDARY_NAV: NavItem[] = [
  { label: "Patients", href: "/patients", icon: Users },
  {
    label: "Clinic Directory",
    href: "/directory",
    icon: Building2,
  },
  {
    label: "Reports",
    href: "/reports",
    icon: ClipboardList,
  },
];
