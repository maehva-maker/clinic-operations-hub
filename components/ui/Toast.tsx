"use client";

// components/ui/Toast.tsx
// Shared success/error notification, announced via aria-live so a screen
// reader user hears "Copied to clipboard" or "Saved to Activity Timeline"
// without focus ever moving. Used by Clinical Documentation's Copy/Save
// actions and available to any future module that needs a brief
// confirmation toast.

import { useEffect } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface ToastMessage {
  id: number;
  text: string;
  tone: "success" | "error";
}

interface ToastProps {
  toast: ToastMessage | null;
  onDismiss: () => void;
  durationMs?: number;
}

export function Toast({ toast, onDismiss, durationMs = 3000 }: ToastProps) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(onDismiss, durationMs);
    return () => clearTimeout(timer);
  }, [toast, onDismiss, durationMs]);

  if (!toast) return null;

  const Icon = toast.tone === "success" ? CheckCircle2 : XCircle;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center px-4 sm:justify-end sm:pr-6">
      <div
        role="status"
        aria-live="polite"
        className={cn(
          "pointer-events-auto flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium shadow-xl",
          toast.tone === "success"
            ? "bg-success text-white"
            : "bg-critical text-white",
        )}
      >
        <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
        {toast.text}
      </div>
    </div>
  );
}
