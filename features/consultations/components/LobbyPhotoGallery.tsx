"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Images } from "lucide-react";

interface LobbyPhotoGalleryProps {
  photos: string[];
  companyName: string;
  primaryColor: string;
}

export function LobbyPhotoGallery({ photos, companyName, primaryColor }: LobbyPhotoGalleryProps) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-rotate (pause on interaction)
  useEffect(() => {
    if (photos.length <= 1 || paused) return;
    const interval = setInterval(() => setActive((p) => (p + 1) % photos.length), 5000);
    return () => clearInterval(interval);
  }, [photos.length, paused]);

  // Resume auto-rotate after 8s of no interaction
  useEffect(() => {
    if (!paused) return;
    const timeout = setTimeout(() => setPaused(false), 8000);
    return () => clearTimeout(timeout);
  }, [paused]);

  const goTo = useCallback((i: number) => {
    setActive(i);
    setPaused(true);
  }, []);

  const prev = useCallback(() => goTo((active - 1 + photos.length) % photos.length), [active, photos.length, goTo]);
  const next = useCallback(() => goTo((active + 1) % photos.length), [active, photos.length, goTo]);

  // Touch/swipe support
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? next() : prev();
    }
  }, [next, prev]);

  if (photos.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-1">
        <Images className="h-4 w-4 text-white/30" />
        <span className="text-white/50 text-xs font-medium uppercase tracking-wider">Our Work</span>
      </div>

      {/* Main gallery image */}
      <div
        ref={containerRef}
        className="relative rounded-2xl overflow-hidden aspect-[16/10] bg-gray-900 group cursor-pointer"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {photos.map((url, i) => (
          <Image
            key={url}
            src={url}
            alt={`${companyName} - project ${i + 1}`}
            fill
            className={`object-cover transition-all duration-700 ${
              i === active ? "opacity-100 scale-100" : "opacity-0 scale-105"
            }`}
          />
        ))}

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

        {/* Navigation arrows (desktop) */}
        {photos.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-black/40 backdrop-blur-sm text-white/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-black/40 backdrop-blur-sm text-white/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Bottom info bar */}
        <div className="absolute bottom-0 left-0 right-0 px-4 py-3 flex items-end justify-between">
          <span className="text-white/90 text-sm font-medium">{companyName}</span>
          <div className="flex items-center gap-2">
            <span className="text-white/50 text-xs">{active + 1} / {photos.length}</span>
          </div>
        </div>
      </div>

      {/* Thumbnail strip */}
      {photos.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {photos.map((url, i) => (
            <button
              key={url}
              onClick={() => goTo(i)}
              className={`relative shrink-0 w-16 h-12 rounded-lg overflow-hidden transition-all ${
                i === active ? "opacity-100 scale-105" : "opacity-40 hover:opacity-70"
              }`}
              style={i === active ? { boxShadow: `0 0 0 2px ${primaryColor}` } : undefined}
            >
              <Image src={url} alt="" fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
