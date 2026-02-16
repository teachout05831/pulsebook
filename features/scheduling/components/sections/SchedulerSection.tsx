"use client";

import { useEffect } from "react";
import { CalendarDays, Clock, Loader2 } from "lucide-react";
import type { SectionProps } from "@/features/estimate-pages/components/sections/sectionProps";
import { useBooking } from "../BookingProvider";
import { useBookingAvailability } from "../../hooks/useBookingAvailability";
import { BookingCalendar } from "./BookingCalendar";

export function SchedulerSection({ section }: SectionProps) {
  const booking = useBooking();
  const heading = (section.content.heading as string) || "Pick a Date & Time";
  const description = (section.content.description as string) || "Choose your preferred appointment time";
  const variant = (section.settings.variant as string) || "inline";

  if (!booking) return <SchedulerPreview heading={heading} description={description} variant={variant} />;

  return <LiveScheduler heading={heading} description={description} variant={variant} />;
}

function LiveScheduler({ heading, description, variant }: { heading: string; description: string; variant: string }) {
  const booking = useBooking()!;
  const { data, isLoading, fetchSlots } = useBookingAvailability(booking.token);
  const selectedDate = booking.flow.selectedDate;

  useEffect(() => { if (selectedDate) fetchSlots(selectedDate); }, [selectedDate, fetchSlots]);

  const availableSlots = data?.slots?.filter(s => s.available) || [];

  return (
    <div className="w-full" style={{ padding: "var(--section-spacing, 2.5rem) 1rem" }}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <span className="ep-section-label" style={{ color: "var(--primary-color)" }}>Schedule</span>
          <h2 className="text-xl sm:text-2xl font-bold" style={{ color: "var(--primary-color, #1f2937)" }}>{heading}</h2>
          {description && <p className="mt-2 text-sm text-muted-foreground max-w-2xl mx-auto">{description}</p>}
        </div>
        <div className={`border ${variant === "inline" ? "grid grid-cols-1 md:grid-cols-2 gap-0" : ""}`} style={{ borderRadius: "var(--border-radius, 0.5rem)", overflow: "hidden" }}>
          <div className="p-5 bg-white">
            <h3 className="text-sm font-semibold flex items-center gap-2 mb-4">
              <CalendarDays className="h-4 w-4" style={{ color: "var(--primary-color)" }} />Select Date
            </h3>
            <BookingCalendar selectedDate={selectedDate} onSelectDate={booking.setSelectedDate} />
          </div>
          <div className="p-5 bg-gray-50 border-t md:border-t-0 md:border-l">
            <h3 className="text-sm font-semibold flex items-center gap-2 mb-4">
              <Clock className="h-4 w-4" style={{ color: "var(--primary-color)" }} />Available Times
            </h3>
            {!selectedDate && <p className="text-sm text-muted-foreground py-4 text-center">Select a date to see times</p>}
            {selectedDate && isLoading && <div className="flex justify-center py-8"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>}
            {selectedDate && !isLoading && availableSlots.length === 0 && <p className="text-sm text-muted-foreground py-4 text-center">No available times</p>}
            {selectedDate && !isLoading && availableSlots.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {availableSlots.map(slot => {
                  const isSelected = booking.flow.selectedTime === slot.time;
                  return (
                    <button
                      key={slot.time} onClick={() => booking.setSelectedTime(slot.time)}
                      className={`px-3 py-2 text-sm border rounded text-center transition-colors ${isSelected ? "text-white font-semibold" : "hover:bg-white"}`}
                      style={isSelected ? { background: "var(--primary-color, #2563eb)", borderColor: "var(--primary-color)" } : { borderRadius: "var(--border-radius, 0.375rem)" }}
                    >{slot.label}</button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SchedulerPreview({ heading, description, variant }: { heading: string; description: string; variant: string }) {
  const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const TIMES = ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM"];
  return (
    <div className="w-full" style={{ padding: "var(--section-spacing, 2.5rem) 1rem" }}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <span className="ep-section-label" style={{ color: "var(--primary-color)" }}>Schedule</span>
          <h2 className="text-xl sm:text-2xl font-bold" style={{ color: "var(--primary-color, #1f2937)" }}>{heading}</h2>
          {description && <p className="mt-2 text-sm text-muted-foreground max-w-2xl mx-auto">{description}</p>}
        </div>
        <div className={`border ${variant === "inline" ? "grid grid-cols-1 md:grid-cols-2 gap-0" : ""}`} style={{ borderRadius: "var(--border-radius, 0.5rem)", overflow: "hidden" }}>
          <div className="p-5 bg-white">
            <h3 className="text-sm font-semibold flex items-center gap-2 mb-4"><CalendarDays className="h-4 w-4" style={{ color: "var(--primary-color)" }} />February 2026</h3>
            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              {DAYS.map(d => <span key={d} className="font-medium text-muted-foreground py-1">{d}</span>)}
              <span /><span />
              {[3,4,5,6,7,8,9,10,11,12,13,14].map(d => (
                <button key={d} disabled className={`py-1.5 rounded text-sm ${d === 10 ? "text-white font-semibold" : d < 8 ? "text-muted-foreground/40" : ""}`} style={d === 10 ? { background: "var(--primary-color, #2563eb)" } : undefined}>{d}</button>
              ))}
            </div>
          </div>
          <div className="p-5 bg-gray-50 border-t md:border-t-0 md:border-l">
            <h3 className="text-sm font-semibold flex items-center gap-2 mb-4"><Clock className="h-4 w-4" style={{ color: "var(--primary-color)" }} />Available Times</h3>
            <div className="grid grid-cols-2 gap-2">
              {TIMES.map(t => <button key={t} disabled className="px-3 py-2 text-sm border rounded text-center">{t}</button>)}
            </div>
          </div>
        </div>
        <p className="mt-4 text-center text-xs text-muted-foreground italic">Calendar will show live availability once booking is enabled</p>
      </div>
    </div>
  );
}
