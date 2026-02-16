"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, ChevronLeft, ChevronRight, ArrowRightLeft } from "lucide-react";
import type { LobbyBrandKit } from "./ConsultationLobby";

export function ReviewsContent({ brandKit, primaryColor }: { brandKit: LobbyBrandKit; primaryColor: string }) {
  const testimonials = brandKit.testimonials || [];
  const hasRating = brandKit.googleRating && brandKit.googleRating > 0;
  return (
    <div className="space-y-5">
      {hasRating && (
        <div className="text-center pb-5 border-b border-white/5">
          <div className="text-5xl font-bold text-white mb-2">{brandKit.googleRating}</div>
          <div className="flex items-center justify-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className="h-6 w-6" fill={s <= Math.round(brandKit.googleRating!) ? "#facc15" : "transparent"} stroke={s <= Math.round(brandKit.googleRating!) ? "#facc15" : "#4b5563"} />
            ))}
          </div>
          <span className="text-white/40 text-sm">Based on {brandKit.googleReviewCount} reviews</span>
        </div>
      )}
      <div className="space-y-4">
        {testimonials.map((t, i) => (
          <div key={t.author} className="bg-white/[0.03] rounded-xl p-5 border border-white/[0.06]">
            <div className="flex gap-0.5 mb-3">
              {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="h-4 w-4" fill="#facc15" stroke="#facc15" />)}
            </div>
            <p className="text-white/70 text-sm leading-relaxed mb-4">&ldquo;{t.quote}&rdquo;</p>
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full flex items-center justify-center text-white/80 text-sm font-bold" style={{ backgroundColor: primaryColor + "25" }}>{t.author.charAt(0)}</div>
              <div>
                <span className="text-white/80 text-sm font-medium block">{t.author}</span>
                {t.role && <span className="text-white/35 text-xs">{t.role}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PortfolioContent({ brandKit, primaryColor, companyName }: { brandKit: LobbyBrandKit; primaryColor: string; companyName: string }) {
  const [activeBA, setActiveBA] = useState(0);
  const [showAfter, setShowAfter] = useState(true);
  const photos = brandKit.companyPhotos || [];
  const baPhotos = brandKit.beforeAfterPhotos || [];
  return (
    <div className="space-y-6">
      {baPhotos.length > 0 && (
        <div>
          <h3 className="text-white/50 text-xs font-medium uppercase tracking-wider mb-3">Before & After</h3>
          <div className="relative rounded-xl overflow-hidden aspect-[16/10] bg-gray-800">
            <Image src={showAfter ? baPhotos[activeBA].after : baPhotos[activeBA].before} alt={showAfter ? "After" : "Before"} fill className="object-cover transition-opacity duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute top-4 left-4">
              <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${showAfter ? "bg-emerald-500/90 text-white" : "bg-white/90 text-gray-900"}`}>{showAfter ? "AFTER" : "BEFORE"}</span>
            </div>
            <button onClick={() => setShowAfter(!showAfter)} className="absolute bottom-4 right-4 px-4 py-2 rounded-lg bg-black/50 backdrop-blur-sm text-white/80 text-sm font-medium hover:bg-black/70 transition-colors flex items-center gap-2">
              <ArrowRightLeft className="h-3.5 w-3.5" />
              {showAfter ? "Show Before" : "Show After"}
            </button>
            {baPhotos[activeBA].label && <div className="absolute bottom-4 left-4"><span className="text-white font-medium text-sm">{baPhotos[activeBA].label}</span></div>}
          </div>
          {baPhotos.length > 1 && (
            <div className="flex items-center justify-center gap-3 mt-3">
              <button onClick={() => setActiveBA((activeBA - 1 + baPhotos.length) % baPhotos.length)} className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:bg-white/10"><ChevronLeft className="h-4 w-4" /></button>
              <span className="text-white/30 text-sm">{activeBA + 1} of {baPhotos.length}</span>
              <button onClick={() => setActiveBA((activeBA + 1) % baPhotos.length)} className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:bg-white/10"><ChevronRight className="h-4 w-4" /></button>
            </div>
          )}
        </div>
      )}
      {photos.length > 0 && (
        <div>
          <h3 className="text-white/50 text-xs font-medium uppercase tracking-wider mb-3">Our Work</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {photos.map((url, i) => (
              <div key={url} className="rounded-xl overflow-hidden aspect-square bg-gray-800 relative">
                <Image src={url} alt={`${companyName} work ${i + 1}`} fill className="object-cover hover:scale-105 transition-transform duration-300" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
