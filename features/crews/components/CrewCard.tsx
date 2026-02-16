"use client";

import { Crown, MoreHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CrewMemberPicker } from "./CrewMemberPicker";
import type { Crew } from "../types";

interface Props {
  crew: Crew;
  teamMembers: { id: string; name: string; role: string }[];
  onEdit: () => void;
  onDelete: () => void;
  onAddMember: (teamMemberId: string) => void;
  onRemoveMember: (teamMemberId: string) => void;
  onSetLead: (teamMemberId: string | null) => void;
}

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export function CrewCard({ crew, teamMembers, onEdit, onDelete, onAddMember, onRemoveMember, onSetLead }: Props) {
  const existingIds = new Set(crew.members.map((m) => m.teamMemberId));
  const available = teamMembers.filter((tm) => !existingIds.has(tm.id));

  return (
    <div className="border rounded-lg bg-white overflow-hidden">
      <div className="h-1" style={{ backgroundColor: crew.color }} />
      <div className="p-4">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold">{crew.name}</span>
            <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
              {crew.members.length} members
            </span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}>Edit Crew</DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete} className="text-destructive">
                Delete Crew
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {crew.vehicleName && (
          <p className="text-xs text-muted-foreground mb-3">&#x1f69a; {crew.vehicleName}</p>
        )}

        <div className="space-y-2">
          {crew.members.map((member) => (
            <div key={member.id} className="group/member flex items-center gap-2 py-1">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-semibold"
                style={{ backgroundColor: crew.color }}
              >
                {getInitials(member.memberName)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{member.memberName}</p>
              </div>
              {crew.leadMemberId === member.teamMemberId ? (
                <button
                  onClick={() => onSetLead(null)}
                  title="Remove as lead"
                  className="text-[10px] font-semibold uppercase bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded hover:bg-amber-200 transition-colors"
                >
                  Lead
                </button>
              ) : (
                <button
                  onClick={() => onSetLead(member.teamMemberId)}
                  title="Set as lead"
                  className="opacity-0 group-hover/member:opacity-100 transition-opacity"
                >
                  <Crown className="h-3.5 w-3.5 text-muted-foreground hover:text-amber-600" />
                </button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-muted-foreground hover:text-destructive"
                onClick={() => onRemoveMember(member.teamMemberId)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>

        {available.length > 0 && (
          <CrewMemberPicker
            availableMembers={available}
            onSelect={onAddMember}
          />
        )}
      </div>
    </div>
  );
}
