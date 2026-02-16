import { useMemo } from "react";
import { Marker } from "react-leaflet";
import L from "leaflet";

interface DriveTimeLabelProps {
  position: [number, number];
  duration: number; // seconds
}

function formatMins(seconds: number): string {
  const mins = Math.round(seconds / 60);
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  const rem = mins % 60;
  return rem > 0 ? `${h}h ${rem}m` : `${h}h`;
}

export function DriveTimeLabel({ position, duration }: DriveTimeLabelProps) {
  const icon = useMemo(
    () =>
      L.divIcon({
        className: "",
        html: `<div style="
      background:#fff;
      border:1px solid #e5e7eb;
      border-radius:4px;
      padding:1px 6px;
      font-size:11px;
      font-weight:600;
      color:#374151;
      white-space:nowrap;
      box-shadow:0 1px 3px rgba(0,0,0,0.1);
      font-family:system-ui,sans-serif;
    ">${formatMins(duration)}</div>`,
        iconSize: [0, 0],
        iconAnchor: [0, 0],
      }),
    [duration],
  );

  return <Marker position={position} icon={icon} interactive={false} />;
}
