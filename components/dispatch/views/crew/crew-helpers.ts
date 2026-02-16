import type { DispatchJob } from "@/types/dispatch";

export const statusStyles: Record<DispatchJob["status"], string> = {
  unassigned: "bg-red-100 border-l-red-500",
  scheduled: "bg-blue-100 border-l-blue-500",
  in_progress: "bg-amber-100 border-l-amber-500",
  completed: "bg-green-100 border-l-green-500",
  cancelled: "bg-gray-100 border-l-gray-400",
};

export const pillColors: Record<DispatchJob["status"], string> = {
  unassigned: "bg-red-100 border-red-300 text-red-800",
  scheduled: "bg-blue-100 border-blue-300 text-blue-800",
  in_progress: "bg-yellow-100 border-yellow-300 text-yellow-800",
  completed: "bg-green-100 border-green-300 text-green-800",
  cancelled: "bg-gray-100 border-gray-300 text-gray-600",
};

export function shortName(fullName: string) {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length <= 1) return fullName;
  return `${parts[0]} ${parts[parts.length - 1][0]}`;
}
