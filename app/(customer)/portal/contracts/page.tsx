import { ContractsList } from "@/features/customer-portal/components/ContractsList";

export default function CustomerContractsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold">Contracts</h1>
        <p className="text-sm text-muted-foreground">
          View and sign your contracts
        </p>
      </div>
      <ContractsList />
    </div>
  );
}
