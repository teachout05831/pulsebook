"use client";

import { useState } from "react";
import { RefreshCw, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { useDispatch } from "../../dispatch-provider";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import Link from "next/link";

function formatMobileDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function isToday(date: Date): boolean {
  const now = new Date();
  return (
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  );
}

export function MobileDispatchHeader() {
  const {
    refetch,
    isLoading,
    selectedDate,
    goToPrevious,
    goToNext,
    setSelectedDate,
  } = useDispatch();

  const [calendarOpen, setCalendarOpen] = useState(false);
  const handleToday = () => setSelectedDate(new Date());

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setCalendarOpen(false);
    }
  };

  return (
    <div className="bg-white px-3 py-2.5 border-b border-gray-200">
      {/* Row 1: Title + actions */}
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-base font-semibold text-gray-900">
          Dispatch Center
        </h1>
        <div className="flex items-center gap-1.5">
          <button
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
            onClick={() => refetch()}
            disabled={isLoading}
          >
            <RefreshCw
              className={cn("w-5 h-5", isLoading && "animate-spin")}
            />
          </button>
          <Link href="/jobs/new">
            <button className="p-1.5 rounded-lg bg-blue-600 text-white">
              <Plus className="w-5 h-5" />
            </button>
          </Link>
        </div>
      </div>

      {/* Row 2: Date nav */}
      <div className="flex items-center gap-2">
        <button
          className="p-1 rounded border border-gray-200"
          onClick={() => goToPrevious("day")}
        >
          <ChevronLeft className="w-4 h-4 text-gray-600" />
        </button>
        <button
          className="p-1 rounded border border-gray-200"
          onClick={() => goToNext("day")}
        >
          <ChevronRight className="w-4 h-4 text-gray-600" />
        </button>
        {!isToday(selectedDate) && (
          <button
            className="px-2 py-0.5 text-xs border border-gray-200 rounded text-gray-600"
            onClick={handleToday}
          >
            Today
          </button>
        )}
        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger asChild>
            <button className="text-sm font-semibold text-gray-900 flex-1 text-left hover:text-blue-600 transition-colors">
              {formatMobileDate(selectedDate)}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              defaultMonth={selectedDate}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
