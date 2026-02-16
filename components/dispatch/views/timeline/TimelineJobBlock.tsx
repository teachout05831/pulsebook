"use client";

import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { DispatchJob } from "@/types/dispatch";
import { cn } from "@/lib/utils";
import { getJobPosition, CELL_WIDTH } from "./constants";

interface TimelineJobBlockProps {
  job: DispatchJob;
  onJobClick: (job: DispatchJob) => void;
  lane?: number;
  laneHeight?: number;
}

// Status-based styles (background + left border)
const statusStyles: Record<DispatchJob["status"], string> = {
  unassigned: "bg-red-100 border-l-red-500",
  scheduled: "bg-blue-100 border-l-blue-500",
  in_progress: "bg-amber-100 border-l-amber-500",
  completed: "bg-green-100 border-l-green-500",
  cancelled: "bg-gray-100 border-l-gray-400",
};

export const TimelineJobBlock = React.memo(function TimelineJobBlock({ job, onJobClick, lane = 0, laneHeight = 40 }: TimelineJobBlockProps) {
  const { left, width } = getJobPosition(job, CELL_WIDTH);

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: job.id,
    data: { job },
  });

  const style: React.CSSProperties = {
    position: "absolute",
    top: 8 + lane * laneHeight,
    height: laneHeight - 8,
    left,
    width: Math.max(width - 4, 96),
    zIndex: isDragging ? 100 : 1,
    transform: transform ? CSS.Translate.toString(transform) : undefined,
  };

  const handleClick = (e: React.MouseEvent) => {
    if (!isDragging) {
      onJobClick(job);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={handleClick}
      className={cn(
        "border-l-3 rounded-r-md touch-none overflow-hidden select-none",
        "flex flex-col justify-center px-2",
        isDragging && "opacity-80 ring-2 ring-blue-400 cursor-grabbing",
        !isDragging && "cursor-grab hover:brightness-95",
        statusStyles[job.status]
      )}
    >
      <div className="text-xs font-medium text-gray-800 truncate">
        {job.customerName}
      </div>
      <div className="text-[10px] text-gray-600 truncate">
        {job.title}
      </div>
    </div>
  );
});
