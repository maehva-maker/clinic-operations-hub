"use client";

// components/layout/NotificationsPanel.tsx
// Phase 10 NEW FEATURE — Notifications Center. A bell button + dropdown panel
// in the Top Navigation showing what's computed by
// services/notifications.service.ts: follow-ups due today, overdue open
// loops, waiting-on-insurance/patient loops, and recent documentation.

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { formatTimelineTimestamp } from "@/lib/utils/date";
import { getNotifications, type AppNotification, type NotificationKind } from "@/services/notifications.service";

const KIND_LABEL: Record<NotificationKind, string> = {
  follow_up_due_today: "Due Today",
  overdue_open_loop: "Overdue",
  waiting_insurance: "Waiting on Insurance",
  waiting_patient: "Waiting on Patient",
  recent_documentation: "Documentation",
};

const KIND_TONE: Record<NotificationKind, string> = {
  follow_up_due_today: "bg-warning-light text-warning-dark",
  overdue_open_loop: "bg-critical-light text-critical",
  waiting_insurance: "bg-secondary-light text-secondary-dark",
  waiting_patient: "bg-secondary-light text-secondary-dark",
  recent_documentation: "bg-surface text-accent/60",
};

export function NotificationsPanel() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    getNotifications()
      .then((items) => {
        if (isMounted) setNotifications(items);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  function handleSelect(notification: AppNotification) {
    setIsOpen(false);
    router.push(notification.href);
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="relative rounded-md p-2 text-accent/60 hover:bg-surface"
        aria-label="Notifications"
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        <Bell className="h-5 w-5" />
        {notifications.length > 0 ? (
          <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-critical px-1 text-[10px] font-semibold text-white">
            {notifications.length > 9 ? "9+" : notifications.length}
          </span>
        ) : null}
      </button>

      {isOpen ? (
        <div
          role="menu"
          className="absolute right-0 top-full z-40 mt-2 max-h-96 w-80 overflow-y-auto rounded-lg border border-surface-border bg-white p-2 shadow-xl"
        >
          <p className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wide text-accent/40">
            Notifications
          </p>
          {isLoading ? (
            <p className="px-2 py-3 text-sm text-accent/50">Loading…</p>
          ) : notifications.length === 0 ? (
            <p className="px-2 py-3 text-sm text-accent/50">You&rsquo;re all caught up.</p>
          ) : (
            notifications.map((notification) => (
              <button
                key={notification.id}
                type="button"
                onClick={() => handleSelect(notification)}
                className="flex w-full flex-col gap-1 rounded-md px-2 py-2 text-left hover:bg-surface"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-accent">{notification.title}</span>
                  <span
                    className={cn(
                      "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold",
                      KIND_TONE[notification.kind],
                    )}
                  >
                    {KIND_LABEL[notification.kind]}
                  </span>
                </div>
                <p className="text-xs text-accent/60">{notification.detail}</p>
                <time dateTime={notification.timestamp} className="text-[11px] text-accent/40">
                  {formatTimelineTimestamp(notification.timestamp)}
                </time>
              </button>
            ))
          )}
        </div>
      ) : null}
    </div>
  );
}
