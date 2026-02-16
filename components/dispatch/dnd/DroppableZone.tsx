"use client";

import React, { ReactNode, CSSProperties } from "react";
import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";

interface DroppableZoneProps {
  id: string;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  activeClassName?: string;
}

export function DroppableZone({
  id,
  children,
  className,
  style,
  activeClassName = "bg-blue-50 border-blue-300 ring-2 ring-blue-200",
}: DroppableZoneProps) {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "transition-colors duration-150",
        className,
        isOver && activeClassName
      )}
    >
      {children}
    </div>
  );
}
