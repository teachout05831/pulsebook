import type { EstimateDetail } from "@/types/estimate";

export interface LifecycleStep {
  key: string;
  label: string;
  state: "done" | "active" | "pending";
}

export function computeLifecycleSteps(estimate: EstimateDetail): LifecycleStep[] {
  const status = estimate.status;
  const isSent = status === "sent" || status === "approved";
  const isApproved = status === "approved";

  const steps: LifecycleStep[] = [
    { key: "draft", label: "Draft", state: isSent ? "done" : "pending" },
    { key: "sent", label: "Sent", state: isApproved ? "done" : isSent ? "pending" : "pending" },
    { key: "approved", label: "Approved", state: isApproved ? "done" : "pending" },
  ];

  // Mark the first "pending" step as "active"
  const firstPending = steps.findIndex((s) => s.state === "pending");
  if (firstPending >= 0) {
    steps[firstPending] = { ...steps[firstPending], state: "active" };
  }

  return steps;
}
