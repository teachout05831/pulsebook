"use client";

import { Navigation, Phone, Mail } from "lucide-react";
import { DispatchJob } from "@/types/dispatch";

interface QuickActionsProps {
  job: DispatchJob;
}

export function QuickActions({ job }: QuickActionsProps) {
  const mapsUrl = job.address
    ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(job.address)}`
    : null;

  const emailUrl = `mailto:?subject=${encodeURIComponent(`Re: ${job.title}`)}&body=${encodeURIComponent(`Job: ${job.title}\nAddress: ${job.address}\nScheduled: ${job.scheduledDate}${job.scheduledTime ? ` at ${job.scheduledTime}` : ""}`)}`;

  return (
    <div className="flex gap-1.5">
      {job.customerPhone && (
        <a href={`tel:${job.customerPhone}`} className="flex-1">
          <button className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 text-[11px] font-medium rounded-md border border-green-200 text-green-600 bg-white hover:bg-green-50">
            <Phone className="h-3.5 w-3.5" />
            Call
          </button>
        </a>
      )}
      {mapsUrl && (
        <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
          <button className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 text-[11px] font-medium rounded-md border border-blue-200 text-blue-600 bg-white hover:bg-blue-50">
            <Navigation className="h-3.5 w-3.5" />
            Navigate
          </button>
        </a>
      )}
      <a href={emailUrl} className="flex-1">
        <button className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 text-[11px] font-medium rounded-md border border-purple-200 text-purple-600 bg-white hover:bg-purple-50">
          <Mail className="h-3.5 w-3.5" />
          Email
        </button>
      </a>
    </div>
  );
}
