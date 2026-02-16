"use client";

import { Star, BadgeCheck, ShieldCheck, Quote } from "lucide-react";
import type { LobbyBrandKit } from "./ConsultationLobby";

interface LobbyTrustSignalsProps {
  brandKit: LobbyBrandKit;
  primaryColor: string;
}

export function LobbyTrustSignals({ brandKit, primaryColor }: LobbyTrustSignalsProps) {
  const hasRating = brandKit.googleRating && brandKit.googleRating > 0;
  const hasCerts = brandKit.certifications && brandKit.certifications.length > 0;
  const hasInsurance = brandKit.insuranceInfo;
  const hasTestimonial = brandKit.testimonial;

  if (!hasRating && !hasCerts && !hasInsurance && !hasTestimonial) return null;

  return (
    <div className="space-y-3">
      {/* Google Rating */}
      {hasRating && (
        <div className="bg-white/[0.03] backdrop-blur-sm rounded-xl p-3.5 border border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className="h-4 w-4"
                  fill={s <= Math.round(brandKit.googleRating!) ? "#facc15" : "transparent"}
                  stroke={s <= Math.round(brandKit.googleRating!) ? "#facc15" : "#4b5563"}
                />
              ))}
            </div>
            <div className="text-left">
              <span className="text-white font-semibold text-sm">{brandKit.googleRating}</span>
              <span className="text-white/40 text-xs ml-1.5">
                from {brandKit.googleReviewCount} reviews
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Certifications + Insurance */}
      {(hasCerts || hasInsurance) && (
        <div className="flex flex-wrap gap-2">
          {hasInsurance && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-emerald-300 text-xs font-medium">{brandKit.insuranceInfo}</span>
            </div>
          )}
          {brandKit.certifications?.map((cert) => (
            <div key={cert} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
              <BadgeCheck className="h-3.5 w-3.5" style={{ color: primaryColor }} />
              <span className="text-white/70 text-xs font-medium">{cert}</span>
            </div>
          ))}
        </div>
      )}

      {/* Testimonial */}
      {hasTestimonial && (
        <div className="bg-white/[0.03] backdrop-blur-sm rounded-xl p-4 border border-white/[0.06]">
          <Quote className="h-4 w-4 text-white/20 mb-2" />
          <p className="text-white/60 text-sm leading-relaxed italic mb-3">
            &ldquo;{brandKit.testimonial!.quote}&rdquo;
          </p>
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-white/10 flex items-center justify-center text-white/60 text-[10px] font-bold">
              {brandKit.testimonial!.author.charAt(0)}
            </div>
            <div>
              <span className="text-white/70 text-xs font-medium">{brandKit.testimonial!.author}</span>
              {brandKit.testimonial!.role && (
                <span className="text-white/30 text-xs ml-1.5">{brandKit.testimonial!.role}</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
