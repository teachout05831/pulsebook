"use client";

import dynamic from "next/dynamic";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import type { EstimateLocation } from "@/types/estimate";
import type { MapPin } from "@/components/shared/AddressMap";

const AddressMap = dynamic(() => import("@/components/shared/AddressMap").then((m) => ({ default: m.AddressMap })), { ssr: false });

const PIN_COLORS: Record<string, string> = {
  origin: "#3b82f6",
  destination: "#22c55e",
  stop: "#f59e0b",
  service_location: "#a855f7",
};

interface Props {
  locations: EstimateLocation[];
  onAdd: () => void;
  onRemove?: (id: string) => void;
}

const DOT_COLORS: Record<string, string> = {
  origin: "bg-blue-500",
  destination: "bg-green-500",
  stop: "bg-amber-500",
  service_location: "bg-purple-500",
};

const LABEL_MAP: Record<string, string> = {
  origin: "Origin",
  destination: "Destination",
  stop: "Stop",
  service_location: "Service",
};

export function StopsCard({ locations, onAdd, onRemove }: Props) {
  const fullAddress = (loc: EstimateLocation) => {
    const parts = [loc.address, loc.city, loc.state, loc.zip].filter(Boolean);
    return parts.join(", ") || loc.address;
  };

  const mapsUrl = locations.length > 0
    ? `https://maps.google.com/?q=${encodeURIComponent(locations.map((l) => l.address).join(" to "))}`
    : null;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <span className="text-sm font-semibold">Stops</span>
          {mapsUrl && (
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-xs hover:underline">
              Map
            </a>
          )}
          {/* Travel info placeholder */}
          <span className="text-[11px] text-slate-500"><strong>RT</strong> --</span>
          <span className="text-[11px] text-slate-500"><strong>Travel</strong> --</span>
          <Button variant="ghost" size="icon" className="h-6 w-6 ml-auto" onClick={onAdd}>
            <Plus className="h-3.5 w-3.5" />
          </Button>
        </div>

        {locations.length === 0 ? (
          <p className="text-center text-slate-400 text-xs py-3">No stops added yet</p>
        ) : (
          <div className="flex flex-col">
            {locations.map((loc, i) => {
              const dotColor = DOT_COLORS[loc.locationType] || "bg-slate-400";
              const label = loc.label || LABEL_MAP[loc.locationType] || loc.locationType;
              const isLink = loc.locationType === "origin" || loc.locationType === "destination";

              return (
                <div
                  key={loc.id}
                  className={`flex items-center gap-3 py-2 group flex-wrap ${i < locations.length - 1 ? "border-b border-slate-100" : ""}`}
                >
                  <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${dotColor}`} />
                  {isLink ? (
                    <a href={`https://maps.google.com/?q=${encodeURIComponent(loc.address)}`} target="_blank" rel="noopener noreferrer"
                      className="text-[13px] text-blue-600 font-medium w-20 hover:underline">{label}</a>
                  ) : (
                    <span className="text-[13px] text-slate-400 w-20">{label}</span>
                  )}
                  <span className="text-[13px] flex-1 min-w-[150px]">{fullAddress(loc)}</span>
                  {loc.propertyType && (
                    <span className="text-[11px] text-slate-500">{loc.propertyType}</span>
                  )}
                  {onRemove && (
                    <Button variant="ghost" size="icon" className="h-5 w-5 opacity-0 group-hover:opacity-100 text-destructive shrink-0"
                      onClick={() => onRemove(loc.id)}>
                      <Trash2 className="h-2.5 w-2.5" />
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {(() => {
          const pins: MapPin[] = locations
            .filter((l) => l.lat != null && l.lng != null)
            .map((l) => ({ lat: l.lat!, lng: l.lng!, color: PIN_COLORS[l.locationType] || "#64748b", label: l.label || LABEL_MAP[l.locationType] || l.locationType }));
          return pins.length > 0 ? <div className="mt-3"><AddressMap pins={pins} /></div> : null;
        })()}
      </CardContent>
    </Card>
  );
}
