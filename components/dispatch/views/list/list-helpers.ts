import type { DispatchJob } from "@/types/dispatch";
import type { ColumnDefinition } from "./column-types";

export type SortOrder = "asc" | "desc";

export const statusStyles: Record<DispatchJob["status"], string> = {
  unassigned: "bg-red-100 text-red-800",
  scheduled: "bg-blue-100 text-blue-800",
  in_progress: "bg-yellow-100 text-yellow-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-gray-100 text-gray-800",
};

export const statusLabels: Record<DispatchJob["status"], string> = {
  unassigned: "Unassigned",
  scheduled: "Scheduled",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

export function sortJobsByColumn(
  jobs: DispatchJob[],
  column: ColumnDefinition | null,
  order: SortOrder,
): DispatchJob[] {
  if (!column) return jobs;
  return [...jobs].sort((a, b) => {
    const aVal = column.getValue(a);
    const bVal = column.getValue(b);
    if (aVal === null || aVal === "") return 1;
    if (bVal === null || bVal === "") return -1;
    if (aVal < bVal) return order === "asc" ? -1 : 1;
    if (aVal > bVal) return order === "asc" ? 1 : -1;
    return 0;
  });
}

export function exportJobsCSV(jobs: DispatchJob[], columns: ColumnDefinition[]) {
  const headers = columns.map((c) => c.label);
  const rows = jobs.map((job) =>
    columns.map((col) => {
      const val = col.getValue(job);
      if (col.id === "status") return statusLabels[job.status] || val;
      if (col.id === "duration") return `${val} min`;
      return val === null ? "" : String(val);
    }),
  );

  const csvContent = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `dispatch-jobs-${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
