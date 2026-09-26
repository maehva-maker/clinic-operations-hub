import type { Metadata } from "next";
import { ProductivityDashboardView } from "@/components/reports/ProductivityDashboardView";

export const metadata: Metadata = { title: "Productivity Analytics" };

export default function ProductivityAnalyticsPage() {
  return <ProductivityDashboardView />;
}
