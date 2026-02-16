/**
 * Full Landing Page Template — Part 5: Sections 1-7 (hero through before/after).
 */

import { aboutHtml, aboutCss, IMG } from "./fullLandingPageTemplate-1";
import { scopeHtml, scopeCss } from "./fullLandingPageTemplate-2";
import { heroHtml, heroCss } from "./fullLandingPageTemplate-3";

// Sections 1-7: Hero, Trust Badges, Video, About, Scope, Gallery, Before/After
export const SECTIONS_PART_1 = [
  // 1. Hero — custom HTML (rich gradient with logo, badge, accent title)
  {
    id: "flp1",
    type: "custom_html",
    order: 0,
    visible: true,
    settings: {},
    content: { html: heroHtml, css: heroCss },
  },
  // 2. Trust Badges
  {
    id: "flp2",
    type: "trust_badges",
    order: 1,
    visible: true,
    settings: { variant: "horizontal" },
    content: {
      showGoogleRating: true,
      showCertifications: true,
      showInsurance: true,
      badges: [
        { id: "b1", label: "Google Guaranteed" },
        { id: "b2", label: "BBB A+ Rated" },
        { id: "b3", label: "Licensed & Insured" },
        { id: "b4", label: "15 Years in Business" },
        { id: "b5", label: "HomeAdvisor Top Rated" },
      ],
    },
  },
  // 3. Personal Video Message
  {
    id: "flp3",
    type: "video",
    order: 2,
    visible: true,
    settings: { variant: "standard" },
    content: {
      title: "A Message From Our Team",
      description:
        "Watch a quick personal overview of your project plan, materials, and timeline from your dedicated project manager.",
    },
  },
  // 4. About Us — custom HTML (stats grid + certs)
  {
    id: "flp4",
    type: "custom_html",
    order: 3,
    visible: true,
    settings: {},
    content: { html: aboutHtml, css: aboutCss },
  },
  // 5. Scope of Work — custom HTML (5 phase cards)
  {
    id: "flp5",
    type: "custom_html",
    order: 4,
    visible: true,
    settings: {},
    content: { html: scopeHtml, css: scopeCss },
  },
  // 6. Photo Gallery
  {
    id: "flp6",
    type: "gallery",
    order: 5,
    visible: true,
    settings: { variant: "grid" },
    content: {
      title: "Projects We've Completed",
      photos: [
        { url: IMG.kitchen1, caption: "Modern Farmhouse Kitchen" },
        { url: IMG.kitchen2, caption: "Contemporary White Kitchen" },
        { url: IMG.kitchen3, caption: "Warm Industrial Kitchen" },
        { url: IMG.kitchen4, caption: "Transitional Chef's Kitchen" },
        { url: IMG.kitchen5, caption: "Coastal Open Kitchen" },
        { url: IMG.kitchen6, caption: "Luxury European Kitchen" },
      ],
    },
  },
  // 7. Before & After
  {
    id: "flp7",
    type: "before_after",
    order: 6,
    visible: true,
    settings: { variant: "slider" },
    content: {
      title: "See The Transformation",
      beforeLabel: "Before",
      afterLabel: "After",
      beforeImage: IMG.before,
      afterImage: IMG.after,
    },
  },
];
