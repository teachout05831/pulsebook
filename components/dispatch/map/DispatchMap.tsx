"use client";

import { useCallback, useMemo, useState } from "react";
import { MapContainer, TileLayer, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { DispatchJob, DispatchCrew, DispatchTechnician } from "@/types/dispatch";
import { JobPin } from "./JobPin";
import { MapSidebar } from "./MapSidebar";
import { RouteControls } from "./RouteControls";
import { RoutePanel } from "./RoutePanel";
import { DriveTimeLabel } from "./DriveTimeLabel";
import { ReassignToast } from "./ReassignToast";
import { MapLegend } from "./MapLegend";
import { FitBounds, MapResizeHandler } from "./MapLeafletHelpers";
import { JobDetailsPanel } from "../job-details";
import {
  buildLookupMaps,
  buildJobNumberMap,
  buildGroups,
  resolveJobAssignment,
  DEFAULT_CENTER,
} from "./map-helpers";
import type { MapGroupMode } from "./map-helpers";
import { useMapRouting } from "@/hooks/use-map-routing";
import type { RouteWaypoint } from "./route-types";

interface DispatchMapProps {
  jobs: DispatchJob[];
  crews?: DispatchCrew[];
  technicians?: DispatchTechnician[];
  groupMode?: MapGroupMode;
  onJobClick: (job: DispatchJob) => void;
}

export function DispatchMap({ jobs, crews = [], technicians = [], groupMode = "crew", onJobClick }: DispatchMapProps) {
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [showRoutePanel, setShowRoutePanel] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const { routes, isCalculating, calculateRoute, clearRoute, clearAllRoutes } = useMapRouting();

  const { crewMap, techMap } = useMemo(() => buildLookupMaps(crews, technicians), [crews, technicians]);
  const jobNumberMap = useMemo(() => buildJobNumberMap(jobs, crewMap, techMap, groupMode), [jobs, crewMap, techMap, groupMode]);
  const groups = useMemo(
    () => buildGroups(jobs, crews, technicians, crewMap, techMap, groupMode),
    [jobs, crews, technicians, crewMap, techMap, groupMode],
  );

  const handleJobClick = useCallback((job: DispatchJob) => {
    setSelectedJobId((prev) => (prev === job.id ? null : job.id));
    onJobClick(job);
  }, [onJobClick]);

  const handleToggleRoute = useCallback((groupKey: string) => {
    if (routes.has(groupKey)) { clearRoute(groupKey); return; }
    const group = groups.find((g) => g.key === groupKey);
    if (!group) return;
    const waypoints: RouteWaypoint[] = group.jobs
      .filter((j) => j.latitude && j.longitude)
      .map((j) => ({ jobId: j.id, latitude: j.latitude!, longitude: j.longitude!, label: j.title }));
    if (waypoints.length >= 2) { calculateRoute(groupKey, waypoints); }
  }, [routes, groups, calculateRoute, clearRoute]);

  const handleMoved = useCallback((message: string) => {
    setToastMsg(message);
  }, []);

  const mappableJobs = useMemo(() => jobs.filter((j) => j.latitude && j.longitude), [jobs]);
  const positions = useMemo<[number, number][]>(
    () => mappableJobs.map((j) => [j.latitude!, j.longitude!]),
    [mappableJobs],
  );

  return (
    <div className="flex flex-row h-full overflow-hidden">
      <div className="flex-1 min-h-[160px] relative overflow-hidden">
        <MapContainer center={DEFAULT_CENTER} zoom={10} className="h-full w-full" scrollWheelZoom>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapResizeHandler />
          <FitBounds positions={positions} />
          {mappableJobs.map((job) => {
            const { color, groupLabel } = resolveJobAssignment(job, crewMap, techMap, groupMode);
            const num = jobNumberMap.get(job.id) || 0;
            return (
              <JobPin
                key={job.id}
                job={job}
                color={color}
                groupLabel={groupLabel}
                number={num}
                isSelected={selectedJobId === job.id}
                onClick={() => handleJobClick(job)}
              />
            );
          })}
          {Array.from(routes.entries()).map(([key, route]) => {
            const group = groups.find((g) => g.key === key);
            return (
              <Polyline key={key} positions={route.geometry} pathOptions={{ color: group?.color || "#3b82f6", weight: 4, opacity: 0.7, dashArray: "8 6" }} />
            );
          })}
          {Array.from(routes.entries()).flatMap(([key, route]) =>
            route.legs.map((leg, i) => <DriveTimeLabel key={`${key}-${i}`} position={leg.midpoint} duration={leg.duration} />),
          )}
        </MapContainer>
        <RouteControls groups={groups} activeRoutes={routes} isCalculating={isCalculating} isPanelOpen={showRoutePanel} onTogglePanel={() => setShowRoutePanel((p) => !p)} />
        {showRoutePanel && <RoutePanel groups={groups} routes={routes} isCalculating={isCalculating} onToggleRoute={handleToggleRoute} onClearAll={clearAllRoutes} onClose={() => setShowRoutePanel(false)} />}
        <ReassignToast message={toastMsg} onDone={() => setToastMsg(null)} />
        <MapLegend groups={groups} />
        <JobDetailsPanel />
      </div>
      <MapSidebar
        jobs={jobs}
        crews={crews}
        technicians={technicians}
        crewMap={crewMap}
        techMap={techMap}
        jobNumberMap={jobNumberMap}
        groupMode={groupMode}
        selectedJobId={selectedJobId}
        onJobClick={handleJobClick}
        onMoved={handleMoved}
      />
    </div>
  );
}
