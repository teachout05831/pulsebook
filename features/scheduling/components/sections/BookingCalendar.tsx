"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
  capacityMap?: Record<string, "green" | "yellow" | "red">;
  minDate?: string;
  maxDate?: string;
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const CAP_COLORS: Record<string, string> = { green: "#22c55e", yellow: "#eab308", red: "#ef4444" };

function formatDate(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

export function BookingCalendar({ selectedDate, onSelectDate, capacityMap = {}, minDate, maxDate }: Props) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());

  const { firstDayOffset, daysInMonth } = useMemo(() => {
    const first = new Date(viewYear, viewMonth, 1);
    return { firstDayOffset: first.getDay(), daysInMonth: new Date(viewYear, viewMonth + 1, 0).getDate() };
  }, [viewYear, viewMonth]);

  const prev = () => { if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); } else setViewMonth(m => m - 1); };
  const next = () => { if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); } else setViewMonth(m => m + 1); };

  const monthLabel = new Date(viewYear, viewMonth).toLocaleString("default", { month: "long", year: "numeric" });

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <button onClick={prev} className="p-1 rounded hover:bg-gray-100"><ChevronLeft className="h-4 w-4" /></button>
        <span className="text-sm font-semibold">{monthLabel}</span>
        <button onClick={next} className="p-1 rounded hover:bg-gray-100"><ChevronRight className="h-4 w-4" /></button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        {DAYS.map(d => <span key={d} className="font-medium text-muted-foreground py-1">{d}</span>)}
        {Array.from({ length: firstDayOffset }, (_, i) => <span key={`e-${i}`} />)}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const dateStr = formatDate(viewYear, viewMonth, day);
          const dateObj = new Date(viewYear, viewMonth, day);
          const isPast = dateObj < today;
          const isBeforeMin = minDate && dateStr < minDate;
          const isAfterMax = maxDate && dateStr > maxDate;
          const disabled = isPast || !!isBeforeMin || !!isAfterMax;
          const isSelected = dateStr === selectedDate;
          const cap = capacityMap[dateStr];

          return (
            <button
              key={day}
              disabled={disabled}
              onClick={() => !disabled && onSelectDate(dateStr)}
              className={`py-1.5 rounded text-sm transition-colors relative ${isSelected ? "text-white font-semibold" : disabled ? "text-muted-foreground/30" : "hover:bg-gray-100"}`}
              style={isSelected ? { background: "var(--primary-color, #2563eb)" } : undefined}
            >
              {day}
              {cap && !isSelected && <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: CAP_COLORS[cap] }} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
