import { EstimatesList } from "@/features/customer-portal/components/EstimatesList";

export default function CustomerEstimatesPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold">Estimates</h1>
        <p className="text-sm text-muted-foreground">
          View your estimates and proposals
        </p>
      </div>
      <EstimatesList />
    </div>
  );
}
