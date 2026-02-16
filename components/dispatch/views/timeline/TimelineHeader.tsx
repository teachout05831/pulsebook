"use client";

import { useState, useEffect } from "react";
import { HOURS, CELL_WIDTH, formatHour } from "./constants";
import { cn } from "@/lib/utils";

export function TimelineHeader() {
  const [currentHour, setCurrentHour] = useState<number | null>(null);

  useEffect(() => {
    setCurrentHour(new Date().getHours());
  }, []);

  return (
    <div className="flex-1 relative" style={{ minWidth: HOURS.length * CELL_WIDTH }}>
      <div className="flex">
        {HOURS.map((hour) => (
          <div
            key={hour}
            className={cn(
              "text-xs text-gray-400 py-2 pl-1",
              currentHour === hour && "text-blue-600 font-medium"
            )}
            style={{ width: CELL_WIDTH }}
          >
            {formatHour(hour)}
          </div>
        ))}
      </div>
    </div>
  );
}
