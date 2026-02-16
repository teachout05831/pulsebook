"use client";

import Image from "next/image";
import type { SectionProps } from "./sectionProps";

interface Badge { id: string; label: string; imageUrl?: string }
type BadgeData = { type: string; label: string; imageUrl?: string; rating?: number; reviewCount?: number };

function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex gap-0.5">
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 20 20" fill={i < Math.round(rating) ? "#facc15" : "#d1d5db"} className="inline-block">
          <path d="M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.49L10 14.26 5.06 16.7l.94-5.49-4-3.9 5.53-.8L10 1.5z" />
        </svg>
      ))}
    </span>
  );
}

function BadgeIcon({ badge, pc }: { badge: BadgeData; pc: string }) {
  if (badge.imageUrl) return <Image src={badge.imageUrl} alt={badge.label} width={24} height={24} className="w-6 h-6 object-contain rounded" />;
  if (badge.type === "google") return <Stars rating={badge.rating || 0} />;
  if (badge.type === "insurance") return <span className="inline-flex items-center justify-center w-5 h-5 rounded-full text-white text-xs font-bold shrink-0" style={{ background: pc }}>&#9670;</span>;
  return <span className="inline-flex items-center justify-center w-5 h-5 rounded-full text-white text-xs font-bold shrink-0" style={{ background: pc }}>&#10003;</span>;
}

function useBadgeData(section: SectionProps["section"], brandKit: SectionProps["brandKit"]) {
  const pc = brandKit?.primaryColor || "#2563eb";
  const variant = (section.settings.variant as string) || "horizontal";
  const customBadges = (section.content.badges as Badge[]) || [];
  const showGoogle = section.content.showGoogleRating !== false;
  const showCerts = section.content.showCertifications !== false;
  const showInsurance = section.content.showInsurance !== false;

  const all: BadgeData[] = [];
  const gr = brandKit?.googleRating ?? null;
  if (showGoogle && gr !== null && gr > 0) {
    all.push({ type: "google", label: `${gr.toFixed(1)}`, rating: gr, reviewCount: brandKit?.googleReviewCount ?? undefined });
  }
  if (showCerts) (brandKit?.certifications || []).forEach((c) => all.push({ type: "cert", label: c }));
  if (showInsurance && brandKit?.insuranceInfo) all.push({ type: "insurance", label: brandKit.insuranceInfo });
  customBadges.filter((b) => b.label).forEach((b) => all.push({ type: "custom", label: b.label, imageUrl: b.imageUrl }));

  return { pc, variant, all, hasAny: all.length > 0 };
}

export function TrustBadgesSection({ section, brandKit, isPreview }: SectionProps) {
  const { pc, variant, all, hasAny } = useBadgeData(section, brandKit);

  if (!hasAny && !isPreview) return null;

  if (!hasAny && isPreview) {
    return (
      <div className="w-full border-y border-gray-200 px-4 py-5 ep-animate">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center max-w-3xl mx-auto">
          <p className="text-sm text-gray-400">Add trust badges in the editor, or configure Google rating &amp; certifications in Settings &gt; Brand Kit.</p>
        </div>
      </div>
    );
  }

  if (variant === "grid") {
    return (
      <div className="w-full bg-gradient-to-r from-gray-50 via-white to-gray-50 border-y border-gray-200 px-4 py-8 ep-animate">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-2xl mx-auto">
          {all.map((b) => (
            <div key={b.label} className="ep-card flex flex-col items-center gap-2 p-5 text-center">
              <BadgeIcon badge={b} pc={pc} />
              {b.type === "google" ? <><strong className="text-xl">{b.label}</strong>{b.reviewCount && <span className="text-xs text-gray-500">{b.reviewCount} reviews</span>}</> : <span className="text-sm text-gray-800 font-medium">{b.label}</span>}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (variant === "banner") {
    return (
      <div className="w-full px-4 py-5 ep-animate" style={{ background: pc }}>
        <div className="flex gap-6 justify-center items-center flex-wrap max-w-5xl mx-auto">
          {all.map((b, i) => (
            <span key={b.label} className="flex items-center gap-2 text-white text-sm font-medium whitespace-nowrap">
              {b.type === "google" ? <><Stars rating={b.rating || 0} /> <strong>{b.label}</strong> {b.reviewCount && <span className="opacity-75">({b.reviewCount})</span>}</> : <>{b.imageUrl ? <Image src={b.imageUrl} alt="" width={20} height={20} className="w-5 h-5 object-contain rounded" /> : <span className="opacity-75">{b.type === "insurance" ? "◆" : "✓"}</span>} {b.label}</>}
              {i < all.length - 1 && <span className="w-px h-5 bg-white/30 ml-4" />}
            </span>
          ))}
        </div>
      </div>
    );
  }

  if (variant === "minimal") {
    return (
      <div className="w-full border-b border-gray-200 px-4 py-3 ep-animate">
        <div className="flex gap-4 justify-center flex-wrap text-xs text-gray-500 items-center">
          {all.map((b, i) => (
            <span key={b.label} className="inline-flex items-center gap-1.5">
              {b.imageUrl && <Image src={b.imageUrl} alt="" width={16} height={16} className="w-4 h-4 object-contain rounded" />}
              {b.type === "google" ? `★ ${b.label} Google Rating` : b.label}
              {i < all.length - 1 && <span className="ml-4">•</span>}
            </span>
          ))}
        </div>
      </div>
    );
  }

  if (variant === "stacked") {
    return (
      <div className="w-full px-4 py-6 ep-animate">
        <div className="max-w-sm mx-auto flex flex-col gap-2">
          {all.map((b) => (
            <div key={b.label} className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg">
              <BadgeIcon badge={b} pc={pc} />
              <div>
                <strong className="text-sm">{b.type === "google" ? `${b.label}/5 Google Rating` : b.label}</strong>
                {b.type === "google" && b.reviewCount && <p className="text-xs text-gray-500">{b.reviewCount} verified reviews</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Default: horizontal
  return (
    <div className="w-full bg-gradient-to-r from-gray-50 via-white to-gray-50 border-y border-gray-200 ep-animate">
      <div className="max-w-5xl mx-auto px-4 py-5">
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-1 items-center justify-center flex-wrap">
          {all.map((b) => (
            <span key={b.label} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold whitespace-nowrap rounded-full" style={{ background: `${pc}0F`, border: `1px solid ${pc}1F`, color: pc }}>
              <BadgeIcon badge={b} pc={pc} />
              {b.type === "google" ? <><span className="font-bold" style={{ color: "#374151" }}>{b.label}</span>{b.reviewCount && <span className="text-gray-500 font-normal">({b.reviewCount} reviews)</span>}</> : <span style={{ color: pc }}>{b.label}</span>}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
