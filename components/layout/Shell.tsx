"use client";

// components/layout/Shell.tsx
// Wraps Sidebar + TopNavigation around every authenticated page. This is the
// single component the (dashboard) route group layout renders, per the
// Phase 1 Foundation folder architecture.

import { useState } from "react";
import type { ReactNode } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopNavigation } from "@/components/layout/TopNavigation";

interface ShellProps {
  children: ReactNode;
}

export function Shell({ children }: ShellProps) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-accent focus:shadow-card"
      >
        Skip to main content
      </a>
      <TopNavigation onOpenMobileMenu={() => setIsMobileNavOpen(true)} />
      <div className="flex flex-1">
        <Sidebar
          isMobileOpen={isMobileNavOpen}
          onCloseMobile={() => setIsMobileNavOpen(false)}
        />
        <main
          id="main-content"
          tabIndex={-1}
          className="min-w-0 flex-1 px-4 py-6 outline-none sm:px-6 lg:px-8"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
