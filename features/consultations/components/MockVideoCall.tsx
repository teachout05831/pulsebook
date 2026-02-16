"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Mic, MicOff, Video, VideoOff, Monitor, PhoneOff, MessageSquare, Users, ExternalLink } from "lucide-react";
import { MockCallContent } from "./MockCallContent";
import { WaitingForHost } from "./WaitingForHost";
import { CallWidgetPopup } from "./CallWidgetPopup";
import { WIDGET_ICONS, type PresetWidgetType, type CallWidget } from "./CallWidgetBar";
import type { LobbyBrandKit } from "./ConsultationLobby";

interface MockVideoCallProps {
  companyName: string;
  logoUrl: string | null;
  primaryColor: string;
  hostName: string;
  customerName: string | null;
  onEndCall: () => void;
  brandKit?: LobbyBrandKit;
  widgets?: CallWidget[];
}

function formatTime(s: number): string {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
}

export function MockVideoCall({
  companyName, logoUrl, primaryColor, hostName, customerName, onEndCall, brandKit, widgets = [],
}: MockVideoCallProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [duration, setDuration] = useState(0);
  const [hostJoined, setHostJoined] = useState(false);
  const [activeWidget, setActiveWidget] = useState<string | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => setHostJoined(true), 5000);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!hostJoined) return;
    const interval = setInterval(() => setDuration((d) => d + 1), 1000);
    return () => clearInterval(interval);
  }, [hostJoined]);

  const toggleWidget = (id: string) => setActiveWidget((prev) => (prev === id ? null : id));
  const activeWidgetData = widgets.find((w) => w.id === activeWidget) || null;

  return (
    <div className="h-screen bg-[#0a0a0f] flex flex-col overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-3 bg-black/40 backdrop-blur-md border-b border-white/5 z-20">
        <div className="flex items-center gap-3">
          {logoUrl ? (
            <Image src={logoUrl} alt={companyName} width={28} height={28} className="h-7 w-7 object-contain rounded-lg" priority />
          ) : (
            <div className="h-7 w-7 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: primaryColor }}>
              {companyName.charAt(0)}
            </div>
          )}
          <span className="text-white/80 font-medium text-sm">{companyName}</span>
        </div>
        <div className="flex items-center gap-4">
          {hostJoined && (
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-white/50 text-xs font-mono">{formatTime(duration)}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 text-white/30">
            <Users className="h-3.5 w-3.5" />
            <span className="text-xs">{hostJoined ? 2 : 1}</span>
          </div>
        </div>
      </div>

      {/* Video area - clean, nothing covering it */}
      <div className="flex-1 relative">
        {hostJoined ? (
          <MockCallContent hostName={hostName} companyName={companyName} primaryColor={primaryColor} customerName={customerName} isCameraOff={isCameraOff} />
        ) : (
          <WaitingForHost hostName={hostName} companyName={companyName} primaryColor={primaryColor} brandKit={brandKit} />
        )}

        {/* Widget popup overlay */}
        {activeWidgetData && brandKit && (
          <CallWidgetPopup widget={activeWidgetData} brandKit={brandKit} primaryColor={primaryColor} companyName={companyName} onClose={() => setActiveWidget(null)} />
        )}
      </div>

      {/* Bottom bar: controls + widgets unified */}
      <div className="relative z-20 bg-black/60 backdrop-blur-md border-t border-white/5">
        {/* Main controls row */}
        <div className="flex items-center justify-center gap-3 px-6 py-3">
          <div className="absolute left-6 flex items-center gap-2">
            {hostJoined && <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />}
            <span className="text-white/40 text-xs font-mono">{formatTime(duration)}</span>
          </div>

          <button onClick={() => setIsMuted(!isMuted)} className={`h-11 w-11 rounded-full flex items-center justify-center transition-all ${isMuted ? "bg-red-500/20 text-red-400 ring-1 ring-red-500/30" : "bg-white/10 text-white hover:bg-white/15"}`}>
            {isMuted ? <MicOff className="h-4.5 w-4.5" /> : <Mic className="h-4.5 w-4.5" />}
          </button>
          <button onClick={() => setIsCameraOff(!isCameraOff)} className={`h-11 w-11 rounded-full flex items-center justify-center transition-all ${isCameraOff ? "bg-red-500/20 text-red-400 ring-1 ring-red-500/30" : "bg-white/10 text-white hover:bg-white/15"}`}>
            {isCameraOff ? <VideoOff className="h-4.5 w-4.5" /> : <Video className="h-4.5 w-4.5" />}
          </button>
          <button onClick={() => setIsScreenSharing(!isScreenSharing)} className={`h-11 w-11 rounded-full flex items-center justify-center transition-all ${isScreenSharing ? "text-white" : "bg-white/10 text-white hover:bg-white/15"}`} style={isScreenSharing ? { backgroundColor: primaryColor } : undefined}>
            <Monitor className="h-4.5 w-4.5" />
          </button>
          <button className="h-11 w-11 rounded-full flex items-center justify-center bg-white/10 text-white hover:bg-white/15 transition-all">
            <MessageSquare className="h-4.5 w-4.5" />
          </button>
          <div className="w-2" />
          <button onClick={onEndCall} className="h-11 px-5 rounded-full bg-red-600 text-white hover:bg-red-700 transition-all flex items-center gap-2 font-medium text-sm">
            <PhoneOff className="h-4 w-4" />
            End
          </button>
        </div>

        {/* Widget buttons row */}
        {widgets.length > 0 && (
          <div className="flex items-center justify-center gap-2 px-6 pb-3 pt-0.5">
            <div className="flex items-center gap-1.5 bg-white/[0.03] rounded-xl px-1.5 py-1.5 border border-white/[0.06]">
              {widgets.map((w) => {
                const Icon = WIDGET_ICONS[w.type as PresetWidgetType] || ExternalLink;
                const isActive = activeWidget === w.id;
                return (
                  <button
                    key={w.id}
                    onClick={() => toggleWidget(w.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      isActive ? "text-white shadow-md" : "text-white/40 hover:text-white/70 hover:bg-white/5"
                    }`}
                    style={isActive ? { backgroundColor: primaryColor, boxShadow: `0 2px 12px ${primaryColor}40` } : undefined}
                  >
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
  );
}
