"use client";

import { useState } from "react";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TechnicianAvatar } from "../shared/technician-avatar";
import { DispatchTechnician } from "@/types/dispatch";

interface Props {
  availableTechs: DispatchTechnician[];
  crewId: string;
  onMemberAdded: () => Promise<void>;
  /** Optimistic direct add — updates UI instantly without refresh */
  onAddDirect?: (tech: DispatchTechnician) => void;
}

export function AddCrewMemberPopover({ availableTechs, crewId, onMemberAdded, onAddDirect }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const handleAdd = async (tech: DispatchTechnician) => {
    setIsOpen(false);
    if (onAddDirect) {
      // Optimistic path — parent handles API + state
      onAddDirect(tech);
    } else {
      // Fallback — call API directly + refresh
      const res = await fetch(`/api/crews/${crewId}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamMemberId: tech.databaseId }),
      });
      if (res.ok) await onMemberAdded();
    }
  };

  if (availableTechs.length === 0) return null;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-5 w-5 text-gray-400 hover:text-gray-600">
          <UserPlus className="h-3 w-3" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-52 p-1" align="start">
        <div className="px-2 py-1 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Add Member</div>
        <div className="max-h-48 overflow-y-auto">
          {availableTechs.map((tech) => (
            <button
              key={tech.id}
              onClick={() => handleAdd(tech)}
              className="flex items-center gap-2 w-full px-2 py-1.5 rounded text-left hover:bg-gray-100 transition-colors"
            >
              <TechnicianAvatar technician={tech} size="xs" />
              <span className="text-sm text-gray-700 truncate flex-1">{tech.name}</span>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
