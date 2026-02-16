"use client";

import React, { ReactNode } from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";

interface DraggableJobProps {
  jobId: string;
  children: ReactNode;
  disabled?: boolean;
}

export function DraggableJob({ jobId, children, disabled = false }: DraggableJobProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: jobId,
    disabled,
  });

  const style = transform
    ? {
        transform: CSS.Translate.toString(transform),
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        "touch-none transition-all duration-150",
        isDragging && "opacity-50 scale-105 z-50 cursor-grabbing",
        !isDragging && !disabled && "cursor-grab",
        disabled && "cursor-default"
      )}
    >
      {children}
    </div>
  );
}
