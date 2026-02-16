"use client";

import { Calendar, MapPin, User, FileText } from "lucide-react";
import type { Job } from "@/types/job";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

function formatFullDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });
}

interface JobDetailContentProps {
  job: Job;
  onNavigate: (path: string) => void;
}

export function JobDetailContent({ job, onNavigate }: JobDetailContentProps) {
  return (
    <>
      {/* Schedule card */}
      <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
        <div className="flex items-center gap-3">
          <Calendar className="h-8 w-8 text-blue-600 shrink-0" />
          <div>
            <div className="font-semibold text-blue-900">{formatFullDate(job.scheduledDate)}</div>
            <div className="text-sm text-blue-700">
              {job.scheduledTime || "Time TBD"}
              {job.estimatedDuration && ` (${job.estimatedDuration} min estimated)`}
            </div>
          </div>
        </div>
      </div>

      {/* Details grid */}
      <div className="space-y-3">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide border-b pb-2">
          Job Details
        </h4>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="text-xs text-muted-foreground">Technician</div>
            <div className="text-sm font-medium flex items-center gap-1">
              <User className="h-3.5 w-3.5" />
              {job.assignedTo || "Unassigned"}
            </div>
          </div>
          {job.address && (
            <div>
              <div className="text-xs text-muted-foreground">Address</div>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(job.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline flex items-center gap-1"
              >
                <MapPin className="h-3.5 w-3.5" />
                Directions
              </a>
            </div>
          )}
          {job.sourceEstimateId && (
            <div>
              <div className="text-xs text-muted-foreground">Source Estimate</div>
              <button
                className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                onClick={() => onNavigate(`/estimates/${job.sourceEstimateId}`)}
              >
                <FileText className="h-3.5 w-3.5" />
                View Estimate
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      {job.description && (
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide border-b pb-2">
            Description
          </h4>
          <p className="text-sm text-muted-foreground leading-relaxed">{job.description}</p>
        </div>
      )}

      {/* Line items */}
      {job.lineItems && job.lineItems.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide border-b pb-2">
            Line Items
          </h4>
          <div className="space-y-2">
            {job.lineItems.map((item, i) => (
              <div key={`${item.description}-${i}`} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{item.description}</span>
                <span className="font-medium">{fmt(item.total || 0)}</span>
              </div>
            ))}
            <div className="flex justify-between text-sm font-semibold border-t pt-2">
              <span>Total</span>
              <span>{fmt(job.total)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Crew notes */}
      {job.crewNotes && (
        <div className="rounded-lg bg-amber-50 border border-amber-200 p-3">
          <div className="text-xs font-semibold text-amber-800 mb-1">Technician Notes</div>
          <p className="text-sm text-amber-900">{job.crewNotes}</p>
        </div>
      )}

      {/* Job summary */}
      <div className="rounded-lg bg-slate-50 border p-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Total</span>
          <span className="font-bold text-lg">{fmt(job.total)}</span>
        </div>
        <div className="text-xs text-muted-foreground space-y-1">
          <div>Created: {new Date(job.createdAt).toLocaleDateString()}</div>
          <div>Scheduled: {new Date(job.scheduledDate).toLocaleDateString()}</div>
        </div>
      </div>
    </>
  );
}
