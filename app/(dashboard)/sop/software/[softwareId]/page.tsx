import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SoftwareGuideView } from "@/components/sop/SoftwareGuideView";
import { SOFTWARE_GUIDES } from "@/lib/constants/sop/software-guides";
import type { SoftwareId } from "@/types";

interface SoftwareGuidePageProps {
  params: Promise<{ softwareId: string }>;
}

function isSoftwareId(value: string): value is SoftwareId {
  return SOFTWARE_GUIDES.some((guide) => guide.id === value);
}

export async function generateMetadata({ params }: SoftwareGuidePageProps): Promise<Metadata> {
  const { softwareId } = await params;
  const guide = SOFTWARE_GUIDES.find((item) => item.id === softwareId);
  return { title: guide ? `${guide.title} — SOP` : "Software Guide" };
}

export function generateStaticParams() {
  return SOFTWARE_GUIDES.map((guide) => ({ softwareId: guide.id }));
}

export default async function SoftwareGuidePage({ params }: SoftwareGuidePageProps) {
  const { softwareId } = await params;

  if (!isSoftwareId(softwareId)) {
    notFound();
  }

  return <SoftwareGuideView softwareId={softwareId} />;
}
