"use client";

import { use } from "react";
import { TechJobDetail } from "@/features/tech-portal";

interface Props {
  params: Promise<{ id: string }>;
}

export default function TechJobDetailPage({ params }: Props) {
  const { id } = use(params);
  return <TechJobDetail jobId={id} />;
}
