import type { DispatchJob } from "@/types/dispatch";

export const statusColors: Record<DispatchJob["status"], string> = {
  unassigned: "bg-red-500",
  scheduled: "bg-blue-500",
  in_progress: "bg-yellow-500",
  completed: "bg-green-500",
  cancelled: "bg-gray-400",
};

export const statusBgColors: Record<DispatchJob["status"], string> = {
  unassigned: "bg-red-50 border-red-200",
  scheduled: "bg-blue-50 border-blue-200",
  in_progress: "bg-yellow-50 border-yellow-200",
  completed: "bg-green-50 border-green-200",
  cancelled: "bg-gray-50 border-gray-200",
};
