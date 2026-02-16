"use client";

import { Clock, DollarSign, Check } from "lucide-react";
import type { SectionProps } from "@/features/estimate-pages/components/sections/sectionProps";
import { useBooking } from "../BookingProvider";

const SAMPLE_SERVICES = [
  { id: "s1", name: "Basic Service", description: "", defaultPrice: 99, durationMinutes: 60 },
  { id: "s2", name: "Standard Service", description: "", defaultPrice: 199, durationMinutes: 90 },
  { id: "s3", name: "Premium Service", description: "", defaultPrice: 349, durationMinutes: 120 },
];

export function ServicePickerSection({ section }: SectionProps) {
  const booking = useBooking();
  const heading = (section.content.heading as string) || "Select a Service";
  const description = (section.content.description as string) || "Choose the service you'd like to book";
  const layout = (section.content.layout as string) || "grid";
  const showPrices = section.content.showPrices !== false;
  const showDurations = section.content.showDurations !== false;

  const services = booking?.services?.length ? booking.services : SAMPLE_SERVICES;
  const selectedId = booking?.flow.selectedServiceId;
  const isLive = !!booking;

  return (
    <div className="w-full" style={{ padding: "var(--section-spacing, 2.5rem) 1rem" }}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <span className="ep-section-label" style={{ color: "var(--primary-color)" }}>Services</span>
          <h2 className="text-xl sm:text-2xl font-bold" style={{ color: "var(--primary-color, #1f2937)" }}>{heading}</h2>
          {description && <p className="mt-2 text-sm text-muted-foreground max-w-2xl mx-auto">{description}</p>}
        </div>
        <div className={layout === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" : "flex flex-col gap-3"}>
          {services.map(svc => {
            const isSelected = svc.id === selectedId;
            return (
              <div
                key={svc.id}
                onClick={() => isLive && booking.setSelectedService(svc.id)}
                className={`border p-5 transition-all ${isLive ? "cursor-pointer hover:shadow-md" : ""} ${layout === "list" ? "flex items-center justify-between" : ""}`}
                style={{
                  borderRadius: "var(--border-radius, 0.5rem)",
                  borderColor: isSelected ? "var(--primary-color, #2563eb)" : "var(--border-color, #e5e7eb)",
                  background: isSelected ? "var(--primary-color, #2563eb)08" : undefined,
                }}
              >
                <div className={layout === "list" ? "flex-1" : ""}>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-base">{svc.name}</h3>
                    {isSelected && <Check className="h-4 w-4" style={{ color: "var(--primary-color)" }} />}
                  </div>
                  {svc.description && <p className="text-xs text-muted-foreground mt-1">{svc.description}</p>}
                  <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                    {showDurations && <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{svc.durationMinutes} min</span>}
                    {showPrices && <span className="flex items-center gap-1"><DollarSign className="h-3.5 w-3.5" />${svc.defaultPrice}</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {!isLive && <p className="mt-4 text-center text-xs text-muted-foreground italic">Service selection will be interactive once booking is enabled</p>}
      </div>
    </div>
  );
}
