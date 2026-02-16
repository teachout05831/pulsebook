"use client";

import { Star } from "lucide-react";
import type { LobbyBrandKit } from "./ConsultationLobby";

interface Props {
  brandKit: LobbyBrandKit;
  primaryColor: string;
}

export function CallInfoReviewsTab({ brandKit, primaryColor }: Props) {
  const testimonials = brandKit.testimonials || [];
  const hasRating = brandKit.googleRating && brandKit.googleRating > 0;

  return (
    <div className="p-4 space-y-4">
      {hasRating && (
        <div className="text-center py-4">
          <div className="text-4xl font-bold text-white mb-1">{brandKit.googleRating}</div>
          <div className="flex items-center justify-center gap-0.5 mb-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className="h-5 w-5" fill={s <= Math.round(brandKit.googleRating!) ? "#facc15" : "transparent"} stroke={s <= Math.round(brandKit.googleRating!) ? "#facc15" : "#4b5563"} />
            ))}
          </div>
          <span className="text-white/40 text-sm">{brandKit.googleReviewCount} Google reviews</span>
        </div>
      )}
      {testimonials.map((t) => (
        <div key={t.author} className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.06]">
          <div className="flex gap-0.5 mb-3">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className="h-3 w-3" fill="#facc15" stroke="#facc15" />
            ))}
          </div>
          <p className="text-white/60 text-sm leading-relaxed italic mb-3">&ldquo;{t.quote}&rdquo;</p>
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full flex items-center justify-center text-white/70 text-xs font-bold" style={{ backgroundColor: primaryColor + "30" }}>
              {t.author.charAt(0)}
            </div>
            <div>
              <span className="text-white/70 text-xs font-medium">{t.author}</span>
              {t.role && <span className="text-white/30 text-xs ml-1.5">{t.role}</span>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
