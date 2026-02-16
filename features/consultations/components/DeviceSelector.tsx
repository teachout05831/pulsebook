"use client";

import { useEffect, useState } from "react";
import { Mic, Video } from "lucide-react";

interface DeviceSelectorProps {
  onDevicesReady?: (stream: MediaStream) => void;
  selectedVideoId?: string;
  selectedAudioId?: string;
  onVideoChange?: (deviceId: string) => void;
  onAudioChange?: (deviceId: string) => void;
}

interface DeviceInfo {
  deviceId: string;
  label: string;
}

export function DeviceSelector({
  onDevicesReady,
  selectedVideoId,
  selectedAudioId,
  onVideoChange,
  onAudioChange,
}: DeviceSelectorProps) {
  const [videoDevices, setVideoDevices] = useState<DeviceInfo[]>([]);
  const [audioDevices, setAudioDevices] = useState<DeviceInfo[]>([]);

  useEffect(() => {
    async function enumerate() {
      try {
        // Request permissions first
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        onDevicesReady?.(stream);

        const devices = await navigator.mediaDevices.enumerateDevices();
        setVideoDevices(
          devices
            .filter((d) => d.kind === "videoinput")
            .map((d) => ({ deviceId: d.deviceId, label: d.label || `Camera ${d.deviceId.slice(0, 4)}` }))
        );
        setAudioDevices(
          devices
            .filter((d) => d.kind === "audioinput")
            .map((d) => ({ deviceId: d.deviceId, label: d.label || `Mic ${d.deviceId.slice(0, 4)}` }))
        );
      } catch {
        // User denied permissions
      }
    }
    enumerate();
  }, [onDevicesReady]);

  return (
    <div className="space-y-3 w-full max-w-sm">
      {/* Camera selector */}
      <div className="flex items-center gap-3">
        <Video className="h-4 w-4 text-gray-400 shrink-0" />
        <select
          value={selectedVideoId || ""}
          onChange={(e) => onVideoChange?.(e.target.value)}
          className="flex-1 bg-gray-800 text-gray-200 text-sm rounded-lg border border-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        >
          {videoDevices.map((d) => (
            <option key={d.deviceId} value={d.deviceId}>
              {d.label}
            </option>
          ))}
          {videoDevices.length === 0 && <option>No camera found</option>}
        </select>
      </div>

      {/* Mic selector */}
      <div className="flex items-center gap-3">
        <Mic className="h-4 w-4 text-gray-400 shrink-0" />
        <select
          value={selectedAudioId || ""}
          onChange={(e) => onAudioChange?.(e.target.value)}
          className="flex-1 bg-gray-800 text-gray-200 text-sm rounded-lg border border-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        >
          {audioDevices.map((d) => (
            <option key={d.deviceId} value={d.deviceId}>
              {d.label}
            </option>
          ))}
          {audioDevices.length === 0 && <option>No microphone found</option>}
        </select>
      </div>
    </div>
  );
}
