"use client";

import Image from "next/image";
import { Shield } from "lucide-react";
import { LobbyTrustSignals } from "./LobbyTrustSignals";
import { LobbyPhotoGallery } from "./LobbyPhotoGallery";
import { LobbyCameraPreview } from "./LobbyCameraPreview";
import type { BeforeAfterPhoto, Testimonial } from "../types";

export interface LobbyBrandKit {
  googleRating?: number | null;
  googleReviewCount?: number | null;
  certifications?: string[];
  insuranceInfo?: string | null;
  companyPhotos?: string[];
  beforeAfterPhotos?: BeforeAfterPhoto[];
  testimonials?: Testimonial[];
  testimonial?: Testimonial | null;
  companyDescription?: string | null;
  yearsInBusiness?: number | null;
  serviceArea?: string | null;
}

interface ConsultationLobbyProps {
  companyName: string;
  logoUrl: string | null;
  primaryColor: string;
  title: string;
  hostName: string;
  customerName: string | null;
  onJoin: () => void;
  isJoining: boolean;
  brandKit?: LobbyBrandKit;
}

export function ConsultationLobby({
  companyName, logoUrl, primaryColor, title, hostName,
  customerName, onJoin, isJoining, brandKit,
}: ConsultationLobbyProps) {
  const photos = brandKit?.companyPhotos || [];
  const hasGallery = photos.length > 0;
  const hasTrust = brandKit && (brandKit.googleRating || brandKit.certifications?.length || brandKit.insuranceInfo || brandKit.testimonial);

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[120px] opacity-20" style={{ background: primaryColor }} />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-[100px] opacity-10" style={{ background: primaryColor }} />

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-white/5">
          <div className="flex items-center gap-3">
            {logoUrl ? (
              <Image src={logoUrl} alt={companyName} width={32} height={32} className="h-8 w-8 object-contain rounded-lg" priority />
            ) : (
              <div className="h-8 w-8 rounded-lg flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: primaryColor }}>
                {companyName.charAt(0)}
              </div>
            )}
            <span className="text-white/90 font-medium text-sm">{companyName}</span>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-white/40 text-xs">
            <Shield className="h-3.5 w-3.5" />
            <span>End-to-end encrypted</span>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-auto">
          <div className="flex flex-col lg:flex-row items-start justify-center gap-6 lg:gap-10 px-4 sm:px-6 py-6 lg:py-12 max-w-6xl mx-auto">
            {/* Left column - Info + Trust + Gallery */}
            <div className="w-full lg:max-w-sm shrink-0 space-y-5">
              <div className="text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-4" style={{ backgroundColor: primaryColor + "15", color: primaryColor }}>
                  <div className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ backgroundColor: primaryColor }} />
                  Ready to connect
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 tracking-tight">{title}</h1>
                {customerName && (
                  <p className="text-base sm:text-lg text-white/60">Welcome, <span className="text-white/90">{customerName}</span></p>
                )}
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-full flex items-center justify-center text-white font-semibold" style={{ backgroundColor: primaryColor }}>
                    {hostName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{hostName}</p>
                    <p className="text-white/40 text-xs">{companyName}</p>
                  </div>
                </div>
              </div>

              {hasTrust && <LobbyTrustSignals brandKit={brandKit!} primaryColor={primaryColor} />}
              {hasGallery && <LobbyPhotoGallery photos={photos} companyName={companyName} primaryColor={primaryColor} />}
            </div>

            {/* Right column - Camera preview + Join */}
            <LobbyCameraPreview primaryColor={primaryColor} customerName={customerName} onJoin={onJoin} isJoining={isJoining} />
          </div>
        </div>

        <div className="px-6 py-3 border-t border-white/5 text-center">
          <span className="text-white/20 text-xs">Powered by Pulsebook</span>
        </div>
      </div>
    </div>
  );
}
