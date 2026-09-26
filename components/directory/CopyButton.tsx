"use client";

// components/directory/CopyButton.tsx
// Small icon-button used next to a contact's phone/fax/email to copy the
// value to the clipboard. Reports success/failure to the parent (which owns
// the shared Toast) rather than rendering its own notification.

import { Copy } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface CopyButtonProps {
  value: string;
  label: string;
  onCopied: (label: string, success: boolean) => void;
  className?: string;
}

export function CopyButton({ value, label, onCopied, className }: CopyButtonProps) {
  async function handleClick() {
    try {
      await navigator.clipboard.writeText(value);
      onCopied(label, true);
    } catch {
      onCopied(label, false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={`Copy ${label}`}
      className={cn(
        "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-accent/50 hover:bg-surface hover:text-secondary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40",
        className,
      )}
    >
      <Copy className="h-3.5 w-3.5" aria-hidden="true" />
    </button>
  );
}
