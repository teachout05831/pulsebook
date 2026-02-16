import { useMemo } from "react";
import { Marker, Tooltip } from "react-leaflet";
import { DispatchJob } from "@/types/dispatch";
import { createPinIcon } from "./MapMarker";
import { MapHoverCard } from "./MapHoverCard";

interface JobPinProps {
  job: DispatchJob;
  color: string;
  groupLabel: string;
  number: number;
  isSelected: boolean;
  onClick: () => void;
}

export function JobPin({ job, color, groupLabel, number, isSelected, onClick }: JobPinProps) {
  const icon = useMemo(
    () => createPinIcon(color, String(number), isSelected),
    [color, number, isSelected],
  );

  return (
    <Marker
      position={[job.latitude!, job.longitude!]}
      icon={icon}
      eventHandlers={{ click: onClick }}
    >
      <Tooltip direction="top" offset={[0, -5]} opacity={1} interactive>
        <MapHoverCard job={job} color={color} groupLabel={groupLabel} number={number} />
      </Tooltip>
    </Marker>
  );
}
