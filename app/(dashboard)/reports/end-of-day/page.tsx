import type { Metadata } from "next";
import { EndOfDayReportView } from "@/components/reports/EndOfDayReportView";

export const metadata: Metadata = { title: "End-of-Day Report" };

export default function EndOfDayReportPage() {
  return <EndOfDayReportView />;
}
