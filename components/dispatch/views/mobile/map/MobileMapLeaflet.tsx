"use client";

import { useMemo } from "react";
import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { FitBounds, MapResizeHandler } from "../../../map/MapLeafletHelpers";
import { DEFAULT_CENTER } from "../../../map/map-helpers";
import type { DispatchJob } from "@/types/dispatch";

interface MobileMapLeafletProps {
  jobs: DispatchJob[];
  pinColors: Record<DispatchJob["status"], string>;
  onJobClick: (job: DispatchJob) => void;
}

function createMobilePin(color: string, label: string): L.DivIcon {
  return L.divIcon({
    className: "",
    html: `<div style="
      width:30px; height:30px;
      background:${color};
      border:2px solid rgba(255,255,255,0.9);
      border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);
      display:flex; align-items:center; justify-content:center;
      box-shadow:0 2px 6px rgba(0,0,0,0.3);
    "><span style="
      transform:rotate(45deg);
      color:#fff;
      font-size:11px;
      font-weight:700;
      font-family:system-ui,sans-serif;
      line-height:1;
    ">${label}</span></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    tooltipAnchor: [0, -30],
  });
}

export default function MobileMapLeaflet({ jobs, pinColors, onJobClick }: MobileMapLeafletProps) {
  const positions = useMemo<[number, number][]>(
    () => jobs.map((j) => [j.latitude!, j.longitude!]),
    [jobs]
  );

  const icons = useMemo(
    () => jobs.map((j, i) => createMobilePin(pinColors[j.status], String(i + 1))),
    [jobs, pinColors]
  );

  return (
    <MapContainer
      center={DEFAULT_CENTER}
      zoom={11}
      className="h-full w-full"
      scrollWheelZoom
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapResizeHandler />
      <FitBounds positions={positions} />
      {jobs.map((job, i) => (
        <Marker
          key={job.id}
          position={[job.latitude!, job.longitude!]}
          icon={icons[i]}
          eventHandlers={{ click: () => onJobClick(job) }}
        >
          <Tooltip direction="top" offset={[0, -5]}>
            <div className="text-xs">
              <div className="font-medium">{job.title}</div>
              <div className="text-gray-500">{job.customerName}</div>
            </div>
          </Tooltip>
        </Marker>
      ))}
    </MapContainer>
  );
}
