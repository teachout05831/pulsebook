"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ArrowRightLeft } from "lucide-react";
import type { LobbyBrandKit } from "./ConsultationLobby";

interface Props {
  brandKit: LobbyBrandKit;
  primaryColor: string;
}

export function CallInfoPortfolioTab({ brandKit, primaryColor }: Props) {
  const [activeBA, setActiveBA] = useState(0);
  const [showAfter, setShowAfter] = useState(true);
  const [activePhoto, setActivePhoto] = useState(0);
  const photos = brandKit.companyPhotos || [];
  const baPhotos = brandKit.beforeAfterPhotos || [];

  useEffect(() => {
    if (baPhotos.length === 0) return;
    const interval = setInterval(() => setShowAfter((p) => !p), 3000);
    return () => clearInterval(interval);
  }, [baPhotos.length]);

  return (
    <div className="p-4 space-y-4">
      {baPhotos.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <ArrowRightLeft className="h-3.5 w-3.5 text-white/30" />
            <span className="text-white/50 text-xs font-medium uppercase tracking-wider">Before & After</span>
          </div>
          <div className="relative rounded-xl overflow-hidden aspect-[4/3] bg-gray-900">
            <Image src={showAfter ? baPhotos[activeBA].after : baPhotos[activeBA].before} alt={showAfter ? "After" : "Before"} fill className="object-cover transition-opacity duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute top-3 left-3">
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${showAfter ? "bg-emerald-500/90 text-white" : "bg-white/90 text-gray-900"}`}>
                {showAfter ? "AFTER" : "BEFORE"}
              </span>
            </div>
            <button onClick={() => setShowAfter(!showAfter)} className="absolute bottom-3 right-3 px-3 py-1.5 rounded-lg bg-black/50 backdrop-blur-sm text-white/80 text-xs font-medium hover:bg-black/70 transition-colors flex items-center gap-1.5">
              <ArrowRightLeft className="h-3 w-3" />
              {showAfter ? "Show Before" : "Show After"}
            </button>
            {baPhotos[activeBA].label && (
              <div className="absolute bottom-3 left-3">
                <span className="text-white/90 text-xs font-medium">{baPhotos[activeBA].label}</span>
              </div>
            )}
          </div>
          {baPhotos.length > 1 && (
            <div className="flex items-center justify-between mt-2">
              <button onClick={() => setActiveBA((activeBA - 1 + baPhotos.length) % baPhotos.length)} className="h-7 w-7 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:bg-white/10">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-white/30 text-xs">{activeBA + 1} of {baPhotos.length}</span>
              <button onClick={() => setActiveBA((activeBA + 1) % baPhotos.length)} className="h-7 w-7 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:bg-white/10">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      )}
      {photos.length > 0 && (
        <div>
          <span className="text-white/50 text-xs font-medium uppercase tracking-wider block mb-3">Our Work</span>
          <div className="grid grid-cols-2 gap-2">
            {photos.map((url, i) => (
              <button key={url} onClick={() => setActivePhoto(i)} className={`relative rounded-lg overflow-hidden aspect-square transition-all ${i === activePhoto ? "ring-2 scale-[1.02]" : "opacity-60 hover:opacity-80"}`} style={i === activePhoto ? { boxShadow: `0 0 0 2px ${primaryColor}` } : undefined}>
                <Image src={url} alt={`Work ${i + 1}`} fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
