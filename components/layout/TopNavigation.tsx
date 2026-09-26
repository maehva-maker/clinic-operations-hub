"use client";

// components/layout/TopNavigation.tsx
// Persistent top bar: mobile hamburger, wordmark, global search, today's
// date, notifications, settings shortcut, user menu. Height is fixed across
// every page. Phase 10: global search and notifications are now real
// (services/search.service.ts, services/notifications.service.ts), and the
// user menu is a working account menu instead of an inert icon.

import Link from "next/link";
import { Menu, Moon, Settings as SettingsIcon } from "lucide-react";
import { GlobalSearch } from "@/components/layout/GlobalSearch";
import { NotificationsPanel } from "@/components/layout/NotificationsPanel";
import { UserMenu } from "@/components/auth/UserMenu";

interface TopNavigationProps {
  onOpenMobileMenu: () => void;
}

export function TopNavigation({ onOpenMobileMenu }: TopNavigationProps) {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b border-surface-border bg-white px-4 sm:px-6">
      <button
        type="button"
        onClick={onOpenMobileMenu}
        className="rounded-md p-2 text-accent/60 hover:bg-surface md:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <Link href="/dashboard" className="flex shrink-0 items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
          <Moon className="h-4 w-4" aria-hidden="true" />
        </span>
        <span className="hidden text-sm font-bold text-accent sm:inline">
          Clinic Operations Hub
        </span>
      </Link>

      <div className="mx-auto hidden max-w-md flex-1 md:block">
        <GlobalSearch />
      </div>

      <div className="ml-auto flex items-center gap-1 sm:gap-2">
        <span className="hidden text-sm text-accent/60 sm:inline">{today}</span>
        <NotificationsPanel />
        <Link
          href="/settings"
          className="rounded-md p-2 text-accent/60 hover:bg-surface"
          aria-label="Settings"
        >
          <SettingsIcon className="h-5 w-5" />
        </Link>
        <UserMenu />
      </div>
    </header>
  );
}
