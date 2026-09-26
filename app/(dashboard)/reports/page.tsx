import type { Metadata } from "next";
import { ReportsHomeView } from "@/components/reports/ReportsHomeView";

export const metadata: Metadata = { title: "Reports & Analytics" };

export default function ReportsHomePage() {
  return <ReportsHomeView />;
}
