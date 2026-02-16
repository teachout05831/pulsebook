"use client";

import { useDraggable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";

interface DraggableCrewMemberProps {
  memberId: string;
  children: React.ReactNode;
  disabled?: boolean;
}

export function DraggableCrewMember({ memberId, children, disabled = false }: DraggableCrewMemberProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `crew-member-${memberId}`,
    data: { type: "crew-member", memberId },
    disabled,
  });

  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className={cn(
        "touch-none cursor-grab active:cursor-grabbing",
        isDragging && "opacity-50 scale-105 z-50",
        disabled && "cursor-default opacity-60"
      )}
    >
      {children}
    </div>
  );
}
