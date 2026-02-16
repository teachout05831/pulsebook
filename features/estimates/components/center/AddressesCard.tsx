"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, ArrowDown, ExternalLink, Plus, Trash2 } from "lucide-react";
import type { EstimateLocation } from "@/types/estimate";

interface Props {
  locations: EstimateLocation[];
  onAdd: () => void;
  onRemove?: (id: string) => void;
}

const ICON_MAP: Record<string, { bg: string; color: string; Icon: typeof MapPin }> = {
  origin: { bg: "bg-blue-100", color: "text-blue-600", Icon: Navigation },
  stop: { bg: "bg-amber-100", color: "text-amber-600", Icon: ArrowDown },
  destination: { bg: "bg-green-100", color: "text-green-600", Icon: MapPin },
  service_location: { bg: "bg-purple-100", color: "text-purple-600", Icon: MapPin },
};

const LABEL_MAP: Record<string, string> = {
  origin: "Pickup",
  destination: "Delivery",
  stop: "Stop",
  service_location: "Service Location",
};

export function AddressesCard({ locations, onAdd, onRemove }: Props) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-lg">Addresses</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            {locations.length > 0 && <Badge variant="outline" className="text-xs">{locations.length} stops</Badge>}
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onAdd}><Plus className="h-3.5 w-3.5" /></Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {locations.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No addresses added yet</p>
        ) : (
          <div className="relative space-y-0">
            {locations.map((loc, i) => {
              const style = ICON_MAP[loc.locationType] || ICON_MAP.service_location;
              const IconComp = style.Icon;
              return (
                <div key={loc.id} className="relative group">
                  {i < locations.length - 1 && (
                    <div className="absolute left-[15px] top-[36px] bottom-0 w-px border-l-2 border-dashed border-muted-foreground/30" />
                  )}
                  <div className="flex gap-3 pb-4">
                    <div className="relative z-10 flex-shrink-0 mt-0.5">
                      <div className={`h-8 w-8 rounded-full ${style.bg} flex items-center justify-center`}>
                        <IconComp className={`h-4 w-4 ${style.color}`} />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        {loc.label || LABEL_MAP[loc.locationType] || loc.locationType}
                      </p>
                      <p className="text-sm font-medium mt-0.5">{loc.address}</p>
                      {(loc.city || loc.state) && (
                        <p className="text-sm text-muted-foreground">{[loc.city, loc.state, loc.zip].filter(Boolean).join(", ")}</p>
                      )}
                      {loc.accessNotes && <p className="text-xs text-muted-foreground mt-1 italic">{loc.accessNotes}</p>}
                    </div>
                    <div className="flex flex-col gap-1 flex-shrink-0">
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0" asChild>
                        <a href={`https://maps.google.com/?q=${encodeURIComponent(loc.address)}`} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </Button>
                      {onRemove && (
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 text-destructive"
                          onClick={() => onRemove(loc.id)}><Trash2 className="h-3 w-3" /></Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
