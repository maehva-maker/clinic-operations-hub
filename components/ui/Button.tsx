// components/ui/Button.tsx
// Shared button with the 4-tier hierarchy from the Design System: primary,
// secondary, tertiary (text), and destructive. Never more than one primary
// button should be visible in the same view — see phase2-wireframes.md.

import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

type ButtonVariant = "primary" | "secondary" | "tertiary" | "destructive";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-white hover:bg-primary-dark focus-visible:ring-primary/40",
  secondary:
    "border border-secondary text-secondary-dark bg-white hover:bg-secondary-light focus-visible:ring-secondary/40",
  tertiary:
    "text-secondary-dark hover:bg-secondary-light/60 focus-visible:ring-secondary/30",
  destructive:
    "border border-critical text-critical bg-white hover:bg-critical-light focus-visible:ring-critical/40",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", className, type = "button", ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          VARIANT_STYLES[variant],
          className,
        )}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";
