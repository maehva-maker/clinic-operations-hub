// components/ui/Select.tsx
// Labeled native select, shared by the Open Loop filter bar and every form
// that picks from a fixed list (category, status, priority, provider...).

import { forwardRef, type SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
  hideLabel?: boolean;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, id, hideLabel, error, className, ...props }, ref) => {
    const selectId = id ?? label.toLowerCase().replace(/\s+/g, "-");
    const errorId = `${selectId}-error`;

    return (
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={selectId}
          className={cn("text-xs font-medium text-accent/70", hideLabel && "sr-only")}
        >
          {label}
        </label>
        <select
          ref={ref}
          id={selectId}
          className={cn(
            "rounded-lg border border-surface-border bg-white px-3 py-2 text-sm text-accent focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20",
            error && "border-critical focus:border-critical focus:ring-critical/20",
            className,
          )}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error ? (
          <p id={errorId} role="alert" className="text-xs text-critical">
            {error}
          </p>
        ) : null}
      </div>
    );
  },
);

Select.displayName = "Select";
