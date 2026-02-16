"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Camera, ChevronLeft, ChevronRight } from "lucide-react";
import type { SectionProps } from "./sectionProps";

export function BeforeAfterSection({ section, brandKit }: SectionProps) {
  const [position, setPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const title = (section.content.title as string) || "Before & After";
  const beforeImage = section.content.beforeImage as string | undefined;
  const afterImage = section.content.afterImage as string | undefined;
  const beforeLabel = (section.content.beforeLabel as string) || "Before";
  const afterLabel = (section.content.afterLabel as string) || "After";
  const primaryColor = brandKit?.primaryColor || "#2563eb";

  const calcPosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setPosition(pct);
  }, []);

  const handleMouseDown = () => setIsDragging(true);

  useEffect(() => {
    if (!isDragging) return;
    const onMove = (e: MouseEvent) => { e.preventDefault(); calcPosition(e.clientX); };
    const onUp = () => setIsDragging(false);
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    return () => { document.removeEventListener("mousemove", onMove); document.removeEventListener("mouseup", onUp); };
  }, [isDragging, calcPosition]);

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) calcPosition(e.touches[0].clientX);
  };

  const hasImages = beforeImage && afterImage;

  return (
    <div className="w-full px-4 ep-animate" style={{ paddingTop: "var(--section-spacing)", paddingBottom: "var(--section-spacing)" }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <span className="ep-section-label" style={{ color: primaryColor }}>Before & After</span>
          <h2 className="text-xl sm:text-2xl" style={{ color: primaryColor }}>
            {title}
          </h2>
        </div>

        {!hasImages ? (
          <div
            className="relative w-full aspect-[16/9] bg-gray-100 flex items-center justify-center gap-8"
            style={{ borderRadius: "var(--border-radius)" }}
          >
            <div className="flex flex-col items-center text-gray-400">
              <Camera className="w-10 h-10 mb-2" />
              <span className="text-sm font-medium">{beforeLabel}</span>
            </div>
            <div className="h-16 w-px bg-gray-300" />
            <div className="flex flex-col items-center text-gray-400">
              <Camera className="w-10 h-10 mb-2" />
              <span className="text-sm font-medium">{afterLabel}</span>
            </div>
          </div>
        ) : (
          <div
            ref={containerRef}
            className="relative w-full aspect-[16/9] overflow-hidden select-none cursor-col-resize"
            style={{ borderRadius: "var(--border-radius)" }}
            onTouchStart={(e) => { if (e.touches.length > 0) calcPosition(e.touches[0].clientX); }}
            onTouchMove={handleTouchMove}
          >
            {/* After image - full width underneath */}
            <img
              src={afterImage}
              alt={afterLabel}
              className="absolute inset-0 w-full h-full object-cover"
              draggable={false}
            />

            {/* Before image - clipped by slider position */}
            <div
              className="absolute inset-0"
              style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
            >
              <img
                src={beforeImage}
                alt={beforeLabel}
                className="w-full h-full object-cover"
                draggable={false}
              />
            </div>

            {/* Labels */}
            <span className="absolute top-3 left-3 bg-black/60 text-white text-xs font-semibold px-3 py-1 rounded-full pointer-events-none">
              {beforeLabel}
            </span>
            <span className="absolute top-3 right-3 bg-black/60 text-white text-xs font-semibold px-3 py-1 rounded-full pointer-events-none">
              {afterLabel}
            </span>

            {/* Slider line + handle */}
            <div
              className="absolute top-0 bottom-0 pointer-events-none"
              style={{ left: `${position}%`, transform: "translateX(-50%)" }}
            >
              <div className="w-0.5 h-full bg-white shadow-lg" />
              <button
                type="button"
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center pointer-events-auto hover:scale-110 transition-transform"
                style={{ border: `2px solid ${primaryColor}` }}
                onMouseDown={handleMouseDown}
                onTouchStart={(e) => { e.stopPropagation(); }}
                aria-label="Drag to compare before and after"
              >
                <ChevronLeft className="w-4 h-4" style={{ color: primaryColor }} />
                <ChevronRight className="w-4 h-4" style={{ color: primaryColor }} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
