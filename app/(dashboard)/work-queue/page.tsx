import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/shared/PlaceholderPage";

export const metadata: Metadata = { title: "Daily Work Queue" };

export default function DailyWorkQueuePage() {
  return (
    <PlaceholderPage
      title="Daily Work Queue"
      description="Today's assignments only, in time order."
      phase="a later phase"
    />
  );
}
