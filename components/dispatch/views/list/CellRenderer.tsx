"use client";

import { TechnicianAvatar } from "../../shared/technician-avatar";
import type { DispatchJob, DispatchTechnician } from "@/types/dispatch";
import type { ColumnDefinition } from "./column-types";
import { statusStyles, statusLabels } from "./list-helpers";
import { cn } from "@/lib/utils";

const PRIORITY_STYLES: Record<string, string> = {
  low: "bg-gray-100 text-gray-700",
  normal: "bg-blue-50 text-blue-700",
  high: "bg-orange-100 text-orange-800",
  urgent: "bg-red-100 text-red-800",
};

interface CellRendererProps {
  column: ColumnDefinition;
  job: DispatchJob;
  technician: DispatchTechnician | null;
}

export function CellRenderer({ column, job, technician }: CellRendererProps) {
  switch (column.renderType) {
    case "jobCustomer":
      return (
        <div>
          <div className="font-medium">{job.title}</div>
          <div className="text-sm text-gray-500">{job.customerName}</div>
        </div>
      );

    case "technician":
      return technician ? (
        <div className="flex items-center gap-2">
          <TechnicianAvatar technician={technician} size="sm" />
          <span className="text-sm">{technician.name}</span>
        </div>
      ) : (
        <span className="text-sm text-gray-400">Unassigned</span>
      );

    case "status":
      return (
        <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", statusStyles[job.status])}>
          {statusLabels[job.status]}
        </span>
      );

    case "duration":
      return <span className="text-sm text-gray-600">{job.estimatedDuration} min</span>;

    case "priority":
      return (
        <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize", PRIORITY_STYLES[job.priority] || PRIORITY_STYLES.normal)}>
          {job.priority}
        </span>
      );

    case "crew":
      return job.assignedCrewName
        ? <span className="text-sm">{job.assignedCrewName}</span>
        : <span className="text-sm text-gray-400">&mdash;</span>;

    case "text":
    default: {
      const value = column.getValue(job);
      const display = value === null || value === "" ? "\u2014" : String(value);
      return <span className="text-sm text-gray-600 truncate block">{display}</span>;
    }
  }
}
