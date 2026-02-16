"use client";

import { useMemo } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TechnicianAvatar } from "../shared/technician-avatar";
import { DraggableCrewMember } from "../dnd/DraggableCrewMember";
import { DispatchCrew, DispatchTechnician } from "@/types/dispatch";
import { Badge } from "@/components/ui/badge";

interface Props {
  crews: DispatchCrew[];
  technicians: DispatchTechnician[];
  onClose: () => void;
}

export function CrewMembersPanel({ crews, technicians, onClose }: Props) {
  // Find techs not on any crew
  const assignedTechIds = useMemo(() => {
    const ids = new Set<string>();
    crews.forEach(c => c.members.forEach(m => ids.add(m.id)));
    return ids;
  }, [crews]);

  const unassignedTechs = useMemo(
    () => technicians.filter(t => t.isActive && !assignedTechIds.has(t.id)),
    [technicians, assignedTechIds]
  );

  return (
    <div className="w-[240px] flex-shrink-0 border-l border-gray-200 bg-gray-50 flex flex-col">
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200">
        <span className="text-sm font-semibold text-gray-700">Team Members</span>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-3">
        {/* Crew members grouped by crew */}
        {crews.map((crew) => (
          <div key={crew.id}>
            <div className="flex items-center gap-2 px-1 mb-1.5">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: crew.color }} />
              <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">
                {crew.name}
              </span>
              <Badge variant="outline" className="text-[9px] ml-auto">{crew.members.length}</Badge>
            </div>
            <div className="space-y-0.5">
              {crew.members.map((member) => (
                <DraggableCrewMember key={member.id} memberId={member.id}>
                  <div className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-white border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all">
                    <TechnicianAvatar technician={member} size="xs" />
                    <span className="text-xs font-medium text-gray-800 truncate flex-1">{member.name}</span>
                    {crew.leadMemberId === member.databaseId && (
                      <span className="text-[8px] font-bold uppercase bg-amber-100 text-amber-700 px-1 rounded">Lead</span>
                    )}
                  </div>
                </DraggableCrewMember>
              ))}
            </div>
          </div>
        ))}

        {/* Unassigned techs */}
        {unassignedTechs.length > 0 && (
          <div>
            <div className="flex items-center gap-2 px-1 mb-1.5">
              <div className="w-2 h-2 rounded-full bg-gray-400" />
              <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">
                Unassigned
              </span>
              <Badge variant="outline" className="text-[9px] ml-auto">{unassignedTechs.length}</Badge>
            </div>
            <div className="space-y-0.5">
              {unassignedTechs.map((tech) => (
                <DraggableCrewMember key={tech.id} memberId={tech.id}>
                  <div className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-white border border-dashed border-gray-300 hover:border-gray-400 hover:shadow-sm transition-all">
                    <TechnicianAvatar technician={tech} size="xs" />
                    <span className="text-xs font-medium text-gray-600 truncate flex-1">{tech.name}</span>
                  </div>
                </DraggableCrewMember>
              ))}
            </div>
          </div>
        )}

        {crews.length === 0 && unassignedTechs.length === 0 && (
          <p className="text-xs text-gray-400 text-center py-4">No team members</p>
        )}
      </div>

      <div className="px-3 py-2 border-t border-gray-200 bg-white">
        <p className="text-[10px] text-gray-400 text-center">
          Drag a member onto a crew to assign
        </p>
      </div>
    </div>
  );
}
