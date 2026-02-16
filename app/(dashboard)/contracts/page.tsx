"use client";

import { ContractsList } from "@/features/contracts/components/ContractsList";

export default function ContractsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Contracts</h1>
      <ContractsList />
    </div>
  );
}
