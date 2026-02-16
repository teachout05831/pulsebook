/**
 * Full Landing Page Template — based on the 06-full-landing-page-experience.html mockup.
 * A comprehensive estimate page with every section type, designed for
 * high-ticket home service estimates (renovations, remodels, etc.).
 *
 * Uses standard React sections for interactive features and custom_html
 * for visually unique layouts (about stats, scope phase cards).
 *
 * Split into sub-files for maintainability:
 *  - fullLandingPageTemplate-1: Image helpers + About section
 *  - fullLandingPageTemplate-2: Scope of Work section
 *  - fullLandingPageTemplate-3: Hero section
 *  - fullLandingPageTemplate-4: Video CTA + Footer sections
 *  - fullLandingPageTemplate-5: Sections 1-7
 *  - fullLandingPageTemplate-6: Sections 8-9
 *  - fullLandingPageTemplate-7: Sections 10-12
 *  - fullLandingPageTemplate-8: Sections 13-15 + theme + incentives
 */

import { SECTIONS_PART_1 } from "./fullLandingPageTemplate-5";
import { SECTIONS_PART_2A } from "./fullLandingPageTemplate-6";
import { SECTIONS_PART_2B } from "./fullLandingPageTemplate-7";
import { SECTIONS_PART_3, FLP_DESIGN_THEME, FLP_INCENTIVE_CONFIG } from "./fullLandingPageTemplate-8";

export const FULL_LANDING_PAGE_TEMPLATE = {
  name: "Full Landing Page",
  description:
    "Comprehensive full-page estimate experience with hero, trust badges, video message, about stats, 5-phase scope cards, gallery, before/after, pricing tiers, testimonials, video call CTA, calendar, FAQ, approval, timeline, and contact footer. Ideal for high-ticket renovation and remodel estimates.",
  category: "General",
  sections: [
    ...SECTIONS_PART_1,
    ...SECTIONS_PART_2A,
    ...SECTIONS_PART_2B,
    ...SECTIONS_PART_3,
  ],
  design_theme: FLP_DESIGN_THEME,
  incentive_config: FLP_INCENTIVE_CONFIG,
};
