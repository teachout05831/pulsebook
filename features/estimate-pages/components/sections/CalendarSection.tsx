"use client";

import { Calendar } from "lucide-react";
import { toast } from "sonner";
import type { SectionProps } from "./sectionProps";

export function CalendarSection({ section }: SectionProps) {
  const title = (section.content.title as string) || "Book a Time";
  const bookingUrl = (section.content.bookingUrl as string) || "";
  const description =
    (section.content.description as string) ||
    "Choose a convenient time for us to discuss your project.";
  const variant = (section.settings.variant as string) || "embedded";

  function handleBookClick() {
    if (bookingUrl) {
      window.open(bookingUrl, "_blank", "noopener,noreferrer");
    } else {
      toast("No booking URL configured");
    }
  }

  return (
    <div className="w-full" style={{ padding: "var(--section-spacing, 2.5rem) 1rem" }}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <span className="ep-section-label" style={{ color: "var(--primary-color)" }}>Schedule</span>
          <h2 className="text-xl sm:text-2xl" style={{ color: "var(--primary-color, #1f2937)" }}>
            {title}
          </h2>
        </div>

        {variant === "embedded" ? (
          bookingUrl ? (
            <iframe
              src={bookingUrl}
              title={title}
              className="w-full border-0"
              style={{
                height: 600,
                borderRadius: "var(--border-radius, 0.5rem)",
              }}
              loading="lazy"
            />
          ) : (
            <div
              className="w-full flex flex-col items-center justify-center gap-3 border border-dashed border-gray-300 bg-gray-50"
              style={{
                height: 300,
                borderRadius: "var(--border-radius, 0.5rem)",
              }}
            >
              <Calendar className="h-10 w-10 text-gray-400" />
              <p className="text-sm text-gray-400">No booking URL configured</p>
            </div>
          )
        ) : (
          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {description}
            </p>
            <button
              onClick={handleBookClick}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
              style={{
                background: "var(--primary-color, #2563eb)",
                borderRadius: "var(--border-radius, 0.5rem)",
              }}
            >
              <Calendar className="h-4 w-4" />
              Book Appointment
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
