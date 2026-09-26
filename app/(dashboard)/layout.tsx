import type { ReactNode } from "react";
import { Shell } from "@/components/layout/Shell";

// app/(dashboard)/layout.tsx
// Every authenticated module (Dashboard plus every placeholder route) renders
// inside this one Shell, per the Phase 1 Foundation folder architecture.
export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <Shell>{children}</Shell>;
}
