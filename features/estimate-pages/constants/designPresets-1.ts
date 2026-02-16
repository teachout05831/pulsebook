/**
 * Design Presets — Part 1: First 4 presets (modern-minimal, bold-professional,
 * warm-inviting, classic-elegant).
 */

import type { DesignTheme, SectionType } from "../types";

interface DesignPresetShape {
  id: string;
  name: string;
  description: string;
  theme: DesignTheme;
  sectionDefaults: Partial<Record<SectionType, { variant: string }>>;
}

export const PRESETS_PART_1: DesignPresetShape[] = [
  {
    id: "modern-minimal",
    name: "Modern Minimal",
    description: "Clean lines, generous whitespace, understated elegance",
    theme: {
      activePresetId: "modern-minimal",
      headingFont: "Inter", bodyFont: "Inter", headingWeight: "600", headingCase: "normal",
      borderRadius: "medium", cardStyle: "bordered", buttonStyle: "rounded",
      sectionSpacing: "generous", contentWidth: "narrow", headerStyle: "transparent",
      backgroundPattern: "solid", accentPlacement: "underline", dividerStyle: "line",
      animations: "subtle-fade", hoverEffects: "lift",
    },
    sectionDefaults: {
      hero: { variant: "clean" }, pricing: { variant: "simple" }, scope: { variant: "checklist" },
      gallery: { variant: "masonry" }, testimonials: { variant: "minimal" },
      faq: { variant: "accordion" }, contact: { variant: "minimal" },
      about: { variant: "centered" }, video: { variant: "standard" },
    },
  },
  {
    id: "bold-professional",
    name: "Bold Professional",
    description: "Strong typography, confident presentation",
    theme: {
      activePresetId: "bold-professional",
      headingFont: "Montserrat", bodyFont: "Open Sans", headingWeight: "800", headingCase: "uppercase",
      borderRadius: "small", cardStyle: "soft-shadow", buttonStyle: "square-solid",
      sectionSpacing: "normal", contentWidth: "wide", headerStyle: "gradient",
      backgroundPattern: "alternating", accentPlacement: "left-border", dividerStyle: "line",
      animations: "slide-up", hoverEffects: "scale",
    },
    sectionDefaults: {
      hero: { variant: "gradient" }, pricing: { variant: "detailed" }, scope: { variant: "detailed" },
      gallery: { variant: "grid" }, testimonials: { variant: "cards" },
      faq: { variant: "two-column" }, contact: { variant: "detailed" },
      about: { variant: "split" }, video: { variant: "side-by-side" },
    },
  },
  {
    id: "warm-inviting",
    name: "Warm & Inviting",
    description: "Friendly, approachable, rounded corners",
    theme: {
      activePresetId: "warm-inviting",
      headingFont: "Lora", bodyFont: "Source Sans Pro", headingWeight: "700", headingCase: "normal",
      borderRadius: "large", cardStyle: "soft-shadow", buttonStyle: "pill",
      sectionSpacing: "generous", contentWidth: "normal", headerStyle: "transparent",
      backgroundPattern: "solid", accentPlacement: "none", dividerStyle: "wave",
      animations: "subtle-fade", hoverEffects: "lift",
    },
    sectionDefaults: {
      hero: { variant: "photo" }, pricing: { variant: "simple" }, scope: { variant: "checklist" },
      gallery: { variant: "carousel" }, testimonials: { variant: "cards" },
      faq: { variant: "accordion" }, contact: { variant: "standard" },
      about: { variant: "standard" }, video: { variant: "standard" },
    },
  },
  {
    id: "classic-elegant",
    name: "Classic Elegant",
    description: "Refined serif fonts, traditional feel",
    theme: {
      activePresetId: "classic-elegant",
      headingFont: "Playfair Display", bodyFont: "Lora", headingWeight: "700", headingCase: "normal",
      borderRadius: "small", cardStyle: "bordered", buttonStyle: "outline",
      sectionSpacing: "normal", contentWidth: "narrow", headerStyle: "dark-filled",
      backgroundPattern: "solid", accentPlacement: "underline", dividerStyle: "line",
      animations: "subtle-fade", hoverEffects: "none",
    },
    sectionDefaults: {
      hero: { variant: "clean" }, pricing: { variant: "detailed" }, scope: { variant: "narrative" },
      gallery: { variant: "grid" }, testimonials: { variant: "minimal" },
      faq: { variant: "accordion" }, contact: { variant: "detailed" },
      about: { variant: "centered" }, video: { variant: "standard" },
    },
  },
];
