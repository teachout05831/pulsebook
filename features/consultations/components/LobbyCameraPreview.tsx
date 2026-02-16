"use client";

import { useRef, useCallback, useState, useEffect } from "react";
import { Video, Mic, MicOff, VideoOff, User } from "lucide-react";

interface LobbyCameraPreviewProps {
  primaryColor: string;
  customerName: string | null;
  onJoin: () => void;
  isJoining: boolean;
}

export function LobbyCameraPreview({ primaryColor, customerName, onJoin, isJoining }: LobbyCameraPreviewProps) {
  const previewRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);

  useEffect(() => {
    async function startPreview() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        streamRef.current = stream;
        if (previewRef.current) previewRef.current.srcObject = stream;
        setHasPermission(true);
      } catch { /* denied */ }
    }
    startPreview();
    return () => { streamRef.current?.getTracks().forEach((t) => t.stop()); };
  }, []);

  const toggleMic = useCallback(() => {
    streamRef.current?.getAudioTracks().forEach((t) => { t.enabled = isMuted; });
    setIsMuted(!isMuted);
  }, [isMuted]);

  const toggleCamera = useCallback(() => {
    streamRef.current?.getVideoTracks().forEach((t) => { t.enabled = isCameraOff; });
    setIsCameraOff(!isCameraOff);
  }, [isCameraOff]);

  return (
    <div className="w-full lg:max-w-lg lg:sticky lg:top-12">
      <div className="relative rounded-2xl overflow-hidden bg-gray-900 aspect-video shadow-2xl ring-1 ring-white/10">
        <video ref={previewRef} autoPlay playsInline muted className="w-full h-full object-cover" style={{ transform: "scaleX(-1)" }} />
        {(!hasPermission || isCameraOff) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900">
            <div className="h-16 sm:h-20 w-16 sm:w-20 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: primaryColor + "20" }}>
              {isCameraOff ? <VideoOff className="h-7 w-7" style={{ color: primaryColor }} /> : <User className="h-7 w-7" style={{ color: primaryColor }} />}
            </div>
            <p className="text-white/40 text-sm">{isCameraOff ? "Camera is off" : "Allow camera access"}</p>
          </div>
        )}
        {hasPermission && !isCameraOff && (
          <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1.5">
            <span className="text-white text-xs font-medium">{customerName || "You"}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-3">
          <button onClick={toggleMic} className={`h-11 w-11 rounded-full flex items-center justify-center transition-all ${isMuted ? "bg-red-500/20 text-red-400 ring-1 ring-red-500/30" : "bg-white/10 text-white hover:bg-white/15"}`}>
            {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </button>
          <button onClick={toggleCamera} className={`h-11 w-11 rounded-full flex items-center justify-center transition-all ${isCameraOff ? "bg-red-500/20 text-red-400 ring-1 ring-red-500/30" : "bg-white/10 text-white hover:bg-white/15"}`}>
            {isCameraOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
          </button>
        </div>
        <button
          onClick={onJoin}
          disabled={isJoining}
          className="px-6 sm:px-8 py-3 rounded-xl text-white font-semibold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 shadow-lg"
          style={{ backgroundColor: primaryColor, boxShadow: `0 8px 32px ${primaryColor}40` }}
        >
          {isJoining ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Connecting...
            </span>
          ) : "Join Consultation"}
        </button>
      </div>
    </div>
  );
}
