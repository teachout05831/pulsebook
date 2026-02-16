"use client";

import Image from "next/image";
import { Star, Shield, Clock, Heart, Award, Zap, Users, CheckCircle } from "lucide-react";
import type { SectionProps } from "./sectionProps";
import type { ContentCell } from "../../types";

const GAP_MAP: Record<string, string> = { sm: "12px", md: "24px", lg: "40px" };
const SPACER_MAP: Record<string, string> = { sm: "24px", md: "48px", lg: "80px" };

const ICON_MAP: Record<string, React.ElementType> = {
  shield: Shield, star: Star, clock: Clock, heart: Heart,
  award: Award, zap: Zap, users: Users, "check-circle": CheckCircle,
};

function CellStars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} size={14} fill={i < rating ? "var(--accent-color)" : "none"} stroke={i < rating ? "var(--accent-color)" : "#d1d5db"} strokeWidth={1.5} />
      ))}
    </span>
  );
}

function CellRenderer({ cell }: { cell: ContentCell }) {
  const c = cell.content;

  switch (cell.type) {
    case "text":
      return <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{(c.text as string) || "Enter text..."}</p>;

    case "heading": {
      const level = (c.level as string) || "h3";
      const text = (c.text as string) || "Heading";
      const style = { fontFamily: "var(--heading-font)", fontWeight: "var(--heading-weight)" as string, color: "var(--primary-color)" };
      if (level === "h2") return <h2 className="text-xl sm:text-2xl font-bold" style={style}>{text}</h2>;
      if (level === "h4") return <h4 className="text-base font-semibold" style={style}>{text}</h4>;
      return <h3 className="text-lg font-bold" style={style}>{text}</h3>;
    }

    case "image": {
      const url = (c.url as string) || "";
      const alt = (c.alt as string) || "";
      const caption = (c.caption as string) || "";
      if (!url) return <div className="aspect-video rounded-lg bg-gray-100 flex items-center justify-center text-sm text-gray-400">No image</div>;
      return (
        <figure>
          <Image src={url} alt={alt} width={800} height={450} className="w-full rounded-lg object-cover" />
          {caption && <figcaption className="text-xs text-gray-500 mt-1.5 text-center">{caption}</figcaption>}
        </figure>
      );
    }

    case "testimonial":
      return (
        <div className="ep-card-elevated p-5 flex flex-col gap-3 relative overflow-hidden">
          <span className="absolute top-2 left-3 text-5xl leading-none font-serif opacity-[0.08] pointer-events-none select-none" style={{ color: "var(--primary-color)" }}>&ldquo;</span>
          <CellStars rating={(c.rating as number) || 5} />
          <p className="text-sm text-gray-700 leading-relaxed relative z-[1]">&ldquo;{(c.text as string) || "Great service!"}&rdquo;</p>
          <p className="text-sm font-semibold text-gray-900 mt-auto">{(c.name as string) || "Customer"}</p>
        </div>
      );

    case "bullet_list": {
      const items = (c.items as string[]) || ["Item 1"];
      return (
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
              <CheckCircle size={16} className="mt-0.5 flex-shrink-0" style={{ color: "var(--accent-color)" }} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    }

    case "icon_text": {
      const iconKey = (c.icon as string) || "shield";
      const Icon = ICON_MAP[iconKey] || Shield;
      return (
        <div className="flex flex-col items-center text-center gap-2 p-4">
          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "var(--primary-color)", color: "white" }}>
            <Icon size={22} />
          </div>
          <h4 className="text-sm font-bold text-gray-900">{(c.title as string) || "Feature"}</h4>
          <p className="text-xs text-gray-600 leading-relaxed">{(c.description as string) || ""}</p>
        </div>
      );
    }

    case "spacer":
      return <div style={{ height: SPACER_MAP[(c.height as string) || "md"] }} />;

    default:
      return null;
  }
}

export function ContentBlockSection({ section }: SectionProps) {
  const columns = (section.content.columns as number) || 2;
  const gap = GAP_MAP[(section.content.gap as string) || "md"];
  const cells = (section.content.cells as ContentCell[]) || [];

  return (
    <div className="w-full px-4 ep-animate" style={{ paddingTop: "var(--section-spacing)", paddingBottom: "var(--section-spacing)" }}>
      <div className="max-w-4xl mx-auto">
        <div
          className="content-block-grid"
          style={{ display: "grid", gridTemplateColumns: `repeat(${columns}, 1fr)`, gap }}
        >
          {cells.map((cell) => (
            <div key={cell.id} className="min-w-0">
              <CellRenderer cell={cell} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
