"use client";

import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Props {
  availableMembers: { id: string; name: string; role: string }[];
  onSelect: (teamMemberId: string) => void;
}

export function CrewMemberPicker({ availableMembers, onSelect }: Props) {
  if (availableMembers.length === 0) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="w-full mt-2 text-blue-600 hover:text-blue-700">
          <UserPlus className="mr-2 h-4 w-4" />
          Add team member
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        {availableMembers.map((tm) => (
          <DropdownMenuItem key={tm.id} onClick={() => onSelect(tm.id)}>
            <span className="flex-1">{tm.name}</span>
            <span className="text-xs text-muted-foreground capitalize">{tm.role}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
