"use client";

import { Phone, Navigation, MessageSquare, Copy, Camera, FileText } from "lucide-react";
import type { DispatchJob } from "@/types/dispatch";
import { useState } from "react";

interface MobileQuickActionsProps {
  job: DispatchJob;
}

export function MobileQuickActions({ job }: MobileQuickActionsProps) {
  const [copied, setCopied] = useState(false);

  const mapsUrl = job.address
    ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(job.address)}`
    : null;

  const smsUrl = job.customerPhone
    ? `sms:${job.customerPhone}?body=${encodeURIComponent(`Hi ${job.customerName}, regarding your ${job.title} appointment`)}`
    : null;

  const handleCopyAddress = async () => {
    if (!job.address) return;
    await navigator.clipboard.writeText(job.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const photoCount = job.photoUrls?.length || 0;

  return (
    <div className="grid grid-cols-3 gap-2">
      {job.customerPhone && (
        <a href={`tel:${job.customerPhone}`}>
          <div className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-green-50 hover:bg-green-100 transition-colors">
            <Phone className="w-5 h-5 text-green-600" />
            <span className="text-[10px] text-green-700 font-medium">Call</span>
          </div>
        </a>
      )}
      {mapsUrl && (
        <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
          <div className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors">
            <Navigation className="w-5 h-5 text-blue-600" />
            <span className="text-[10px] text-blue-700 font-medium">Navigate</span>
          </div>
        </a>
      )}
      {smsUrl && (
        <a href={smsUrl}>
          <div className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-purple-50 hover:bg-purple-100 transition-colors">
            <MessageSquare className="w-5 h-5 text-purple-600" />
            <span className="text-[10px] text-purple-700 font-medium">Text</span>
          </div>
        </a>
      )}
      {job.address && (
        <button onClick={handleCopyAddress}>
          <div className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
            <Copy className="w-5 h-5 text-gray-600" />
            <span className="text-[10px] text-gray-700 font-medium">{copied ? "Copied!" : "Copy Addr"}</span>
          </div>
        </button>
      )}
      {photoCount > 0 && (
        <div className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-amber-50">
          <Camera className="w-5 h-5 text-amber-600" />
          <span className="text-[10px] text-amber-700 font-medium">{photoCount} Photo{photoCount !== 1 ? "s" : ""}</span>
        </div>
      )}
      {job.notes && (
        <div className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-slate-50">
          <FileText className="w-5 h-5 text-slate-600" />
          <span className="text-[10px] text-slate-700 font-medium">Has Notes</span>
        </div>
      )}
    </div>
  );
}
