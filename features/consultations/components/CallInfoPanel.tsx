"use client";

import { useState } from "react";
import { X, Images, Star, Building2 } from "lucide-react";
import { CallInfoPortfolioTab } from "./CallInfoPortfolioTab";
import { CallInfoReviewsTab } from "./CallInfoReviewsTab";
import { CallInfoAboutTab } from "./CallInfoAboutTab";
import type { LobbyBrandKit } from "./ConsultationLobby";

type Tab = "portfolio" | "reviews" | "about";

interface CallInfoPanelProps {
  open: boolean;
  onClose: () => void;
  companyName: string;
  primaryColor: string;
  brandKit: LobbyBrandKit;
}

export function CallInfoPanel({ open, onClose, companyName, primaryColor, brandKit }: CallInfoPanelProps) {
  const [tab, setTab] = useState<Tab>("portfolio");

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "portfolio", label: "Portfolio", icon: <Images className="h-3.5 w-3.5" /> },
    { key: "reviews", label: "Reviews", icon: <Star className="h-3.5 w-3.5" /> },
    { key: "about", label: "About", icon: <Building2 className="h-3.5 w-3.5" /> },
  ];

  return (
    <div className={`h-full bg-black/50 backdrop-blur-xl border-l border-white/5 flex flex-col transition-all duration-300 ${open ? "w-80" : "w-0 overflow-hidden"}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 shrink-0">
        <span className="text-white/80 text-sm font-medium">{companyName}</span>
        <button onClick={onClose} className="text-white/30 hover:text-white/60 transition-colors">
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/5 shrink-0">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-all border-b-2 ${
              tab === t.key ? "text-white border-current" : "text-white/30 border-transparent hover:text-white/50"
            }`}
            style={tab === t.key ? { color: primaryColor, borderColor: primaryColor } : undefined}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {tab === "portfolio" && <CallInfoPortfolioTab brandKit={brandKit} primaryColor={primaryColor} />}
        {tab === "reviews" && <CallInfoReviewsTab brandKit={brandKit} primaryColor={primaryColor} />}
        {tab === "about" && <CallInfoAboutTab companyName={companyName} primaryColor={primaryColor} brandKit={brandKit} />}
      </div>
    </div>
  );
}
