"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { APIProvider, Map as GoogleMap, useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { MapPin } from "lucide-react";
import { DispatchJob } from "@/types/dispatch";
import { cn } from "@/lib/utils";

interface MapPanelProps {
  jobs: DispatchJob[];
  onJobClick: (job: DispatchJob) => void;
}

const statusColors: Record<string, { bg: string; tw: string }> = {
  unassigned: { bg: "#6b7280", tw: "bg-gray-500" },
  scheduled: { bg: "#3b82f6", tw: "bg-blue-500" },
  in_progress: { bg: "#eab308", tw: "bg-yellow-500" },
  completed: { bg: "#22c55e", tw: "bg-green-500" },
  cancelled: { bg: "#ef4444", tw: "bg-red-500" },
};

const DEFAULT_CENTER = { lat: 33.4484, lng: -111.9430 };

function MapMarkers({ jobs, onJobClick }: MapPanelProps) {
  const map = useMap();
  const geocodingLib = useMapsLibrary("geocoding");
  const markerLib = useMapsLibrary("marker");
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const geocodedRef = useRef(new window.Map<string, { lat: number; lng: number }>());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!geocodingLib || !jobs.length) return;
    const geocoder = new geocodingLib.Geocoder();
    let completed = 0;
    jobs.forEach((job) => {
      if (!job.address) { completed++; return; }
      geocoder.geocode({ address: job.address }, (res, status) => {
        completed++;
        if (status === "OK" && res?.[0]) {
          const loc = res[0].geometry.location;
          geocodedRef.current.set(job.id, { lat: loc.lat(), lng: loc.lng() });
        }
        if (completed >= jobs.length) setReady(true);
      });
    });
  }, [geocodingLib, jobs]);

  useEffect(() => {
    if (!map || !markerLib || !ready) return;
    markersRef.current.forEach((m) => (m.map = null));
    markersRef.current = [];
    if (!infoWindowRef.current) infoWindowRef.current = new google.maps.InfoWindow();
    const bounds = new google.maps.LatLngBounds();

    jobs.forEach((job) => {
      const coords = geocodedRef.current.get(job.id);
      if (!coords) return;
      const color = statusColors[job.status]?.bg || "#3b82f6";
      const pin = document.createElement("div");
      pin.style.cssText = `width:28px;height:28px;border-radius:50%;background:${color};color:#fff;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.3);cursor:pointer;`;
      pin.textContent = job.assignedTechnicianName?.[0] || "?";
      const marker = new markerLib.AdvancedMarkerElement({ map, position: coords, content: pin, title: job.title });
      marker.addListener("click", () => {
        infoWindowRef.current?.setContent(`<div style="padding:4px;max-width:200px"><p style="font-weight:600;font-size:13px;margin:0">${job.title}</p><p style="font-size:11px;color:#666;margin:2px 0 0">${job.customerName}</p><p style="font-size:11px;color:#888;margin:4px 0 0">${job.address}</p></div>`);
        infoWindowRef.current?.open(map, marker);
        onJobClick(job);
      });
      markersRef.current.push(marker);
      bounds.extend(coords);
    });

    if (markersRef.current.length > 0) map.fitBounds(bounds, { top: 30, bottom: 30, left: 30, right: 30 });
    return () => { markersRef.current.forEach((m) => (m.map = null)); markersRef.current = []; };
  }, [map, markerLib, ready, jobs, onJobClick]);

  return null;
}

export function MapPanel({ jobs, onJobClick }: MapPanelProps) {
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const handleJobClick = useCallback((job: DispatchJob) => {
    setSelectedJobId(job.id);
    onJobClick(job);
  }, [onJobClick]);

  if (!apiKey) {
    return (
      <div className="flex flex-col h-full bg-white border-l border-gray-200">
        <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
          <div className="text-center">
            <MapPin className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p>Google Maps API key not configured</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white border-l border-gray-200">
      <div className="p-3 border-b border-gray-200 flex items-center justify-between">
        <span className="font-semibold text-sm">Map View</span>
        <span className="text-xs text-gray-500">{jobs.length} jobs</span>
      </div>
      <div className="flex-1 min-h-[300px]">
        <APIProvider apiKey={apiKey}>
          <GoogleMap defaultCenter={DEFAULT_CENTER} defaultZoom={10} gestureHandling="greedy" disableDefaultUI={false} mapId="DEMO_MAP_ID" style={{ width: "100%", height: "100%" }}>
            <MapMarkers jobs={jobs} onJobClick={handleJobClick} />
          </GoogleMap>
        </APIProvider>
      </div>
      <div className="border-t border-gray-200 max-h-[200px] overflow-y-auto">
        {jobs.slice(0, 5).map((job, index) => (
          <div key={job.id} onClick={() => handleJobClick(job)} className={cn("flex items-center gap-3 p-2.5 border-b border-gray-100 hover:bg-gray-50 cursor-pointer", selectedJobId === job.id && "bg-blue-50")}>
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-semibold shrink-0" style={{ backgroundColor: statusColors[job.status]?.bg || "#3b82f6" }}>{index + 1}</div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm truncate">{job.title}</div>
              <div className="text-xs text-gray-500 truncate">{job.address}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
