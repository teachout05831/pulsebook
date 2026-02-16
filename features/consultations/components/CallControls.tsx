"use client";

import { Mic, MicOff, Video, VideoOff, Monitor, MonitorOff, PhoneOff } from "lucide-react";

interface CallControlsProps {
  isMuted: boolean;
  isCameraOff: boolean;
  isScreenSharing: boolean;
  callDuration: number;
  primaryColor: string;
  onToggleMute: () => void;
  onToggleCamera: () => void;
  onToggleScreenShare: () => void;
  onEndCall: () => void;
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const pad = (n: number) => n.toString().padStart(2, "0");
  return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

export function CallControls({
  isMuted,
  isCameraOff,
  isScreenSharing,
  callDuration,
  primaryColor,
  onToggleMute,
  onToggleCamera,
  onToggleScreenShare,
  onEndCall,
}: CallControlsProps) {
  return (
    <div className="flex items-center justify-between px-6 py-4 bg-gray-900/95 backdrop-blur-sm border-t border-gray-800">
      {/* Duration */}
      <div className="flex items-center gap-2 min-w-[80px]">
        <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
        <span className="text-sm font-mono text-gray-300">{formatDuration(callDuration)}</span>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMute}
          className={`flex items-center justify-center h-12 w-12 rounded-full transition-all ${
            isMuted
              ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
              : "bg-gray-700/80 text-white hover:bg-gray-600"
          }`}
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
        </button>

        <button
          onClick={onToggleCamera}
          className={`flex items-center justify-center h-12 w-12 rounded-full transition-all ${
            isCameraOff
              ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
              : "bg-gray-700/80 text-white hover:bg-gray-600"
          }`}
          title={isCameraOff ? "Turn camera on" : "Turn camera off"}
        >
          {isCameraOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
        </button>

        <button
          onClick={onToggleScreenShare}
          className={`flex items-center justify-center h-12 w-12 rounded-full transition-all ${
            isScreenSharing
              ? "text-white hover:opacity-90"
              : "bg-gray-700/80 text-white hover:bg-gray-600"
          }`}
          style={isScreenSharing ? { backgroundColor: primaryColor } : undefined}
          title={isScreenSharing ? "Stop sharing" : "Share screen"}
        >
          {isScreenSharing ? <MonitorOff className="h-5 w-5" /> : <Monitor className="h-5 w-5" />}
        </button>

        <button
          onClick={onEndCall}
          className="flex items-center justify-center h-12 w-14 rounded-full bg-red-600 text-white hover:bg-red-700 transition-all"
          title="End call"
        >
          <PhoneOff className="h-5 w-5" />
        </button>
      </div>

      {/* Spacer for centering */}
      <div className="min-w-[80px]" />
    </div>
  );
}
