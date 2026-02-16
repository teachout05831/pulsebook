"use client";

import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import { FitBounds } from "@/components/dispatch/map/MapLeafletHelpers";
import "leaflet/dist/leaflet.css";

export interface MapPin {
  lat: number;
  lng: number;
  color: string;
  label?: string;
}

interface Props {
  pins: MapPin[];
  height?: number;
}

export function AddressMap({ pins, height = 180 }: Props) {
  if (pins.length === 0) return null;

  const positions: [number, number][] = pins.map((p) => [p.lat, p.lng]);
  const center = positions[0];

  return (
    <div className="relative z-0 rounded-md overflow-hidden border border-slate-200" style={{ height }}>
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={false}
        dragging={false}
        zoomControl={false}
        attributionControl={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <FitBounds positions={positions} />
        {pins.map((pin) => (
          <CircleMarker
            key={`${pin.lat}-${pin.lng}`}
            center={[pin.lat, pin.lng]}
            radius={7}
            pathOptions={{ color: pin.color, fillColor: pin.color, fillOpacity: 0.85, weight: 2 }}
          >
            {pin.label && <Tooltip direction="top" offset={[0, -8]}>{pin.label}</Tooltip>}
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
