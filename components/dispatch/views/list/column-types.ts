import type { DispatchJob } from "@/types/dispatch";
import type { CustomFieldDefinition } from "@/features/custom-fields/types";
export { DEFAULT_COLUMN_IDS } from "@/types/list-view";

export type RenderType = "text" | "badge" | "technician" | "status" | "duration" | "priority" | "jobCustomer" | "crew";

export interface ColumnDefinition {
  id: string;
  label: string;
  category: "core" | "custom";
  width?: string; // Tailwind width class or px value
  minWidth?: string;
  sortable: boolean;
  renderType: RenderType;
  getValue: (job: DispatchJob) => string | number | null;
}

export const CORE_COLUMNS: ColumnDefinition[] = [
  {
    id: "scheduledTime", label: "Time", category: "core",
    width: "w-[90px]", sortable: true, renderType: "text",
    getValue: (j) => j.scheduledTime || "TBD",
  },
  {
    id: "jobCustomer", label: "Job / Customer", category: "core",
    minWidth: "min-w-[180px]", sortable: true, renderType: "jobCustomer",
    getValue: (j) => j.customerName,
  },
  {
    id: "address", label: "Address", category: "core",
    minWidth: "min-w-[140px]", sortable: true, renderType: "text",
    getValue: (j) => j.address || "\u2014",
  },
  {
    id: "technician", label: "Technician", category: "core",
    width: "w-[160px]", sortable: true, renderType: "technician",
    getValue: (j) => j.assignedTechnicianName || "",
  },
  {
    id: "status", label: "Status", category: "core",
    width: "w-[120px]", sortable: true, renderType: "status",
    getValue: (j) => j.status,
  },
  {
    id: "duration", label: "Duration", category: "core",
    width: "w-[90px]", sortable: true, renderType: "duration",
    getValue: (j) => j.estimatedDuration,
  },
  {
    id: "priority", label: "Priority", category: "core",
    width: "w-[100px]", sortable: true, renderType: "priority",
    getValue: (j) => j.priority,
  },
  {
    id: "crew", label: "Crew", category: "core",
    width: "w-[140px]", sortable: true, renderType: "crew",
    getValue: (j) => j.assignedCrewName || "",
  },
  {
    id: "scheduledDate", label: "Date", category: "core",
    width: "w-[100px]", sortable: true, renderType: "text",
    getValue: (j) => j.scheduledDate,
  },
  {
    id: "notes", label: "Notes", category: "core",
    minWidth: "min-w-[120px]", sortable: false, renderType: "text",
    getValue: (j) => j.notes || "",
  },
];

export function customFieldToColumn(def: CustomFieldDefinition): ColumnDefinition {
  return {
    id: `cf_${def.fieldKey}`,
    label: def.label,
    category: "custom",
    width: "w-[140px]",
    sortable: true,
    renderType: "text",
    getValue: (job) => {
      const val = job.customFields?.[def.fieldKey];
      if (val === null || val === undefined) return "";
      if (typeof val === "boolean") return val ? "Yes" : "No";
      return String(val);
    },
  };
}

export function getColumnById(columns: ColumnDefinition[], id: string): ColumnDefinition | undefined {
  return columns.find((c) => c.id === id);
}
