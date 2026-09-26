// components/ui/Checkbox.tsx
// Labeled checkbox, styled to match Input/Select — used for boolean template
// fields such as "Callback requested".

import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, id, className, ...props }, ref) => {
    const checkboxId = id ?? label.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex items-center gap-2">
        <input
          ref={ref}
          id={checkboxId}
          type="checkbox"
          className={cn(
            "h-4 w-4 rounded border-surface-border text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40",
            className,
          )}
          {...props}
        />
        <label htmlFor={checkboxId} className="text-sm font-medium text-accent">
          {label}
        </label>
      </div>
    );
  },
);

Checkbox.displayName = "Checkbox";
