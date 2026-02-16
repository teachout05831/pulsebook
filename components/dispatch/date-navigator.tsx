"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useDispatch } from "./dispatch-provider";
import type { DateRange } from "react-day-picker";

type DatePref = "day" | "3day" | "week" | "custom";

function formatDateDisplay(date: Date, preference: DatePref, customEnd?: Date | null): string {
  const options: Intl.DateTimeFormatOptions = { weekday: "short", month: "short", day: "numeric" };

  if (preference === "custom" && customEnd) {
    return `${date.toLocaleDateString("en-US", options)} - ${customEnd.toLocaleDateString("en-US", options)}`;
  }
  if (preference === "day") {
    return date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  }
  if (preference === "3day") {
    const end = new Date(date);
    end.setDate(end.getDate() + 2);
    return `${date.toLocaleDateString("en-US", options)} - ${end.toLocaleDateString("en-US", options)}`;
  }
  const end = new Date(date);
  end.setDate(end.getDate() + 6);
  return `${date.toLocaleDateString("en-US", options)} - ${end.toLocaleDateString("en-US", options)}`;
}

function isToday(date: Date): boolean {
  const today = new Date();
  return date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
}

export function DateNavigator() {
  const {
    selectedDate, setSelectedDate, goToPrevious, goToNext,
    dateRangePreference, setDateRangePreference, currentView,
    customDateRange, setCustomDateRange,
  } = useDispatch();

  const [calendarOpen, setCalendarOpen] = useState(false);
  const [customRangeOpen, setCustomRangeOpen] = useState(false);

  const getNavUnit = (): "day" | "week" | "month" => {
    if (currentView === "week") return "week";
    if (dateRangePreference === "week") return "week";
    return "day";
  };

  const navUnit = getNavUnit();

  const handleDateSelect = (date: Date | undefined) => {
    if (date) { setSelectedDate(date); setCalendarOpen(false); }
  };

  const handleRangeSelect = (range: DateRange | undefined) => {
    if (range?.from && range?.to) {
      const start = new Date(range.from); start.setHours(0, 0, 0, 0);
      const end = new Date(range.to); end.setHours(23, 59, 59, 999);
      setCustomDateRange({ start, end });
      setDateRangePreference("custom");
      setCustomRangeOpen(false);
    }
  };

  const handlePrefChange = (val: string) => {
    if (val === "custom") {
      setCustomRangeOpen(true);
    } else {
      setDateRangePreference(val as DatePref);
      setCustomDateRange(null);
    }
  };

  const customEnd = customDateRange?.end || null;

  return (
    <div className="flex items-center gap-1.5">
      {dateRangePreference !== "custom" && (
        <>
          <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => goToPrevious(navUnit)}>
            <ChevronLeft className="h-3.5 w-3.5" />
          </Button>
          <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => goToNext(navUnit)}>
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </>
      )}

      <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
        <PopoverTrigger asChild>
          <button className="flex items-center gap-1.5 text-[13px] font-semibold text-gray-900 hover:text-blue-600 cursor-pointer transition-colors whitespace-nowrap">
            {formatDateDisplay(selectedDate, dateRangePreference, customEnd)}
            <CalendarDays className="h-3.5 w-3.5 text-gray-400" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 z-[9999]" align="start">
          <Calendar mode="single" selected={selectedDate} onSelect={handleDateSelect} defaultMonth={selectedDate} />
        </PopoverContent>
      </Popover>

      <select
        value={dateRangePreference}
        onChange={(e) => handlePrefChange(e.target.value)}
        className="w-[80px] h-7 text-xs rounded-md border border-input bg-background px-2 focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <option value="day">Day</option>
        <option value="3day">3 Days</option>
        <option value="week">Week</option>
        <option value="custom">Custom</option>
      </select>

      {/* Custom range picker popover */}
      <Popover open={customRangeOpen} onOpenChange={setCustomRangeOpen}>
        <PopoverTrigger asChild><span /></PopoverTrigger>
        <PopoverContent className="w-auto p-0 z-[9999]" align="start">
          <Calendar
            mode="range"
            selected={customDateRange ? { from: customDateRange.start, to: customDateRange.end } : undefined}
            onSelect={handleRangeSelect}
            numberOfMonths={2}
            defaultMonth={selectedDate}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
