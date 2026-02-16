"use client";

import { MapPin, Minus, Square, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DrawerHandleProps {
  jobCount: number;
  snapPosition: string;
  handlers: {
    onMouseDown: (e: React.MouseEvent) => void;
    onTouchStart: (e: React.TouchEvent) => void;
    onDoubleClick: () => void;
  };
  onSnap: (position: "collapsed" | "half" | "full") => void;
}

export function DrawerHandle({ jobCount, snapPosition, handlers, onSnap }: DrawerHandleProps) {
  return (
    <div
      className="flex items-center justify-center gap-3 px-4 py-2 bg-gray-50 border-b border-gray-200 cursor-row-resize select-none touch-none hover:bg-gray-100 transition-colors"
      onMouseDown={handlers.onMouseDown}
      onTouchStart={handlers.onTouchStart}
      onDoubleClick={handlers.onDoubleClick}
    >
      <div className="w-10 h-1 rounded-full bg-gray-300 group-hover:bg-blue-500" />
      <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
        <MapPin className="h-3 w-3" />
        <span>Map View</span>
      </div>
      <span className="text-xs font-semibold text-blue-600">{jobCount} jobs</span>
      <div className="flex gap-1 ml-auto" onMouseDown={(e) => e.stopPropagation()}>
        <Button
          variant="ghost" size="icon"
          className={cn("h-6 w-6", snapPosition === "collapsed" && "bg-blue-100 text-blue-600")}
          onClick={() => onSnap("collapsed")} title="Collapse"
        >
          <Minus className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost" size="icon"
          className={cn("h-6 w-6", snapPosition === "half" && "bg-blue-100 text-blue-600")}
          onClick={() => onSnap("half")} title="Half"
        >
          <Square className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost" size="icon"
          className={cn("h-6 w-6", snapPosition === "full" && "bg-blue-100 text-blue-600")}
          onClick={() => onSnap("full")} title="Full"
        >
          <Maximize2 className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}
