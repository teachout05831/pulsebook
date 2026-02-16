import { Suspense } from "react";
import { EstimatesListWithTabs } from "@/features/estimates/components/EstimatesListWithTabs";

export default function EstimatesPage() {
  return (
    <Suspense>
      <EstimatesListWithTabs />
    </Suspense>
  );
}
