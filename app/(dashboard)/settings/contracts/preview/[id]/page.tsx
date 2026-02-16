"use client";

import { useParams } from "next/navigation";
import { ContractTemplatePreview } from "@/features/contracts/components/ContractTemplatePreview";

export default function ContractTemplatePreviewPage() {
  const params = useParams();
  return <ContractTemplatePreview templateId={params.id as string} />;
}
