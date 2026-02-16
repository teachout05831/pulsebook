"use client";

import { useParams } from "next/navigation";
import { ContractLiveTest } from "@/features/contracts/components/ContractLiveTest";

export default function ContractLiveTestPage() {
  const params = useParams();
  return <ContractLiveTest templateId={params.id as string} />;
}
