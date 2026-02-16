"use client";

import { X } from "lucide-react";
import { WidgetPopupContent } from "./WidgetPopupContent";
import type { CallWidget } from "./CallWidgetBar";
import type { LobbyBrandKit } from "./ConsultationLobby";

interface CallWidgetPopupProps {
  widget: CallWidget;
  brandKit: LobbyBrandKit;
  primaryColor: string;
  companyName: string;
  onClose: () => void;
}

export function CallWidgetPopup({ widget, brandKit, primaryColor, companyName, onClose }: CallWidgetPopupProps) {
  return (
    <div className="absolute inset-2 sm:inset-6 lg:inset-10 z-40 flex flex-col">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-2xl" onClick={onClose} />
      <div className="relative flex-1 flex flex-col mx-auto w-full max-w-2xl bg-gray-900/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 sm:px-6 sm:py-4 border-b border-white/5 shrink-0">
          <h2 className="text-white font-semibold text-base sm:text-lg">{widget.label}</h2>
          <button onClick={onClose} className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40 hover:text-white/70 hover:bg-white/10 transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6" style={{ WebkitOverflowScrolling: "touch" }}>
          <WidgetPopupContent widget={widget} brandKit={brandKit} primaryColor={primaryColor} companyName={companyName} />
        </div>
      </div>
    </div>
  );
}
