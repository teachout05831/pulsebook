"use client";

import { useState, useMemo, useCallback } from "react";
import { Map as MapIcon, ChevronUp, ChevronDown } from "lucide-react";
import dynamic from "next/dynamic";
import { useDispatch } from "../../../dispatch-provider";
import { MobileMapJobItem } from "./MobileMapJobItem";
import type { DispatchJob } from "@/types/dispatch";

const MobileMapLeaflet = dynamic(() => import("./MobileMapLeaflet"), { ssr: false });

const statusPinColor: Record<DispatchJob["status"], string> = {
  unassigned: "#ef4444",
  scheduled: "#3b82f6",
  in_progress: "#eab308",
  completed: "#22c55e",
  cancelled: "#9ca3af",
};

export function MobileMapView() {
  const { jobs, setSelectedJobId, setIsDetailsPanelOpen } = useDispatch();
  const [expanded, setExpanded] = useState(true);

  const visibleJobs = useMemo(
    () => jobs.filter((j) => j.status !== "cancelled"),
    [jobs]
  );

  const mappableJobs = useMemo(
    () => visibleJobs.filter((j) => j.latitude && j.longitude),
    [visibleJobs]
  );

  const handleJobClick = useCallback(
    (job: DispatchJob) => {
      setSelectedJobId(job.id);
      setIsDetailsPanelOpen(true);
    },
    [setSelectedJobId, setIsDetailsPanelOpen]
  );

  const jobList = (
    <div className="flex-1 overflow-y-auto bg-gray-50 px-3 py-2">
      {visibleJobs.map((job, i) => (
        <MobileMapJobItem key={job.id} job={job} index={i} onViewDetails={handleJobClick} />
      ))}
      <div className="h-4" />
    </div>
  );

  if (!expanded) {
    return (
      <div className="flex flex-col h-full">
        <button
          onClick={() => setExpanded(true)}
          className="flex items-center px-3 py-2.5 gap-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200"
        >
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <MapIcon className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex-1 text-left">
            <span className="text-sm font-medium text-blue-900">Map View</span>
            <span className="text-xs text-blue-600 ml-2">{mappableJobs.length} jobs</span>
          </div>
          <span className="flex items-center gap-1 px-2.5 py-1 bg-blue-600 text-white rounded-lg text-xs font-medium">
            <ChevronDown className="w-3.5 h-3.5" />
            Expand
          </span>
        </button>
        {jobList}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Real map */}
      <div className="relative" style={{ height: 280 }}>
        <MobileMapLeaflet
          jobs={mappableJobs}
          pinColors={statusPinColor}
          onJobClick={handleJobClick}
        />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur rounded-lg px-2.5 py-1.5 shadow-sm z-[1000]">
          <span className="text-xs font-medium text-gray-700">{mappableJobs.length} jobs on map</span>
        </div>
      </div>

      {/* Minimize button */}
      <button
        onClick={() => setExpanded(false)}
        className="flex items-center justify-center py-2 gap-2 bg-gray-100 border-b border-gray-200"
      >
        <div className="w-8 h-1 bg-gray-300 rounded-full" />
        <span className="text-xs text-gray-500 font-medium">Minimize Map</span>
        <ChevronUp className="w-4 h-4 text-gray-400" />
      </button>

      {jobList}
    </div>
  );
}
