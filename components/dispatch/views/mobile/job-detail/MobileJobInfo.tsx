"use client";

import type { ReactNode } from "react";
import { User, MapPin, Clock, Wrench, Users, FileText } from "lucide-react";
import type { DispatchJob } from "@/types/dispatch";

interface MobileJobInfoProps {
  job: DispatchJob;
}

function formatDuration(minutes: number) {
  if (minutes < 60) return `${minutes}m`;
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`;
}

function InfoRow({ icon: Icon, label, children }: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-gray-500" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-xs text-gray-500">{label}</div>
        {children}
      </div>
    </div>
  );
}

export function MobileJobInfo({ job }: MobileJobInfoProps) {
  return (
    <div className="space-y-3">
      <InfoRow icon={User} label="Customer">
        <div className="text-sm font-medium text-gray-900">{job.customerName}</div>
        {job.customerPhone && (
          <a href={`tel:${job.customerPhone}`} className="text-xs text-blue-600">{job.customerPhone}</a>
        )}
      </InfoRow>

      <InfoRow icon={MapPin} label="Address">
        <div className="text-sm font-medium text-gray-900 truncate">{job.address || "No address"}</div>
      </InfoRow>

      <InfoRow icon={Clock} label="Schedule">
        <div className="text-sm font-medium text-gray-900">
          {job.scheduledTime || "No time set"} &bull; {formatDuration(job.estimatedDuration)}
        </div>
      </InfoRow>

      {job.assignedTechnicianName && (
        <InfoRow icon={Wrench} label="Technician">
          <div className="text-sm font-medium text-gray-900">{job.assignedTechnicianName}</div>
        </InfoRow>
      )}

      {job.assignedCrewName && (
        <InfoRow icon={Users} label="Crew">
          <div className="text-sm font-medium text-gray-900">{job.assignedCrewName}</div>
        </InfoRow>
      )}

      {job.description && (
        <InfoRow icon={FileText} label="Description">
          <div className="text-sm text-gray-700 line-clamp-2">{job.description}</div>
        </InfoRow>
      )}
    </div>
  );
}
