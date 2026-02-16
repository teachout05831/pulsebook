import { Suspense } from "react";
import { CreateEstimateForm } from "@/features/estimates/components/CreateEstimateForm";

export default function NewEstimatePage() {
  return (
    <Suspense>
      <CreateEstimateForm />
    </Suspense>
  );
}
