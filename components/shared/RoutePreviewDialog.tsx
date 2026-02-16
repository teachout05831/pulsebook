"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink, Loader2, Clock, Navigation } from "lucide-react";

const RouteMap = dynamic(() => import("./RouteMap").then((m) => ({ default: m.RouteMap })), { ssr: false });

interface Stop { address: string; stopType: string }
interface GeocodedStop { address: string; stopType: string; lat: number; lng: number }
interface RouteInfo { geometry: [number, number][]; distanceMiles: number; durationMinutes: number }
interface Props { open: boolean; onClose: () => void; stops: Stop[] }

async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`, { headers: { "User-Agent": "ServicePro/1.0" } });
    const data = await res.json();
    if (data.length > 0) return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    return null;
  } catch { return null; }
}

async function fetchDrivingRoute(stops: GeocodedStop[]): Promise<RouteInfo | null> {
  try {
    const coords = stops.map((s) => `${s.lng},${s.lat}`).join(";");
    const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`);
    const data = await res.json();
    if (data.code !== "Ok" || !data.routes?.[0]) return null;
    const route = data.routes[0];
    const geometry: [number, number][] = route.geometry.coordinates.map((c: number[]) => [c[1], c[0]]);
    return { geometry, distanceMiles: route.distance / 1609.34, durationMinutes: route.duration / 60 };
  } catch { return null; }
}

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  if (h === 0) return `${m} min`;
  return `${h} hr ${m} min`;
}

export function RoutePreviewDialog({ open, onClose, stops }: Props) {
  const [geocoded, setGeocoded] = useState<GeocodedStop[]>([]);
  const [route, setRoute] = useState<RouteInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadRoute = useCallback(async () => {
    const filled = stops.filter((s) => s.address.trim());
    if (filled.length < 2) return;
    setIsLoading(true);
    const results: GeocodedStop[] = [];
    for (const stop of filled) {
      const coords = await geocodeAddress(stop.address);
      if (coords) results.push({ ...stop, ...coords });
      await new Promise((r) => setTimeout(r, 300));
    }
    setGeocoded(results);
    if (results.length >= 2) {
      const routeData = await fetchDrivingRoute(results);
      setRoute(routeData);
    }
    setIsLoading(false);
  }, [stops]);

  useEffect(() => {
    if (open) loadRoute();
    else { setGeocoded([]); setRoute(null); }
  }, [open, loadRoute]);

  const filledStops = stops.filter((s) => s.address.trim());
  const googleUrl = filledStops.length >= 2
    ? `https://www.google.com/maps/dir/${filledStops.map((s) => encodeURIComponent(s.address)).join("/")}`
    : null;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Route Preview</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-2">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Loading route...</span>
          </div>
        ) : geocoded.length >= 2 ? (
          <div className="space-y-3">
            {route && (
              <div className="flex items-center gap-4 px-3 py-2 bg-slate-50 rounded-md text-sm">
                <div className="flex items-center gap-1.5 text-slate-700">
                  <Navigation className="h-3.5 w-3.5 text-blue-500" />
                  <span className="font-medium">{route.distanceMiles.toFixed(1)} miles</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-700">
                  <Clock className="h-3.5 w-3.5 text-green-500" />
                  <span className="font-medium">{formatDuration(route.durationMinutes)}</span>
                </div>
              </div>
            )}
            <RouteMap stops={geocoded} routeGeometry={route?.geometry} height={350} />
            <div className="space-y-1">
              {geocoded.map((s, i) => (
                <div key={`${s.address}-${i}`} className="flex items-center gap-2 text-[13px]">
                  <span className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${
                    s.stopType === "start" ? "bg-green-500" : s.stopType === "end" ? "bg-red-500" : "bg-blue-500"
                  }`}>{i + 1}</span>
                  <span className="truncate">{s.address}</span>
                </div>
              ))}
            </div>
            {googleUrl && (
              <Button variant="outline" size="sm" className="w-full" asChild>
                <a href={googleUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-3.5 w-3.5" />Get Turn-by-Turn in Google Maps
                </a>
              </Button>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-8">Add at least two addresses to preview a route.</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
