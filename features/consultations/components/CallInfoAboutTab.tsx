"use client";

import type { LobbyBrandKit } from "./ConsultationLobby";

interface Props {
  companyName: string;
  primaryColor: string;
  brandKit: LobbyBrandKit;
}

export function CallInfoAboutTab({ companyName, primaryColor, brandKit }: Props) {
  return (
    <div className="p-4 space-y-4">
      <div className="text-center py-3">
        <div className="h-16 w-16 rounded-2xl mx-auto mb-3 flex items-center justify-center text-white text-2xl font-bold" style={{ backgroundColor: primaryColor }}>
          {companyName.charAt(0)}
        </div>
        <h3 className="text-white font-semibold text-lg">{companyName}</h3>
        {brandKit.companyDescription && (
          <p className="text-white/50 text-sm mt-2 leading-relaxed">{brandKit.companyDescription}</p>
        )}
      </div>
      <div className="space-y-2">
        {brandKit.yearsInBusiness && (
          <div className="flex items-center justify-between bg-white/[0.03] rounded-lg px-4 py-3 border border-white/[0.06]">
            <span className="text-white/50 text-sm">Years in Business</span>
            <span className="text-white font-semibold text-sm">{brandKit.yearsInBusiness}+</span>
          </div>
        )}
        {brandKit.serviceArea && (
          <div className="flex items-center justify-between bg-white/[0.03] rounded-lg px-4 py-3 border border-white/[0.06]">
            <span className="text-white/50 text-sm">Service Area</span>
            <span className="text-white font-semibold text-sm">{brandKit.serviceArea}</span>
          </div>
        )}
        {brandKit.insuranceInfo && (
          <div className="flex items-center justify-between bg-white/[0.03] rounded-lg px-4 py-3 border border-white/[0.06]">
            <span className="text-white/50 text-sm">Insurance</span>
            <span className="text-emerald-400 font-semibold text-sm">{brandKit.insuranceInfo}</span>
          </div>
        )}
      </div>
      {brandKit.certifications && brandKit.certifications.length > 0 && (
        <div>
          <span className="text-white/50 text-xs font-medium uppercase tracking-wider block mb-2">Certifications</span>
          <div className="flex flex-wrap gap-2">
            {brandKit.certifications.map((cert) => (
              <span key={cert} className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/70 text-xs font-medium">{cert}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
