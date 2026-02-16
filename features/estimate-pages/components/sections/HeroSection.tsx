"use client";

import Image from "next/image";
import type { SectionProps } from "./sectionProps";

const headingStyle: React.CSSProperties = {
  fontSize: "clamp(2.25rem, 5vw, 3.75rem)",
  letterSpacing: "-0.03em",
  lineHeight: 1.08,
  fontFamily: "var(--heading-font, inherit)",
  fontWeight: "var(--heading-weight, 700)" as string,
  textTransform: "var(--heading-case, none)" as React.CSSProperties["textTransform"],
};

function formatDate(): string {
  return new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function Badge({ customer, estimate }: Pick<SectionProps, "customer" | "estimate">) {
  if (!customer?.name) return null;
  return (
    <div
      className="ep-animate inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm text-white/90 mb-6 border border-white/15"
      style={{ backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", background: "rgba(255,255,255,0.1)" }}
    >
      {estimate && <span className="text-white/60">#{estimate.estimateNumber}</span>}
      {estimate && <span className="text-white/30">|</span>}
      <span>Prepared for <strong className="text-white font-semibold">{customer.name}</strong></span>
    </div>
  );
}

function TextContent({ brandKit, estimate, customer, light }: SectionProps & { light: boolean }) {
  const logoUrl = brandKit?.logoUrl;
  const tagline = brandKit?.tagline;
  const title = estimate ? `Estimate ${estimate.estimateNumber}` : "Your Estimate";
  return (
    <div className={`max-w-2xl mx-auto ${light ? "text-white" : ""}`}>
      {logoUrl && <Image src={logoUrl} alt="Company logo" width={240} height={64} className="ep-animate h-12 sm:h-16 w-auto mx-auto mb-8 object-contain drop-shadow-sm" priority />}
      {light && <Badge customer={customer} estimate={estimate} />}
      {tagline && <p className={`ep-animate ep-animate-delay-1 text-sm sm:text-base mb-4 tracking-wide ${light ? "text-white/70" : "opacity-60"}`}>{tagline}</p>}
      <h1 className="ep-animate ep-animate-delay-1" style={headingStyle}>{title}</h1>
      {!light && customer?.name && <p className="ep-animate ep-animate-delay-2 mt-4 text-lg sm:text-xl opacity-80">Prepared for {customer.name}</p>}
      <p className={`ep-animate ep-animate-delay-3 mt-4 text-sm ${light ? "text-white/50" : "opacity-50"}`}>{formatDate()}</p>
    </div>
  );
}

function HeroImage({ src }: { src: string | undefined }) {
  if (src) return <Image src={src} alt="Hero" fill className="object-cover" />;
  return <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-sm">Upload a hero image</div>;
}

export function HeroSection(props: SectionProps) {
  const { section, brandKit } = props;
  const variant = (section.settings.variant as string) || "clean";
  const primaryColor = brandKit?.primaryColor || "#2563eb";
  const secondaryColor = brandKit?.secondaryColor || "#1e40af";
  const heroImage = (section.content.heroImageUrl as string) || brandKit?.heroImageUrl || undefined;

  if (variant === "photo") {
    return (
      <div className="relative w-full min-h-[55vh] flex items-center justify-center overflow-hidden">
        {heroImage && <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${heroImage})` }} />}
        <div className="absolute inset-0" style={{ background: heroImage ? "linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.65) 100%)" : primaryColor }} />
        <div className="ep-hero-overlay" />
        <div className="relative z-10 text-center px-6 py-20 sm:py-28"><TextContent {...props} light /></div>
      </div>
    );
  }

  if (variant === "gradient") {
    return (
      <div className="relative w-full min-h-[60vh] flex items-center justify-center overflow-hidden" style={{ background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)` }}>
        {heroImage && <div className="absolute inset-0 bg-cover bg-center opacity-15" style={{ backgroundImage: `url(${heroImage})` }} />}
        <div className="ep-hero-overlay" />
        <div className="ep-hero-pattern" />
        <div className="relative z-10 text-center px-6 py-20 sm:py-28"><TextContent {...props} light /></div>
      </div>
    );
  }

  if (variant === "split") {
    return (
      <div className="w-full flex flex-col md:flex-row min-h-[380px]">
        <div className="relative flex-1 flex flex-col items-center justify-center px-8 sm:px-14 py-20 sm:py-28 text-white overflow-hidden" style={{ backgroundColor: primaryColor }}>
          <div className="ep-hero-overlay" />
          <div className="ep-hero-pattern" />
          <div className="relative z-10 max-w-md text-center md:text-left"><TextContent {...props} light /></div>
        </div>
        <div className="flex-1 relative min-h-[240px] md:min-h-0 bg-gray-200"><HeroImage src={heroImage} /></div>
      </div>
    );
  }

  // Clean (default)
  return (
    <div className="relative w-full overflow-hidden" style={{ backgroundColor: primaryColor }}>
      {heroImage && <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: `url(${heroImage})` }} />}
      <div className="ep-hero-overlay" />
      <div className="ep-hero-pattern" />
      <div className="relative z-10 text-center px-6 py-20 sm:py-28"><TextContent {...props} light /></div>
    </div>
  );
}
