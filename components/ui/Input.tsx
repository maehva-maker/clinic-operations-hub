// components/ui/Input.tsx
// Labeled text input shared by every form in the app (Login, Create Open
// Loop, Quick Action modals) so label association, error display, and focus
// styling only exist in one place.

import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hideLabel?: boolean;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, id, hideLabel, error, className, ...props }, ref) => {
    const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");
    const errorId = `${inputId}-error`;

    return (
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={inputId}
          className={cn("text-sm font-medium text-accent", hideLabel && "sr-only")}
        >
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "rounded-lg border border-surface-border px-3 py-2.5 text-sm text-accent placeholder:text-accent/40 focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20",
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

Input.displayName = "Input";
