"use client";

import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";

interface DroppableCrewZoneProps {
  crewId: string;
  children: React.ReactNode;
  className?: string;
}

export function DroppableCrewZone({ crewId, children, className }: DroppableCrewZoneProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `crew-zone-${crewId}`,
    data: { type: "crew-zone", crewId },
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "transition-colors duration-200 rounded-md min-h-[40px]",
        isOver && "bg-blue-50 ring-2 ring-blue-300",
        className
      )}
    >
      {children}
    </div>
  );
}
