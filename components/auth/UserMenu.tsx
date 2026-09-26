"use client";

// components/auth/UserMenu.tsx
// Replaces the inert UserCircle button in the Top Navigation with a real
// account menu: shows the signed-in email and a working Sign Out, using the
// same visual slot the button already occupied.

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useCurrentUser } from "@/hooks/use-current-user";
import { signOut } from "@/services/auth.service";

export function UserMenu() {
  const router = useRouter();
  const { user } = useCurrentUser();
  const [isOpen, setIsOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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

  async function handleSignOut() {
    setIsSigningOut(true);
    try {
      await signOut();
      router.push("/login");
      router.refresh();
    } finally {
      setIsSigningOut(false);
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        className="rounded-md p-2 text-accent/60 hover:bg-surface"
        aria-label="User menu"
      >
        <UserCircle className="h-6 w-6" />
      </button>

      {isOpen ? (
        <div
          role="menu"
          className={cn(
            "absolute right-0 top-full z-40 mt-2 w-56 rounded-lg border border-surface-border bg-white p-1.5 shadow-xl",
          )}
        >
          <div className="border-b border-surface-border px-2.5 py-2">
            <p className="truncate text-xs font-medium text-accent/50">Signed in as</p>
            <p className="truncate text-sm font-semibold text-accent">{user?.email ?? "…"}</p>
          </div>
          <button
            type="button"
            role="menuitem"
            onClick={() => void handleSignOut()}
            disabled={isSigningOut}
            className="mt-1 flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm font-medium text-critical hover:bg-critical-light disabled:opacity-50"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            {isSigningOut ? "Signing out…" : "Sign Out"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
