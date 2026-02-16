/**
 * Design Presets — Part 2: Last 4 presets (tech-forward, clean-corporate,
 * dark-dramatic, vibrant-creative).
 */

import type { DesignTheme, SectionType } from "../types";

interface DesignPresetShape {
  id: string;
  name: string;
  description: string;
  theme: DesignTheme;
  sectionDefaults: Partial<Record<SectionType, { variant: string }>>;
}

export const PRESETS_PART_2: DesignPresetShape[] = [
  {
    id: "tech-forward",
    name: "Tech Forward",
    description: "Sharp edges, glassmorphism, modern density",
    theme: {
      activePresetId: "tech-forward",
      headingFont: "Poppins", bodyFont: "Inter", headingWeight: "700", headingCase: "uppercase",
      borderRadius: "none", cardStyle: "glass", buttonStyle: "gradient",
      sectionSpacing: "tight", contentWidth: "wide", headerStyle: "gradient",
      backgroundPattern: "gradient-fade", accentPlacement: "highlight", dividerStyle: "none",
      animations: "expressive", hoverEffects: "glow",
    },
    sectionDefaults: {
      hero: { variant: "gradient" }, pricing: { variant: "packages" }, scope: { variant: "detailed" },
      gallery: { variant: "grid" }, testimonials: { variant: "cards" },
      faq: { variant: "two-column" }, contact: { variant: "minimal" },
      about: { variant: "split" }, video: { variant: "side-by-side" },
    },
  },
  {
    id: "clean-corporate",
    name: "Clean Corporate",
    description: "No-nonsense, balanced, professional",
    theme: {
      activePresetId: "clean-corporate",
      headingFont: "Roboto", bodyFont: "Open Sans", headingWeight: "600", headingCase: "normal",
      borderRadius: "small", cardStyle: "flat", buttonStyle: "rounded",
      sectionSpacing: "normal", contentWidth: "normal", headerStyle: "dark-filled",
      backgroundPattern: "alternating", accentPlacement: "left-border", dividerStyle: "line",
      animations: "subtle-fade", hoverEffects: "lift",
    },
    sectionDefaults: {
      hero: { variant: "split" }, pricing: { variant: "detailed" }, scope: { variant: "checklist" },
      gallery: { variant: "grid" }, testimonials: { variant: "cards" },
      faq: { variant: "accordion" }, contact: { variant: "standard" },
      about: { variant: "standard" }, video: { variant: "standard" },
    },
  },
  {
    id: "dark-dramatic",
    name: "Dark & Dramatic",
    description: "High contrast, bold, strong presence",
    theme: {
      activePresetId: "dark-dramatic",
      headingFont: "Montserrat", bodyFont: "Inter", headingWeight: "800", headingCase: "uppercase",
      borderRadius: "medium", cardStyle: "glass", buttonStyle: "square-solid",
      sectionSpacing: "normal", contentWidth: "wide", headerStyle: "dark-filled",
      backgroundPattern: "solid", accentPlacement: "highlight", dividerStyle: "none",
      animations: "slide-up", hoverEffects: "glow",
    },
    sectionDefaults: {
      hero: { variant: "photo" }, pricing: { variant: "detailed" }, scope: { variant: "detailed" },
      gallery: { variant: "masonry" }, testimonials: { variant: "cards" },
      faq: { variant: "two-column" }, contact: { variant: "detailed" },
      about: { variant: "split" }, video: { variant: "side-by-side" },
    },
  },
  {
    id: "vibrant-creative",
    name: "Vibrant Creative",
    description: "Energetic, rounded, expressive style",
    theme: {
      activePresetId: "vibrant-creative",
      headingFont: "Poppins", bodyFont: "Raleway", headingWeight: "800", headingCase: "normal",
      borderRadius: "large", cardStyle: "soft-shadow", buttonStyle: "pill",
      sectionSpacing: "generous", contentWidth: "wide", headerStyle: "gradient",
      backgroundPattern: "gradient-fade", accentPlacement: "highlight", dividerStyle: "wave",
      animations: "expressive", hoverEffects: "scale",
    },
    sectionDefaults: {
      hero: { variant: "gradient" }, pricing: { variant: "packages" }, scope: { variant: "checklist" },
      gallery: { variant: "carousel" }, testimonials: { variant: "cards" },
      faq: { variant: "accordion" }, contact: { variant: "standard" },
      about: { variant: "centered" }, video: { variant: "standard" },
    },
  },
];
