import type { Metadata } from "next";
import { SopHomeView } from "@/components/sop/SopHomeView";

export const metadata: Metadata = { title: "SOP & Learning Center" };

export default function SopHomePage() {
  return <SopHomeView />;
}
