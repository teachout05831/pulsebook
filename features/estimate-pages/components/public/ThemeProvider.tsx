"use client";

import { useEffect, useMemo } from "react";
import type { DesignTheme } from "../../types";

interface ThemeProviderProps {
  theme: DesignTheme;
  brandKit: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    fontFamily: string;
    headingFont: string | null;
  } | null;
  children: React.ReactNode;
}

const BORDER_RADIUS_MAP: Record<string, string> = {
  none: "0",
  small: "0.25rem",
  medium: "0.5rem",
  large: "1rem",
};

const SECTION_SPACING_MAP: Record<string, string> = {
  tight: "2rem",
  normal: "3rem",
  generous: "5rem",
};

const CONTENT_WIDTH_MAP: Record<string, string> = {
  narrow: "640px",
  normal: "768px",
  wide: "1024px",
  full: "100%",
};

function getCardStyles(cardStyle?: string) {
  switch (cardStyle) {
    case "flat":
      return { shadow: "none", border: "none", bg: "white", backdrop: "none" };
    case "bordered":
      return { shadow: "none", border: "1px solid #e5e7eb", bg: "white", backdrop: "none" };
    case "glass":
      return {
        shadow: "0 4px 30px rgba(0,0,0,0.1)",
        border: "none",
        bg: "rgba(255,255,255,0.7)",
        backdrop: "blur(10px)",
      };
    case "soft-shadow":
    default:
      return { shadow: "0 1px 3px rgba(0,0,0,0.1)", border: "none", bg: "white", backdrop: "none" };
  }
}

function getButtonRadius(buttonStyle?: string): string {
  switch (buttonStyle) {
    case "square-solid": return "0.25rem";
    case "pill": return "9999px";
    case "outline":
    case "gradient":
    case "rounded":
    default: return "0.5rem";
  }
}

function buildGoogleFontsUrl(fonts: string[], weight?: string): string | null {
  const unique = fonts.filter((f) => f && f !== "Inter");
  if (unique.length === 0) return null;
  const weights = ["400", "600", "700"];
  if (weight && !weights.includes(weight)) weights.push(weight);
  const wghtAxis = `wght@${weights.sort().join(";")}`;
  const families = unique.map((f) => `family=${f.replace(/\s+/g, "+")}:${wghtAxis}`).join("&");
  return `https://fonts.googleapis.com/css2?${families}&display=swap`;
}

export function ThemeProvider({ theme, brandKit, children }: ThemeProviderProps) {
  const headingFont = theme.headingFont || brandKit?.headingFont || "Inter";
  const bodyFont = theme.bodyFont || brandKit?.fontFamily || "Inter";

  const cssVars = useMemo(() => {
    const card = getCardStyles(theme.cardStyle);
    return {
      "--heading-font": `'${headingFont}', sans-serif`,
      "--body-font": `'${bodyFont}', sans-serif`,
      "--heading-weight": theme.headingWeight || "700",
      "--heading-case": theme.headingCase || "normal",
      "--primary-color": brandKit?.primaryColor || "#2563eb",
      "--secondary-color": brandKit?.secondaryColor || "#1e40af",
      "--accent-color": brandKit?.accentColor || "#f59e0b",
      "--border-radius": BORDER_RADIUS_MAP[theme.borderRadius || "medium"] || "0.5rem",
      "--section-spacing": SECTION_SPACING_MAP[theme.sectionSpacing || "normal"] || "3rem",
      "--content-width": CONTENT_WIDTH_MAP[theme.contentWidth || "normal"] || "768px",
      "--card-shadow": card.shadow,
      "--card-border": card.border,
      "--card-bg": card.bg,
      "--card-backdrop": card.backdrop,
      "--button-radius": getButtonRadius(theme.buttonStyle),
    } as React.CSSProperties;
  }, [theme, brandKit, headingFont, bodyFont]);

  // Load Google Fonts dynamically
  useEffect(() => {
    const fontsUrl = buildGoogleFontsUrl([headingFont, bodyFont], theme.headingWeight);
    if (!fontsUrl) return;

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = fontsUrl;
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, [headingFont, bodyFont, theme.headingWeight]);

  return (
    <div style={cssVars} className="theme-provider">
      {children}
    </div>
  );
}
