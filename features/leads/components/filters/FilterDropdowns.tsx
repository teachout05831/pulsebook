"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LEAD_STATUS_COLORS } from "../../types";
import type { DropdownOption } from "@/types/company";
import { defaultCustomDropdowns } from "@/types/company";

interface FilterDropdownsProps {
  assignedTo?: string;
  onAssignedToChange?: (value: string) => void;
  leadStatus?: string;
  onLeadStatusChange?: (value: string) => void;
  source?: string;
  onSourceChange?: (value: string) => void;
  search?: string;
  onSearchChange?: (value: string) => void;
  teamMembers?: Array<{ id: string; name: string }>;
  showLeadStatus?: boolean;
  showSource?: boolean;
  sourceOptions?: DropdownOption[];
  leadStatusOptions?: DropdownOption[];
}

export function FilterDropdowns({
  assignedTo,
  onAssignedToChange,
  leadStatus,
  onLeadStatusChange,
  source,
  onSourceChange,
  search,
  onSearchChange,
  teamMembers = [],
  showLeadStatus = true,
  showSource = true,
  sourceOptions,
  leadStatusOptions,
}: FilterDropdownsProps) {
  const sources = sourceOptions || defaultCustomDropdowns.sources;
  const leadStatuses = leadStatusOptions || defaultCustomDropdowns.leadStatuses;
  return (
    <div className="flex flex-col md:flex-row flex-wrap items-stretch md:items-center gap-3 w-full">
      {/* Assigned To */}
      <Select value={assignedTo || "all"} onValueChange={onAssignedToChange}>
        <SelectTrigger className="w-auto min-w-[120px] border-0 text-blue-600 hover:text-blue-700">
          <SelectValue placeholder="All Users" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Users</SelectItem>
          {teamMembers.map((member) => (
            <SelectItem key={member.id} value={member.id}>
              {member.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Lead Status */}
      {showLeadStatus && (
        <Select
          value={leadStatus || "all"}
          onValueChange={onLeadStatusChange}
        >
          <SelectTrigger className="w-auto min-w-[140px] border-0 text-slate-600 hover:text-slate-800">
            <SelectValue placeholder="Any Lead Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any Lead Status</SelectItem>
            {leadStatuses.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Source */}
      {showSource && (
        <Select value={source || "all"} onValueChange={onSourceChange}>
          <SelectTrigger className="w-auto min-w-[120px] border-0 text-slate-600 hover:text-slate-800">
            <SelectValue placeholder="Any Source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any Source</SelectItem>
            {sources.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Search */}
      <div className="ml-0 md:ml-auto relative w-full md:w-auto">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          type="text"
          placeholder="Search leads..."
          value={search || ""}
          onChange={(e) => onSearchChange?.(e.target.value)}
          className="pl-9 w-full md:w-64"
        />
      </div>
    </div>
  );
}
