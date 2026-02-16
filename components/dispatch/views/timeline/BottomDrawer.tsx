"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useBottomDrawer } from "@/hooks/use-bottom-drawer";
import { DrawerHandle } from "./DrawerHandle";
import { DispatchJob, DispatchCrew, DispatchTechnician } from "@/types/dispatch";
import type { MapGroupMode } from "../../map";

const drawerMapImport = () => import("./DrawerMapContent");

const DrawerMapContent = dynamic(drawerMapImport, {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center bg-gray-50">
      <div className="animate-pulse flex flex-col items-center gap-2">
        <div className="w-10 h-10 rounded-full bg-gray-200" />
        <div className="h-3 w-24 bg-gray-200 rounded" />
      </div>
    </div>
  ),
});

interface BottomDrawerProps {
  jobs: DispatchJob[];
  crews?: DispatchCrew[];
  technicians?: DispatchTechnician[];
  groupMode?: MapGroupMode;
  onJobClick: (job: DispatchJob) => void;
  isOpen?: boolean;
}

export function BottomDrawer({
  jobs,
  crews,
  technicians,
  groupMode,
  onJobClick,
  isOpen = false,
}: BottomDrawerProps) {
  const { height, snapPosition, isDragging, handlers, setSnap, containerRef } =
    useBottomDrawer({ initialCollapsed: true });

  // Sync height based on isOpen prop from parent
  useEffect(() => {
    setSnap(isOpen ? "half" : "collapsed");
  }, [isOpen, setSnap]);

  const handleSnap = (position: "collapsed" | "half" | "full") => {
    setSnap(position);
  };

  const isCollapsed = height <= 44;

  // Preload Leaflet bundle on idle so it's ready when user opens map
  useEffect(() => {
    const id = requestIdleCallback(() => { drawerMapImport(); });
    return () => cancelIdleCallback(id);
  }, []);

  // Once map has been opened, keep it mounted (hidden) so re-opens are instant
  const [hasOpened, setHasOpened] = useState(false);
  useEffect(() => {
    if (!isCollapsed) setHasOpened(true);
  }, [isCollapsed]);

  return (
    <div
      ref={containerRef as React.RefObject<HTMLDivElement>}
      className="border-t-2 border-gray-200 bg-white flex-shrink-0 flex flex-col"
      style={{
        height: `${height}px`,
        transition: isDragging ? "none" : "height 0.3s ease",
        overflow: isCollapsed ? "hidden" : "visible",
      }}
    >
      <DrawerHandle
        jobCount={jobs.length}
        snapPosition={snapPosition}
        handlers={handlers}
        onSnap={handleSnap}
      />

      {hasOpened && (
        <div
          className="flex-1 overflow-hidden"
          style={isCollapsed ? { visibility: "hidden", height: 0 } : undefined}
        >
          <DrawerMapContent jobs={jobs} crews={crews} technicians={technicians} groupMode={groupMode} onJobClick={onJobClick} />
        </div>
      )}
    </div>
  );
}
