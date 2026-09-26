import type { Metadata } from "next";
import { Suspense } from "react";
import { OpenLoopTrackerView } from "@/components/open-loops/OpenLoopTrackerView";

export const metadata: Metadata = { title: "Open Loop Tracker" };

export default function OpenLoopTrackerPage() {
  return (
    <Suspense fallback={<p className="text-sm text-accent/50">Loading open loops…</p>}>
      <OpenLoopTrackerView />
    </Suspense>
  );
}
