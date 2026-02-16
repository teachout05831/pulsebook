"use client";

import Image from "next/image";
import { Clock, MapPin, User, Timer } from "lucide-react";
import { DispatchJob } from "@/types/dispatch";

interface MapHoverCardProps {
  job: DispatchJob;
  color: string;
  groupLabel: string;
  number: number;
}

const priorityStyles: Record<string, { bg: string; text: string }> = {
  urgent: { bg: "#fee2e2", text: "#dc2626" },
  high: { bg: "#fef3c7", text: "#92400e" },
  normal: { bg: "#dbeafe", text: "#1d4ed8" },
  low: { bg: "#f3f4f6", text: "#6b7280" },
};

const statusStyles: Record<string, { bg: string; text: string; label: string }> = {
  unassigned: { bg: "#f3f4f6", text: "#6b7280", label: "Unassigned" },
  scheduled: { bg: "#dbeafe", text: "#1d4ed8", label: "Scheduled" },
  in_progress: { bg: "#fef3c7", text: "#92400e", label: "In Progress" },
  completed: { bg: "#dcfce7", text: "#16a34a", label: "Completed" },
  cancelled: { bg: "#f3f4f6", text: "#6b7280", label: "Cancelled" },
};

export function MapHoverCard({ job, color, groupLabel }: MapHoverCardProps) {
  const pStyle = priorityStyles[job.priority] || priorityStyles.normal;
  const sStyle = statusStyles[job.status] || statusStyles.scheduled;
  const shortAddress = job.address?.length > 30 ? job.address.slice(0, 28) + "..." : job.address;
  const firstPhoto = job.photoUrls?.[0];

  return (
    <div className="w-[300px]" style={{ fontFamily: "system-ui, sans-serif" }}>
      {/* Photo header or crew color accent bar */}
      {firstPhoto ? (
        <div className="rounded-t-lg overflow-hidden" style={{ height: 100, position: "relative" }}>
          <Image src={firstPhoto} alt="" fill style={{ objectFit: "cover" }} />
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 4, backgroundColor: color }} />
        </div>
      ) : (
        <div className="rounded-t-lg" style={{ height: 4, backgroundColor: color }} />
      )}

      {/* Body */}
      <div style={{ padding: "10px 14px 8px" }}>
        {/* Title + Priority */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: "#111827", lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
            {job.title}
          </span>
          <span
            style={{ fontSize: 9, fontWeight: 600, padding: "2px 8px", borderRadius: 99, whiteSpace: "nowrap", flexShrink: 0, textTransform: "capitalize", backgroundColor: pStyle.bg, color: pStyle.text }}
          >
            {job.priority}
          </span>
        </div>

        {/* Customer + Phone */}
        <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2, display: "flex", alignItems: "center", gap: 4 }}>
          <User style={{ width: 12, height: 12, flexShrink: 0, color: "#9ca3af" }} />
          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {job.customerName}
            {job.customerPhone && <> &bull; {job.customerPhone}</>}
          </span>
        </div>

        {/* Meta row: Time, Duration, Address */}
        <div style={{ display: "flex", gap: 10, marginTop: 7, fontSize: 11, color: "#4b5563", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Clock style={{ width: 12, height: 12, color: "#9ca3af", flexShrink: 0 }} />
            <span>{job.scheduledTime || "Unscheduled"}</span>
          </div>
          {job.estimatedDuration > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Timer style={{ width: 12, height: 12, color: "#9ca3af", flexShrink: 0 }} />
              <span>{job.estimatedDuration}m</span>
            </div>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: 4, minWidth: 0 }}>
            <MapPin style={{ width: 12, height: 12, color: "#9ca3af", flexShrink: 0 }} />
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{shortAddress}</span>
          </div>
        </div>

        {/* Status + Crew tags */}
        <div style={{ display: "flex", gap: 5, marginTop: 7 }}>
          <span
            style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 99, backgroundColor: sStyle.bg, color: sStyle.text }}
          >
            {sStyle.label}
          </span>
          <span
            style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 99, backgroundColor: color, color: "#fff" }}
          >
            {groupLabel}
          </span>
        </div>
      </div>

    </div>
  );
}
