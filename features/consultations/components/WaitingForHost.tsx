"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Star, ShieldCheck, BadgeCheck, Clock } from "lucide-react";
import type { LobbyBrandKit } from "./ConsultationLobby";

interface WaitingForHostProps {
  hostName: string;
  companyName: string;
  primaryColor: string;
  brandKit?: LobbyBrandKit;
}

export function WaitingForHost({ hostName, companyName, primaryColor, brandKit }: WaitingForHostProps) {
  const [dots, setDots] = useState("");
  const [activeSlide, setActiveSlide] = useState(0);

  // Animate dots
  useEffect(() => {
    const interval = setInterval(() => setDots((d) => (d.length >= 3 ? "" : d + ".")), 600);
    return () => clearInterval(interval);
  }, []);

  // Build slides from brand data
  const slides: { type: string; content: React.ReactNode }[] = [];

  if (brandKit?.googleRating && brandKit.googleRating > 0) {
    slides.push({
      type: "rating",
      content: (
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className="h-6 w-6" fill={s <= Math.round(brandKit.googleRating!) ? "#facc15" : "transparent"} stroke={s <= Math.round(brandKit.googleRating!) ? "#facc15" : "#4b5563"} />
            ))}
          </div>
          <span className="text-white text-2xl font-bold">{brandKit.googleRating}</span>
          <span className="text-white/40 text-sm ml-2">from {brandKit.googleReviewCount} reviews</span>
        </div>
      ),
    });
  }

  if (brandKit?.testimonials && brandKit.testimonials.length > 0) {
    brandKit.testimonials.slice(0, 2).forEach((t) => {
      slides.push({
        type: "testimonial",
        content: (
          <div className="max-w-md text-center">
            <p className="text-white/70 text-lg leading-relaxed italic mb-4">&ldquo;{t.quote}&rdquo;</p>
            <div className="flex items-center justify-center gap-2">
              <div className="h-8 w-8 rounded-full flex items-center justify-center text-white/80 text-sm font-bold" style={{ backgroundColor: primaryColor + "30" }}>
                {t.author.charAt(0)}
              </div>
              <span className="text-white/60 text-sm font-medium">{t.author}</span>
              {t.role && <span className="text-white/30 text-sm">&middot; {t.role}</span>}
            </div>
          </div>
        ),
      });
    });
  }

  if (brandKit?.beforeAfterPhotos && brandKit.beforeAfterPhotos.length > 0) {
    const ba = brandKit.beforeAfterPhotos[0];
    slides.push({
      type: "beforeafter",
      content: (
        <div className="flex gap-3 max-w-lg">
          <div className="flex-1 rounded-xl overflow-hidden relative">
            <Image src={ba.before} alt="Before" width={400} height={160} className="w-full h-40 object-cover" />
            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-white/90 text-gray-900 text-xs font-bold">BEFORE</span>
          </div>
          <div className="flex-1 rounded-xl overflow-hidden relative">
            <Image src={ba.after} alt="After" width={400} height={160} className="w-full h-40 object-cover" />
            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-emerald-500/90 text-white text-xs font-bold">AFTER</span>
          </div>
        </div>
      ),
    });
  }

  // Auto-rotate slides
  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => setActiveSlide((p) => (p + 1) % slides.length), 6000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-950 to-black">
      {/* Ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full blur-[150px] opacity-10" style={{ background: primaryColor }} />

      {/* Host info */}
      <div className="relative z-10 text-center mb-10">
        <div className="h-20 w-20 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold ring-4 ring-white/5" style={{ backgroundColor: primaryColor }}>
          {hostName.charAt(0)}
        </div>
        <div className="flex items-center justify-center gap-2 mb-2">
          <Clock className="h-4 w-4" style={{ color: primaryColor }} />
          <span className="text-white/60 text-sm">Waiting for {hostName}{dots}</span>
        </div>
        <p className="text-white/30 text-xs">Your host will join shortly</p>
      </div>

      {/* Rotating trust content */}
      {slides.length > 0 && (
        <div className="relative z-10 w-full px-6">
          <div className="flex items-center justify-center min-h-[120px]">
            {slides.map((slide, i) => (
              <div key={slide.type + i} className={`absolute transition-all duration-700 ${i === activeSlide ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                {slide.content}
              </div>
            ))}
          </div>

          {/* Slide indicators */}
          {slides.length > 1 && (
            <div className="flex items-center justify-center gap-1.5 mt-6">
              {slides.map((slide, i) => (
                <div key={`dot-${slide.type}-${i}`} className={`h-1 rounded-full transition-all ${i === activeSlide ? "w-5" : "w-1.5 bg-white/20"}`} style={i === activeSlide ? { backgroundColor: primaryColor } : undefined} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Trust badges */}
      {(brandKit?.certifications?.length || brandKit?.insuranceInfo) && (
        <div className="relative z-10 flex flex-wrap items-center justify-center gap-2 mt-10">
          {brandKit?.insuranceInfo && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-emerald-300 text-xs font-medium">{brandKit.insuranceInfo}</span>
            </div>
          )}
          {brandKit?.certifications?.map((cert) => (
            <div key={cert} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
              <BadgeCheck className="h-3.5 w-3.5" style={{ color: primaryColor }} />
              <span className="text-white/50 text-xs font-medium">{cert}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
