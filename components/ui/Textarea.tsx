// components/ui/Textarea.tsx
// Labeled multi-line input, styled to match Input.tsx exactly.

import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  hideLabel?: boolean;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, id, hideLabel, error, className, rows = 3, ...props }, ref) => {
    const textareaId = id ?? label.toLowerCase().replace(/\s+/g, "-");
    const errorId = `${textareaId}-error`;

    return (
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={textareaId}
          className={cn("text-sm font-medium text-accent", hideLabel && "sr-only")}
        >
          {label}
        </label>
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          className={cn(
            "resize-y rounded-lg border border-surface-border px-3 py-2.5 text-sm text-accent placeholder:text-accent/40 focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20",
            error && "border-critical focus:border-critical focus:ring-critical/20",
            className,
          )}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          {...props}
        />
        {error ? (
          <p id={errorId} role="alert" className="text-xs text-critical">
            {error}
          </p>
        ) : null}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";
