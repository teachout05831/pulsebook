"use client";
import { useState } from "react";
import Image from "next/image";
import { Play, Star } from "lucide-react";
import type { SectionProps } from "./sectionProps";

interface Testimonial { name: string; text: string; rating: number; photo?: string; company?: string; videoUrl?: string }

function toEmbedUrl(url: string): string {
  try {
    const u = new URL(url);
    if (u.hostname.match(/youtube\.com|youtu\.be/)) {
      const id = u.hostname === "youtu.be" ? u.pathname.slice(1) : u.searchParams.get("v");
      if (id) return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1`;
    }
    if (u.hostname.includes("vimeo.com")) {
      const vid = u.pathname.split("/").filter(Boolean).pop();
      if (vid) return `https://player.vimeo.com/video/${vid}?autoplay=1`;
    }
  } catch { /* fall through */ }
  return url;
}

const PLACEHOLDERS: Testimonial[] = [
  { name: "Sarah M.", text: "Excellent work! The team was professional, on time, and the results exceeded our expectations.", rating: 5 },
  { name: "James R.", text: "Great communication throughout the project. Would highly recommend to anyone.", rating: 5, company: "JR Properties", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
  { name: "Linda K.", text: "Fair pricing and outstanding quality. They went above and beyond on every detail.", rating: 4 },
];

function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} size={14} fill={i < rating ? "var(--accent-color)" : "none"} stroke={i < rating ? "var(--accent-color)" : "#d1d5db"} strokeWidth={1.5} />
      ))}
    </span>
  );
}

function Avatar({ name, photo }: { name: string; photo?: string }) {
  const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  if (photo) return <Image src={photo} alt={name} width={40} height={40} className="w-10 h-10 rounded-full object-cover" />;
  return (<div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm" style={{ background: "linear-gradient(135deg, var(--primary-color), var(--secondary-color))" }}>{initials}</div>);
}

function VideoTestimonialCard({ t }: { t: Testimonial }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const embedSrc = t.videoUrl ? toEmbedUrl(t.videoUrl) : "";
  const bgStyle = t.photo
    ? { backgroundImage: `url(${t.photo})`, backgroundSize: "cover" as const, backgroundPosition: "center" as const }
    : { background: "linear-gradient(135deg, var(--primary-color), var(--secondary-color))" };
  return (
    <div className="ep-card-elevated overflow-hidden flex flex-col">
      <div className="relative aspect-video w-full" style={isPlaying ? undefined : bgStyle}>
        {isPlaying ? (
          <iframe src={embedSrc} className="absolute inset-0 w-full h-full" allow="autoplay; encrypted-media" allowFullScreen title={`${t.name} video testimonial`} />
        ) : (
          <button onClick={() => setIsPlaying(true)} className="absolute inset-0 w-full h-full flex items-center justify-center group cursor-pointer" style={{ background: "linear-gradient(to top, rgba(0,0,0,.55), rgba(0,0,0,.15))" }}>
            <span className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Play size={24} fill="var(--primary-color)" stroke="var(--primary-color)" className="ml-0.5" />
            </span>
          </button>
        )}
      </div>
      <div className="p-4 flex flex-col gap-2">
        <div className="flex items-center gap-2.5">
          <Avatar name={t.name} photo={t.photo} />
          <div>
            <p className="text-sm font-semibold text-gray-900">{t.name}</p>
            {t.company && <p className="text-xs text-gray-500">{t.company}</p>}
          </div>
          <span className="ml-auto"><Stars rating={t.rating} /></span>
        </div>
        {t.text && <p className="text-sm text-gray-700 leading-relaxed">&ldquo;{t.text}&rdquo;</p>}
      </div>
    </div>
  );
}

function TestimonialCard({ t }: { t: Testimonial }) {
  if (t.videoUrl) return <VideoTestimonialCard t={t} />;
  return (
    <div className="ep-card-elevated p-6 flex flex-col gap-3 relative overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
      <span className="absolute top-2 left-3 text-4xl leading-none font-serif opacity-[0.06] pointer-events-none select-none" style={{ color: "var(--primary-color)" }}>&ldquo;</span>
      <Stars rating={t.rating} />
      <p className="text-sm text-gray-700 leading-relaxed relative z-[1]">&ldquo;{t.text}&rdquo;</p>
      <div className="flex items-center gap-2.5 mt-auto pt-1">
        <Avatar name={t.name} photo={t.photo} />
        <div>
          <p className="text-sm font-semibold text-gray-900">{t.name}</p>
          {t.company && <p className="text-xs text-gray-500">{t.company}</p>}
        </div>
      </div>
    </div>
  );
}

function GoogleRatingBadge({ rating, count }: { rating: number; count: number | null }) {
  return (
    <div className="flex items-center justify-center mb-6">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium text-white shadow-sm" style={{ background: "linear-gradient(135deg, var(--primary-color), var(--secondary-color))" }}>
        <Star size={14} fill="white" stroke="white" /><span>{rating.toFixed(1)}</span>
        {count !== null && <span className="opacity-80 text-xs">({count} Google reviews)</span>}</div></div>);
}

export function TestimonialsSection({ section, brandKit }: SectionProps) {
  const title = (section.content.title as string) || "What Our Customers Say";
  const raw = section.content.testimonials as Testimonial[] | undefined;
  const testimonials = raw && raw.length > 0 ? raw : PLACEHOLDERS;
  const showGoogle = section.content.showGoogleRating as boolean | undefined;
  const variant = (section.settings.variant as string) || "cards";
  const pc = brandKit?.primaryColor || "#2563eb";
  return (
    <div className="w-full px-4 ep-animate" style={{ background: `${pc}06`, paddingTop: "var(--section-spacing)", paddingBottom: "var(--section-spacing)" }}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <span className="ep-section-label" style={{ color: "var(--primary-color)" }}>Testimonials</span>
          <h2 className="text-xl sm:text-2xl" style={{ color: "var(--primary-color)" }}>{title}</h2>
        </div>
        {showGoogle && brandKit?.googleRating && <GoogleRatingBadge rating={brandKit.googleRating} count={brandKit.googleReviewCount} />}
        {variant === "carousel" ? (
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
            {testimonials.map((t) => (
              <div key={t.name} className="min-w-[280px] max-w-[320px] flex-shrink-0 snap-start"><TestimonialCard t={t} /></div>
            ))}
          </div>
        ) : variant === "minimal" ? (
          <div className="flex flex-col gap-5">
            {testimonials.map((t) => (
              <div key={t.name} className="pl-4 py-3" style={{ borderLeft: "3px solid var(--accent-color)" }}>
                <Stars rating={t.rating} />
                <p className="text-sm text-gray-700 mt-1.5 leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                <p className="text-sm font-semibold text-gray-900 mt-2">
                  {t.name}{t.company && <span className="font-normal text-gray-500"> &mdash; {t.company}</span>}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {testimonials.map((t, i) => (
              <div key={t.name} className={i === testimonials.length - 1 && testimonials.length % 2 === 1 ? "md:col-span-2" : ""}>
                <TestimonialCard t={t} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
