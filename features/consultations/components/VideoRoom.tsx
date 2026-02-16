"use client";

import { useState, useEffect } from "react";
import { ExternalLink } from "lucide-react";
import { useDailyCall } from "../hooks/useDailyCall";
import { CallControls } from "./CallControls";
import { ConsultationBranding } from "./ConsultationBranding";
import { CallWidgetPopup } from "./CallWidgetPopup";
import { WIDGET_ICONS } from "./CallWidgetBar";
import type { PresetWidgetType, CallWidget } from "../types";
import type { LobbyBrandKit } from "./ConsultationLobby";
import { CoachSidePanel } from "@/features/ai-coach/components/CoachSidePanel";
import { LiveEstimatePanel } from "./LiveEstimatePanel";
import type { CoachCatalogItem, AICoachSettings, CoachLibraryCustomization } from "@/features/ai-coach/types";

const DEFAULT_COACH_SETTINGS: AICoachSettings = {
  enabled: true,
  showTranscript: true,
  showServiceSuggestions: true,
  showObjectionResponses: true,
  autoAdvanceStage: true,
};

interface VideoRoomProps {
  roomUrl: string;
  token: string | null;
  userName: string;
  companyName: string;
  logoUrl: string | null;
  primaryColor: string;
  onCallEnded?: () => void;
  widgets?: CallWidget[];
  brandKit?: LobbyBrandKit;
  isHost?: boolean;
  consultationId?: string;
  customerId?: string | null;
  onEstimateSaved?: (id: string) => void;
}

export function VideoRoom({
  roomUrl, token, userName, companyName, logoUrl, primaryColor, onCallEnded, widgets = [], brandKit, isHost = false, consultationId = '', customerId = null, onEstimateSaved,
}: VideoRoomProps) {
  const daily = useDailyCall({ roomUrl, token, userName, onCallEnded });
  const [activeWidget, setActiveWidget] = useState<string | null>(null);
  const [showEstimatePanel, setShowEstimatePanel] = useState(false);
  const [catalog, setCatalog] = useState<CoachCatalogItem[]>([]);
  const [coachSettings, setCoachSettings] = useState<AICoachSettings>(DEFAULT_COACH_SETTINGS);
  const [coachCustomization, setCoachCustomization] = useState<CoachLibraryCustomization | null>(null);

  // Load service catalog + coach settings for host
  useEffect(() => {
    if (!isHost) return;
    fetch('/api/ai-coach/services')
      .then((r) => r.ok ? r.json() : [])
      .then((data) => setCatalog(Array.isArray(data) ? data : []))
      .catch(() => {});
    fetch('/api/settings/ai-coach')
      .then((r) => r.ok ? r.json() : DEFAULT_COACH_SETTINGS)
      .then((data) => setCoachSettings({ ...DEFAULT_COACH_SETTINGS, ...data }))
      .catch(() => {});
    fetch('/api/settings/ai-coach/library')
      .then((r) => r.ok ? r.json() : null)
      .then((data) => data && setCoachCustomization(data))
      .catch(() => {});
  }, [isHost]);

  const toggleWidget = (id: string) => {
    const w = widgets.find(w => w.id === id);
    if (w?.type === "estimate" && isHost) { setShowEstimatePanel(prev => !prev); return; }
    setActiveWidget((prev) => (prev === id ? null : id));
  };
  const activeWidgetData = widgets.find((w) => w.id === activeWidget) || null;

  return (
    <div className="flex h-screen bg-gray-950">
      <div className="flex flex-col flex-1">
        <div className="flex items-center justify-between px-5 py-3 bg-gray-900/80 backdrop-blur-sm border-b border-gray-800">
          <ConsultationBranding companyName={companyName} logoUrl={logoUrl} primaryColor={primaryColor} size="sm" />
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <span className="text-xs text-gray-400">Connected</span>
          </div>
        </div>

        <div className="flex-1 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            {daily.remoteJoined ? (
              <video ref={daily.remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
            ) : (
              <div className="text-center">
                <div className="h-20 w-20 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold" style={{ backgroundColor: primaryColor }}>?</div>
                <p className="text-gray-400 text-sm">Waiting for the other participant to join...</p>
              </div>
            )}
          </div>

          <div className="absolute bottom-4 right-4 w-44 h-32 rounded-xl overflow-hidden shadow-2xl border-2 border-gray-700/50 bg-gray-800">
            <video ref={daily.localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover mirror" />
            {daily.isCameraOff && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                <span className="text-gray-500 text-xs">Camera off</span>
              </div>
            )}
          </div>

          {activeWidgetData && brandKit && (
            <CallWidgetPopup widget={activeWidgetData} brandKit={brandKit} primaryColor={primaryColor} companyName={companyName} onClose={() => setActiveWidget(null)} />
          )}
        </div>

        <div className="bg-gray-900/95 backdrop-blur-sm border-t border-gray-800">
          <CallControls
            isMuted={daily.isMuted}
            isCameraOff={daily.isCameraOff}
            isScreenSharing={daily.isScreenSharing}
            callDuration={daily.callDuration}
            primaryColor={primaryColor}
            onToggleMute={daily.toggleMute}
            onToggleCamera={daily.toggleCamera}
            onToggleScreenShare={daily.toggleScreenShare}
            onEndCall={daily.endCall}
          />
          {widgets.length > 0 && (
            <div className="flex items-center justify-center gap-2 px-6 pb-3 pt-0.5">
              <div className="flex items-center gap-1.5 bg-white/[0.03] rounded-xl px-1.5 py-1.5 border border-white/[0.06]">
                {widgets.map((w) => {
                  const Icon = WIDGET_ICONS[w.type as PresetWidgetType] || ExternalLink;
                  const isActive = activeWidget === w.id;
                  return (
                    <button key={w.id} onClick={() => toggleWidget(w.id)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${isActive ? "text-white shadow-md" : "text-white/40 hover:text-white/70 hover:bg-white/5"}`} style={isActive ? { backgroundColor: primaryColor, boxShadow: `0 2px 12px ${primaryColor}40` } : undefined}>
                      <Icon className="h-3.5 w-3.5" />
                      {w.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {isHost && showEstimatePanel && (
        <LiveEstimatePanel consultationId={consultationId} customerId={customerId} primaryColor={primaryColor} onClose={() => setShowEstimatePanel(false)} onSaved={onEstimateSaved} />
      )}
      {isHost && coachSettings.enabled && (
        <CoachSidePanel callObject={daily.callObject} catalog={catalog} settings={coachSettings} consultationId={consultationId} customization={coachCustomization} />
      )}
    </div>
  );
}
