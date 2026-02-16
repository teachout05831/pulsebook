"use client";

import { useRef, useEffect } from "react";
import { Mic, VideoOff, Maximize2 } from "lucide-react";

interface MockCallContentProps {
  hostName: string;
  companyName: string;
  primaryColor: string;
  customerName: string | null;
  isCameraOff: boolean;
}

export function MockCallContent({ hostName, companyName, primaryColor, customerName, isCameraOff }: MockCallContentProps) {
  const localVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    async function start() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      } catch { /* no camera */ }
    }
    start();
    return () => {
      if (localVideoRef.current?.srcObject) {
        (localVideoRef.current.srcObject as MediaStream).getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  return (
    <div className="flex-1 relative">
      {/* Remote participant (Host) - large view */}
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-950">
        <div className="text-center">
          <div className="h-28 w-28 rounded-full mx-auto mb-5 flex items-center justify-center text-white text-4xl font-bold ring-4 ring-white/5" style={{ backgroundColor: primaryColor }}>
            {hostName.charAt(0)}
          </div>
          <p className="text-white font-medium text-lg">{hostName}</p>
          <p className="text-white/40 text-sm mt-1">{companyName}</p>
          <div className="flex items-center justify-center gap-2 mt-3">
            <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
            <span className="text-green-400/70 text-xs">Connected</span>
          </div>
        </div>
        <div className="absolute inset-0 m-auto h-36 w-36 rounded-full animate-ping opacity-5" style={{ backgroundColor: primaryColor }} />
      </div>

      {/* Host name overlay */}
      <div className="absolute bottom-20 left-5 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1.5 flex items-center gap-2">
        <Mic className="h-3 w-3 text-white/60" />
        <span className="text-white/90 text-xs font-medium">{hostName}</span>
      </div>

      {/* Self view (PiP) */}
      <div className="absolute bottom-20 right-5 w-48 h-36 rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10 bg-gray-800 z-10 group">
        <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" style={{ transform: "scaleX(-1)" }} />
        {isCameraOff && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
            <div className="h-12 w-12 rounded-full flex items-center justify-center" style={{ backgroundColor: primaryColor + "20" }}>
              <VideoOff className="h-5 w-5" style={{ color: primaryColor }} />
            </div>
          </div>
        )}
        <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm rounded px-2 py-0.5">
          <span className="text-white text-[10px] font-medium">{customerName || "You"}</span>
        </div>
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Maximize2 className="h-3.5 w-3.5 text-white/60" />
        </div>
      </div>
    </div>
  );
}
