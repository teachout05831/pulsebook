"use client";

import { Loader2 } from "lucide-react";
import type { TimeSlot } from "../types/booking";

interface Props {
  slots: TimeSlot[];
  selectedTime: string | null;
  onSelect: (time: string) => void;
  isLoading: boolean;
}

export function TimeSlotPicker({ slots, selectedTime, onSelect, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />Loading slots...
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-4 text-center">
        No available slots for this date
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-2 max-h-[200px] overflow-y-auto pr-1">
      {slots.map((slot) => {
        const isSelected = slot.time === selectedTime;
        return (
          <button
            key={slot.time}
            disabled={!slot.available}
            onClick={() => slot.available && onSelect(slot.time)}
            className={`px-3 py-1.5 rounded text-xs font-medium border transition-colors ${
              isSelected
                ? "bg-blue-600 text-white border-blue-600"
                : slot.available
                  ? "bg-white border-slate-200 hover:bg-blue-50 hover:border-blue-300"
                  : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
            }`}
          >
            {slot.label}
          </button>
        );
      })}
    </div>
  );
}
