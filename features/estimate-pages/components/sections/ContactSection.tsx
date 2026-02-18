"use client";

import Image from "next/image";
import type { SectionProps } from "./sectionProps";

function darkenColor(hex: string, amount: number): string {
  const h = hex.replace("#", "");
  const num = parseInt(h, 16);
  const r = Math.max(0, (num >> 16) - amount);
  const g = Math.max(0, ((num >> 8) & 0x00ff) - amount);
  const b = Math.max(0, (num & 0x0000ff) - amount);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

const colHeading = "text-sm font-semibold uppercase tracking-wider text-white/70 mb-3";

function DetailedFooter({ section, brandKit }: SectionProps) {
  const hours = (section.content.hours as string) || "Mon-Fri: 8am-5pm";
  const certs = brandKit?.certifications ?? [];
  return (
    <div className="relative z-10 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Column 1: Contact Info */}
      <div className="space-y-3">
        <h4 className={colHeading}>Contact</h4>
        {brandKit?.logoUrl && (
          <Image src={brandKit.logoUrl} alt="Company logo" width={200} height={40} className="h-10 w-auto object-contain opacity-90" />
        )}
        {!!section.content.phone && <p className="text-sm opacity-80">{section.content.phone as string}</p>}
        {!!section.content.email && <p className="text-sm opacity-80">{section.content.email as string}</p>}
        {!!section.content.address && <p className="text-sm opacity-80">{section.content.address as string}</p>}
      </div>
      {/* Column 2: Business Hours */}
      <div className="space-y-3">
        <h4 className={colHeading}>Business Hours</h4>
        {hours.split("\n").map((line) => (
          <p key={line} className="text-sm opacity-80">{line}</p>
        ))}
      </div>
      {/* Column 3: Licenses & Insurance */}
      <div className="space-y-3">
        <h4 className={colHeading}>Licenses &amp; Insurance</h4>
        {certs.length > 0 && (
          <ul className="text-sm opacity-80 space-y-1">
            {certs.map((c) => <li key={c}>{c}</li>)}
          </ul>
        )}
        {brandKit?.insuranceInfo && <p className="text-sm opacity-80">{brandKit.insuranceInfo}</p>}
        {!!section.content.licenseNumber && (
          <p className="text-sm opacity-80">License #{section.content.licenseNumber as string}</p>
        )}
      </div>
    </div>
  );
}

function MinimalFooter({ section }: SectionProps) {
  return (
    <div className="relative z-10 max-w-3xl mx-auto">
      <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-sm opacity-80">
        {!!section.content.phone && <span>{section.content.phone as string}</span>}
        {!!section.content.phone && !!section.content.email && <span className="opacity-40">|</span>}
        {!!section.content.email && <span>{section.content.email as string}</span>}
        {!!section.content.address && <><span className="opacity-40">|</span><span>{section.content.address as string}</span></>}
      </div>
      {!!section.content.hours && (
        <p className="text-xs opacity-50 mt-2 text-center">{section.content.hours as string}</p>
      )}
      <p className="text-xs opacity-25 mt-4 text-center tracking-wide">Powered by Pulsebook</p>
    </div>
  );
}

export function ContactSection({ section, brandKit }: SectionProps) {
  const baseColor = brandKit?.secondaryColor || "#1f2937";
  const darkColor = darkenColor(baseColor, 30);
  const variant = (section.settings.variant as string) || "standard";

  if (variant === "minimal") {
    return (
      <div className="relative px-4 py-6 text-white overflow-hidden" style={{ background: `linear-gradient(135deg, ${baseColor}, ${darkColor})` }}>
        <MinimalFooter section={section} brandKit={brandKit} />
      </div>
    );
  }

  return (
    <div
      className="relative px-4 py-12 sm:py-16 text-white overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${baseColor}, ${darkColor})`,
      }}
    >
      <div className="ep-hero-pattern" />

      {variant === "detailed" ? (
        <DetailedFooter section={section} brandKit={brandKit} />
      ) : (
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <div className="flex flex-wrap justify-center gap-8 mb-6">
            {!!section.content.phone && (
              <div className="flex flex-col items-center gap-1">
                <span className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-1">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
                </span>
                <span className="text-[0.7rem] uppercase tracking-widest opacity-50">Phone</span>
                <span className="text-sm font-medium">{section.content.phone as string}</span>
              </div>
            )}
            {!!section.content.email && (
              <div className="flex flex-col items-center gap-1">
                <span className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-1">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                </span>
                <span className="text-[0.7rem] uppercase tracking-widest opacity-50">Email</span>
                <span className="text-sm font-medium">{section.content.email as string}</span>
              </div>
            )}
            {!!section.content.address && (
              <div className="flex flex-col items-center gap-1">
                <span className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-1">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                </span>
                <span className="text-[0.7rem] uppercase tracking-widest opacity-50">Address</span>
                <span className="text-sm font-medium">{section.content.address as string}</span>
              </div>
            )}
          </div>
          {!!section.content.hours && (
            <p className="text-sm opacity-60 whitespace-pre-line">{section.content.hours as string}</p>
          )}
          <p className="text-xs opacity-20 mt-6 tracking-wide">Powered by Pulsebook</p>
        </div>
      )}
    </div>
  );
}
