"use client";

// components/layout/Sidebar.tsx
// Primary navigation, responsive across all three breakpoints in the Design
// System (phase2-wireframes.md): a full labeled rail at desktop (lg, 1024px+),
// an icon-only collapsed rail at tablet (md, 768–1023px) so a persistent nav
// is never lost on an iPad-width screen, and a slide-out drawer at mobile
// (below md), opened via TopNavigation's hamburger button. 7 primary modules
// above a divider, 3 secondary quick links below it, per the Phase 1
// Foundation IA.

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { PRIMARY_NAV, SECONDARY_NAV } from "@/lib/constants/navigation";
import type { NavItem } from "@/types";

interface SidebarProps {
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

function NavRow({
  item,
  isActive,
  collapseLabelBelowLg = false,
}: {
  item: NavItem;
  isActive: boolean;
  /** Icon-only at md (tablet rail), full label restored at lg (desktop). */
  collapseLabelBelowLg?: boolean;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      title={collapseLabelBelowLg ? item.label : undefined}
      aria-label={item.label}
      className={cn(
        "group flex items-center rounded-lg border-l-4 border-transparent py-2.5 text-sm font-medium transition-colors",
        collapseLabelBelowLg
          ? "justify-center px-2 lg:justify-between lg:px-3"
          : "justify-between px-3",
        isActive
          ? "border-l-primary bg-primary-light text-primary-dark"
          : "text-accent/70 hover:bg-surface hover:text-accent",
      )}
    >
      <span
        className={cn(
          "flex items-center",
          collapseLabelBelowLg ? "gap-0 lg:gap-3" : "gap-3",
        )}
      >
        <Icon
          className={cn(
            "h-4 w-4 shrink-0",
            isActive ? "text-primary-dark" : "text-accent/40 group-hover:text-accent/70",
          )}
          aria-hidden="true"
        />
        <span className={collapseLabelBelowLg ? "hidden lg:inline" : undefined}>
          {item.label}
        </span>
      </span>
      {typeof item.badgeCount === "number" && item.badgeCount > 0 ? (
        <span
          className={cn(
            "h-5 min-w-5 items-center justify-center rounded-pill bg-critical px-1.5 text-xs font-semibold text-white",
            collapseLabelBelowLg ? "hidden lg:flex" : "flex",
          )}
        >
          {item.badgeCount}
        </span>
      ) : null}
    </Link>
  );
}

function SidebarContent({
  collapseLabelBelowLg = false,
}: {
  collapseLabelBelowLg?: boolean;
}) {
  const pathname = usePathname();

  return (
    <nav className="flex h-full flex-col gap-6 overflow-y-auto px-3 py-6">
      <div className="flex flex-col gap-1">
        {PRIMARY_NAV.map((item) => (
          <NavRow
            key={item.href}
            item={item}
            isActive={pathname === item.href || pathname.startsWith(`${item.href}/`)}
            collapseLabelBelowLg={collapseLabelBelowLg}
          />
        ))}
      </div>
      <div className="flex flex-col gap-1 border-t border-surface-border pt-4">
        {SECONDARY_NAV.map((item) => (
          <NavRow
            key={item.href}
            item={item}
            isActive={pathname === item.href || pathname.startsWith(`${item.href}/`)}
            collapseLabelBelowLg={collapseLabelBelowLg}
          />
        ))}
      </div>
    </nav>
  );
}

export function Sidebar({ isMobileOpen, onCloseMobile }: SidebarProps) {
  useEffect(() => {
    if (!isMobileOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onCloseMobile();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobileOpen, onCloseMobile]);

  return (
    <>
      {/* Tablet (md, 768–1023px): icon-only collapsed rail — still a
          persistent nav, never dropped down to a drawer, per the Design
          System's "Sidebar collapsible to icon-only" tablet behavior.
          Desktop (lg, 1024px+): full labeled rail. */}
      <aside className="hidden shrink-0 border-r border-surface-border bg-white md:block md:w-16 lg:w-64">
        <SidebarContent collapseLabelBelowLg />
      </aside>

      {/* Mobile (below md): slide-out drawer */}
      {isMobileOpen ? (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-accent/40"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            className="relative z-50 flex h-full w-72 max-w-[80vw] flex-col bg-white shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-surface-border px-4 py-4">
              <span className="text-sm font-semibold text-accent">Menu</span>
              <button
                type="button"
                onClick={onCloseMobile}
                className="rounded-md p-1.5 text-accent/60 hover:bg-surface"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <SidebarContent />
          </div>
        </div>
      ) : null}
    </>
  );
}
