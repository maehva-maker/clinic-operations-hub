// lib/utils/cn.ts
// Tailwind-aware class merge helper used by every component that accepts a
// `className` override, so consumer classes always win over defaults.

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
