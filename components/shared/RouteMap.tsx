"use client";

import { MapContainer, TileLayer, CircleMarker, Polyline, Tooltip } from "react-leaflet";
import { FitBounds } from "@/components/dispatch/map/MapLeafletHelpers";
import "leaflet/dist/leaflet.css";

interface Stop { address: string; stopType: string; lat: number; lng: number }

interface Props {
  stops: Stop[];
  routeGeometry?: [number, number][];
  height?: number;
}

const COLORS: Record<string, string> = { start: "#22c55e", end: "#ef4444", stop: "#3b82f6" };

function stopLabel(stopType: string, index: number): string {
  if (stopType === "start") return "Start";
  if (stopType === "end") return "End";
  return `Stop ${index}`;
}

export function RouteMap({ stops, routeGeometry, height = 350 }: Props) {
  if (stops.length === 0) return null;

  const stopPositions: [number, number][] = stops.map((s) => [s.lat, s.lng]);
  // Use route geometry for bounds if available (shows full road path)
  const boundsPositions = routeGeometry && routeGeometry.length > 0 ? routeGeometry : stopPositions;
  const center = stopPositions[0];

  return (
    <div className="relative z-0 rounded-md overflow-hidden border border-slate-200" style={{ height }}>
      <MapContainer
        center={center}
        zoom={12}
        scrollWheelZoom={true}
        dragging={true}
        zoomControl={true}
        attributionControl={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <FitBounds positions={boundsPositions} />
        {routeGeometry && routeGeometry.length > 0 ? (
          <Polyline positions={routeGeometry} pathOptions={{ color: "#4f46e5", weight: 4, opacity: 0.8 }} />
        ) : (
          <Polyline positions={stopPositions} pathOptions={{ color: "#6366f1", weight: 3, dashArray: "8 4" }} />
        )}
        {stops.map((s, i) => {
          const color = COLORS[s.stopType] || COLORS.stop;
          return (
            <CircleMarker
              key={`${s.lat}-${s.lng}`}
              center={[s.lat, s.lng]}
              radius={9}
              pathOptions={{ color, fillColor: color, fillOpacity: 0.9, weight: 2 }}
            >
              <Tooltip direction="top" offset={[0, -10]} permanent={stops.length <= 5}>
                {stopLabel(s.stopType, i)}
              </Tooltip>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
