"use client";

import { Loader2, UserPlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BulkActionBarProps {
  selectedCount: number;
  assignTo: string;
  onAssignToChange: (value: string) => void;
  teamMembers: Array<{ id: string; name: string }>;
  isClaiming: boolean;
  onClaim: () => void;
  onClear: () => void;
}

export function BulkActionBar({
  selectedCount,
  assignTo,
  onAssignToChange,
  teamMembers,
  isClaiming,
  onClaim,
  onClear,
}: BulkActionBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 px-4 py-3 bg-primary/10 border border-primary/20 rounded-lg">
      <span className="text-sm font-medium">
        {selectedCount} lead{selectedCount > 1 ? "s" : ""} selected
      </span>
      <Select value={assignTo} onValueChange={onAssignToChange}>
        <SelectTrigger className="w-full sm:w-[180px] h-9 text-sm">
          <SelectValue placeholder="Assign to..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="myself">Myself</SelectItem>
          {teamMembers.map((m) => (
            <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="flex gap-2">
        <Button size="sm" onClick={onClaim} disabled={isClaiming}>
          {isClaiming ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <UserPlus className="h-4 w-4 mr-2" />}
          Move to My Leads
        </Button>
        <Button variant="ghost" size="sm" onClick={onClear}>
          <X className="h-4 w-4 mr-1" /> Clear
        </Button>
      </div>
    </div>
  );
}
