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
import { TechnicianAvatar } from "../../shared/technician-avatar";
import type { DispatchJob, DispatchTechnician } from "@/types/dispatch";
import { cn } from "@/lib/utils";
import { statusStyles, statusLabels } from "./list-helpers";

interface ListJobRowProps {
  job: DispatchJob;
  technician: DispatchTechnician | null;
  isSelected: boolean;
  onSelect: () => void;
  onClick: () => void;
  onStatusChange: (status: DispatchJob["status"]) => void;
}

export function ListJobRow({ job, technician, isSelected, onSelect, onClick, onStatusChange }: ListJobRowProps) {
  return (
    <TableRow className="cursor-pointer hover:bg-gray-50" onClick={onClick}>
      <TableCell onClick={e => e.stopPropagation()}>
        <Checkbox checked={isSelected} onCheckedChange={onSelect} />
      </TableCell>
      <TableCell className="font-semibold text-blue-600">{job.scheduledTime || "TBD"}</TableCell>
      <TableCell>
        <div className="font-medium">{job.title}</div>
        <div className="text-sm text-gray-500">{job.customerName}</div>
      </TableCell>
      <TableCell className="text-sm text-gray-600 truncate max-w-[200px]">{job.address || "\u2014"}</TableCell>
      <TableCell>
        {technician ? (
          <div className="flex items-center gap-2">
            <TechnicianAvatar technician={technician} size="sm" />
            <span className="text-sm">{technician.name}</span>
          </div>
        ) : (
          <span className="text-sm text-gray-400">Unassigned</span>
        )}
      </TableCell>
      <TableCell onClick={e => e.stopPropagation()}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button>
              <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", statusStyles[job.status])}>
                {statusLabels[job.status]}
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {(["scheduled", "in_progress", "completed", "cancelled"] as DispatchJob["status"][]).map(status => (
              <DropdownMenuItem key={status} onClick={() => onStatusChange(status)}>
                <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", statusStyles[status])}>
                  {statusLabels[status]}
                </span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
      <TableCell className="text-sm text-gray-600">{job.estimatedDuration} min</TableCell>
      <TableCell onClick={e => e.stopPropagation()}>
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
