"use client";

import { useMemo } from "react";
import { Check } from "lucide-react";
import type { DesignPreset } from "../../constants";

interface PresetMiniPreviewProps {
  preset: DesignPreset;
  primaryColor: string;
  secondaryColor: string;
  isActive: boolean;
  onClick: () => void;
}

const RADIUS_MAP: Record<string, string> = { none: "0", small: "2px", medium: "4px", large: "8px" };

const CARD_STYLES: Record<string, React.CSSProperties> = {
  flat: { background: "#fff" },
  bordered: { background: "#fff", border: "1px solid #e5e7eb" },
  "soft-shadow": { background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.12)" },
  glass: { background: "rgba(255,255,255,0.6)", backdropFilter: "blur(6px)", border: "1px solid rgba(255,255,255,0.3)" },
};

export function PresetMiniPreview({ preset, primaryColor, secondaryColor, isActive, onClick }: PresetMiniPreviewProps) {
  const { theme } = preset;
  const radius = RADIUS_MAP[theme.borderRadius || "medium"] || "4px";
  const cardStyle = CARD_STYLES[theme.cardStyle || "soft-shadow"] || CARD_STYLES["soft-shadow"];

  const headingStyle = useMemo<React.CSSProperties>(() => ({
    fontFamily: `'${theme.headingFont || "Inter"}', sans-serif`,
    fontWeight: Number(theme.headingWeight || "700"),
    textTransform: theme.headingCase === "uppercase" ? "uppercase" : "none",
    fontSize: "7px",
    lineHeight: 1.2,
    color: "#1f2937",
  }), [theme.headingFont, theme.headingWeight, theme.headingCase]);

  const bodyStyle = useMemo<React.CSSProperties>(() => ({
    fontFamily: `'${theme.bodyFont || "Inter"}', sans-serif`,
    fontSize: "5px",
    color: "#6b7280",
    lineHeight: 1.3,
  }), [theme.bodyFont]);

  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative w-full text-left rounded-lg border-2 transition-all overflow-hidden ${
        isActive ? "border-blue-500 ring-2 ring-blue-200" : "border-gray-200 hover:border-gray-300"
      }`}
    >
      {isActive && (
        <div className="absolute top-1 right-1 z-10 h-4 w-4 rounded-full bg-blue-500 flex items-center justify-center">
          <Check className="h-2.5 w-2.5 text-white" />
        </div>
      )}

      {/* Miniature page mockup */}
      <div className="h-[88px] p-2 bg-gray-50 overflow-hidden">
        {/* Hero bar */}
        <div
          className="w-full h-5 mb-1.5"
          style={{
            background: theme.headerStyle === "gradient"
              ? `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`
              : primaryColor,
            borderRadius: `${radius} ${radius} 0 0`,
          }}
        />

        {/* Heading + body text */}
        <div className="px-1 mb-1.5">
          <div style={headingStyle}>Sample Heading</div>
          <div style={bodyStyle}>Body text preview here</div>
        </div>

        {/* Mock card */}
        <div className="px-1">
          <div
            className="p-1"
            style={{ ...cardStyle, borderRadius: radius }}
          >
            <div style={{ ...bodyStyle, fontSize: "4.5px" }}>Card content</div>
          </div>
        </div>
      </div>

      {/* Label */}
      <div className="px-2 py-1.5 border-t bg-white">
        <div className="text-[11px] font-medium text-gray-900 leading-tight">{preset.name}</div>
        <div className="text-[9px] text-gray-500 leading-tight truncate">{preset.description}</div>
      </div>
    </button>
  );
}
