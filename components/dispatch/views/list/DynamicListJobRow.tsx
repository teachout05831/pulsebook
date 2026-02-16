"use client";

import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import type { DispatchJob, DispatchTechnician } from "@/types/dispatch";
import type { ColumnDefinition } from "./column-types";
import { CellRenderer } from "./CellRenderer";
import { statusStyles, statusLabels } from "./list-helpers";
import { cn } from "@/lib/utils";

interface DynamicListJobRowProps {
  job: DispatchJob;
  columns: ColumnDefinition[];
  technician: DispatchTechnician | null;
  isSelected: boolean;
  onSelect: () => void;
  onClick: () => void;
  onStatusChange: (status: DispatchJob["status"]) => void;
}

export function DynamicListJobRow({
  job, columns, technician, isSelected, onSelect, onClick, onStatusChange,
}: DynamicListJobRowProps) {
  return (
    <TableRow className="cursor-pointer hover:bg-gray-50" onClick={onClick}>
      {/* Fixed: Checkbox column */}
      <TableCell className="w-[50px]" onClick={(e) => e.stopPropagation()}>
        <Checkbox checked={isSelected} onCheckedChange={onSelect} />
      </TableCell>

      {/* Dynamic columns */}
      {columns.map((col) => {
        // Status column gets the dropdown behavior
        if (col.id === "status") {
          return (
            <TableCell key={col.id} className={col.width} onClick={(e) => e.stopPropagation()}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button>
                    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", statusStyles[job.status])}>
                      {statusLabels[job.status]}
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {(["scheduled", "in_progress", "completed", "cancelled"] as DispatchJob["status"][]).map((s) => (
                    <DropdownMenuItem key={s} onClick={() => onStatusChange(s)}>
                      <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", statusStyles[s])}>
                        {statusLabels[s]}
                      </span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          );
        }

        return (
          <TableCell key={col.id} className={cn(col.width, col.minWidth)}>
            <CellRenderer column={col} job={job} technician={technician} />
          </TableCell>
        );
      })}

      {/* Fixed: Actions column */}
      <TableCell className="w-[50px]" onClick={(e) => e.stopPropagation()}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onClick}>View Details</DropdownMenuItem>
            <DropdownMenuItem>Edit Job</DropdownMenuItem>
            <DropdownMenuItem>Reassign</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
