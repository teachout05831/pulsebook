"use client";

import Image from "next/image";
import { CheckCircle, FileText, BarChart3, ArrowRight, Home } from "lucide-react";
import { usePipelineStatus } from "@/features/document-layer/hooks/usePipelineStatus";
import { PipelineTimeline } from "@/features/document-layer/components/PipelineTimeline";

interface Props {
  companyName: string;
  logoUrl: string | null;
  primaryColor: string;
  durationSeconds: number;
  consultationId: string;
  liveEstimateId: string | null;
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return "Less than a minute";
  const minutes = Math.floor(seconds / 60);
  return minutes === 1 ? "1 minute" : `${minutes} minutes`;
}

export function HostPostCallSummary({ companyName, logoUrl, primaryColor, durationSeconds, consultationId, liveEstimateId }: Props) {
  const { state } = usePipelineStatus(consultationId);

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[150px] opacity-15" style={{ background: primaryColor }} />

      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-lg">
          <div className="flex justify-center mb-10">
            {logoUrl ? (
              <Image src={logoUrl} alt={companyName} width={200} height={40} className="h-10 w-auto object-contain" />
            ) : (
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl flex items-center justify-center text-white font-bold text-lg" style={{ backgroundColor: primaryColor }}>{companyName.charAt(0)}</div>
                <span className="text-white/90 font-semibold">{companyName}</span>
              </div>
            )}
          </div>

          <div className="text-center mb-8">
            <div className="h-20 w-20 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ backgroundColor: primaryColor + "15" }}>
              <CheckCircle className="h-10 w-10" style={{ color: primaryColor }} />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Call Complete</h1>
            {durationSeconds > 0 && (
              <div className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                <span className="text-white/40 text-sm">Duration: {formatDuration(durationSeconds)}</span>
              </div>
            )}
          </div>

          {liveEstimateId && (
            <div className="bg-white/[0.03] backdrop-blur-sm rounded-2xl border border-white/10 p-5 mb-5">
              <div className="flex items-center gap-3 mb-3">
                <FileText className="h-5 w-5" style={{ color: primaryColor }} />
                <h3 className="text-white font-medium">Live Estimate</h3>
              </div>
              <p className="text-white/40 text-sm mb-3">Estimate was built and shared during the call.</p>
              <a href={`/estimates/${liveEstimateId}`} className="inline-flex items-center gap-1.5 text-sm font-medium hover:opacity-80 transition-opacity" style={{ color: primaryColor }}>
                View Estimate <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          )}

          {state && state.status !== "idle" && (
            <div className="bg-white/[0.03] backdrop-blur-sm rounded-2xl border border-white/10 p-5 mb-5">
              <div className="flex items-center gap-3 mb-4">
                <BarChart3 className="h-5 w-5" style={{ color: primaryColor }} />
                <h3 className="text-white font-medium">AI Pipeline Progress</h3>
              </div>
              <PipelineTimeline status={state.status} error={state.error} />
            </div>
          )}

          <div className="flex gap-3 mt-6">
            <a href={`/consultations/${consultationId}`} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-white transition-colors" style={{ backgroundColor: primaryColor }}>
              <FileText className="h-4 w-4" />
              Review Details
            </a>
            <a href="/" className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-white/70 bg-white/[0.06] border border-white/10 hover:bg-white/[0.1] transition-colors">
              <Home className="h-4 w-4" />
              Dashboard
            </a>
          </div>

          <div className="mt-8 text-center">
            <span className="text-white/15 text-xs">Powered by ServicePro</span>
          </div>
        </div>
      </div>
    </div>
  );
}
