"use client";

import Image from "next/image";
import type { SectionProps } from "./sectionProps";

function StatCard({ value, label, color }: { value: string; label: string; color: string }) {
  return (
    <div className="ep-card p-4 text-center" style={{ borderTop: `3px solid ${color}` }}>
      <p className="text-2xl font-bold" style={{ color }}>{value}</p>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
    </div>
  );
}

function ImgBlock({ src }: { src: string | undefined }) {
  if (src) {
    return (
      <div className="overflow-hidden shadow-md" style={{ borderRadius: "var(--border-radius, 0.75rem)" }}>
        <Image src={src} alt="About" width={800} height={450} className="w-full h-auto object-cover" />
      </div>
    );
  }
  return (
    <div className="bg-gray-100 aspect-video flex items-center justify-center text-gray-400 text-sm" style={{ borderRadius: "var(--border-radius, 0.75rem)" }}>
      Upload an image
    </div>
  );
}

function getAboutData(section: SectionProps["section"], brandKit: SectionProps["brandKit"]) {
  const pc = brandKit?.primaryColor || "#2563eb";
  const desc = (section.content.description as string) || brandKit?.companyDescription || "";
  const img = (section.content.imageUrl as string) || undefined;
  const heading = (section.content.title as string) || "Why Choose Us";
  const variant = (section.settings.variant as string) || "standard";
  const stats: { value: string; label: string }[] = [];
  const gr = brandKit?.googleRating ?? null;
  const grc = brandKit?.googleReviewCount ?? null;
  if (gr !== null && gr > 0) stats.push({ value: `${gr.toFixed(1)}/5`, label: "Google Rating" });
  if (grc !== null && grc > 0) stats.push({ value: `${grc}+`, label: "Reviews" });
  if ((brandKit?.certifications?.length ?? 0) > 0) stats.push({ value: `${brandKit!.certifications.length}`, label: "Certifications" });
  if (brandKit?.insuranceInfo) {
    const m = brandKit.insuranceInfo.match(/(\d+)\s*(?:year|yr)/i);
    if (m) stats.push({ value: `${m[1]}+`, label: "Years Experience" });
  }
  return { pc, desc, img, heading, variant, stats };
}

export function AboutSection({ section, brandKit, isPreview }: SectionProps) {
  const { pc, desc, img, heading, variant, stats } = getAboutData(section, brandKit);
  const hasContent = !!desc || !!img || stats.length > 0;

  if (!hasContent && !isPreview) return null;

  const descP = desc ? <p className="text-base leading-7 text-gray-600 whitespace-pre-line">{desc}</p>
    : isPreview ? <p className="text-sm text-gray-300 italic">Add a description in the editor...</p> : null;
  const statsGrid = stats.length > 0 ? (
    <div className="grid grid-cols-2 gap-3">
      {stats.map((s) => <StatCard key={s.label} value={s.value} label={s.label} color={pc} />)}
    </div>
  ) : null;

  if (variant === "split") {
    return (
      <div className="w-full px-4 ep-animate" style={{ background: `${pc}06`, paddingTop: "var(--section-spacing, 3rem)", paddingBottom: "var(--section-spacing, 3rem)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <span className="ep-section-label" style={{ color: pc }}>About Us</span>
            <h2 className="text-2xl sm:text-3xl" style={{ color: pc }}>{heading}</h2>
          </div>
          <div className="grid gap-10 md:grid-cols-2 items-start">
            <ImgBlock src={img} />
            <div className="space-y-6">{descP}{statsGrid}</div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "centered") {
    return (
      <div className="w-full px-4 ep-animate" style={{ background: `${pc}06`, paddingTop: "var(--section-spacing, 3rem)", paddingBottom: "var(--section-spacing, 3rem)" }}>
        <div className="max-w-3xl mx-auto text-center">
          <span className="ep-section-label" style={{ color: pc }}>About Us</span>
          <h2 className="text-2xl sm:text-3xl mb-8" style={{ color: pc }}>{heading}</h2>
          <div className="mb-8 max-w-md mx-auto"><ImgBlock src={img} /></div>
          {descP && <div className="mb-8">{descP}</div>}
          {statsGrid && <div className="max-w-lg mx-auto">{statsGrid}</div>}
        </div>
      </div>
    );
  }

  if (variant === "cards") {
    return (
      <div className="w-full px-4 ep-animate" style={{ background: `${pc}06`, paddingTop: "var(--section-spacing, 3rem)", paddingBottom: "var(--section-spacing, 3rem)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <span className="ep-section-label" style={{ color: pc }}>About Us</span>
            <h2 className="text-2xl sm:text-3xl" style={{ color: pc }}>{heading}</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="md:row-span-2"><ImgBlock src={img} /></div>
            <div className={`ep-card p-6 ${img ? "md:col-span-2" : "md:col-span-3"}`}>{descP}</div>
            {stats.map((s) => <StatCard key={s.label} value={s.value} label={s.label} color={pc} />)}
          </div>
        </div>
      </div>
    );
  }

  if (variant === "minimal") {
    return (
      <div className="w-full px-4 ep-animate" style={{ paddingTop: "var(--section-spacing, 2rem)", paddingBottom: "var(--section-spacing, 2rem)" }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl sm:text-2xl mb-4" style={{ color: pc }}>{heading}</h2>
          {descP}
          {stats.length > 0 && (
            <div className="flex flex-wrap gap-6 mt-6">
              {stats.map((s) => <span key={s.label} className="text-sm text-gray-600"><strong style={{ color: pc }}>{s.value}</strong> {s.label}</span>)}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Default: standard — text left, stats right (matches HTML mockup)
  return (
    <div className="w-full px-4 ep-animate" style={{ background: `${pc}06`, paddingTop: "var(--section-spacing, 3rem)", paddingBottom: "var(--section-spacing, 3rem)" }}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <span className="ep-section-label" style={{ color: pc }}>About Us</span>
          <h2 className="text-2xl sm:text-3xl" style={{ color: pc }}>{heading}</h2>
        </div>
        <div className={`grid gap-10 ${desc && stats.length > 0 ? "md:grid-cols-2" : ""} text-left`}>
          {descP && <div>{descP}</div>}
          {statsGrid && <div className="content-start">{statsGrid}</div>}
        </div>
        {img && <div className="mt-10"><ImgBlock src={img} /></div>}
      </div>
    </div>
  );
}
