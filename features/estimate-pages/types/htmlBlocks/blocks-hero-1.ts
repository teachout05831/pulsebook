import type { HtmlBlock } from "./types";
import { HERO_LANDING_CSS } from "./blocks-hero-css";

export const HERO_BLOCKS_1: HtmlBlock[] = [
  {
    id: "landing-page-hero",
    name: "Landing Page Hero",
    category: "hero",
    description:
      "Full-screen gradient hero with company logo, status badge, accent title, customer name, address, estimate number, and scroll indicator",
    variables: [
      "companyInitial",
      "companyName",
      "badgeText",
      "titleLine1",
      "titleAccent",
      "titleLine2",
      "subtitle",
      "addressLine",
      "metaLeft",
      "metaRight",
    ],
    html: `<div class="lph-hero">
  <div class="lph-hero-content">
    <div class="lph-logo">
      <div class="lph-logo-icon">{{companyInitial}}</div>
      <span class="lph-logo-text">{{companyName}}</span>
    </div>
    <div class="lph-badge">
      <span class="lph-badge-dot"></span>
      {{badgeText}}
    </div>
    <h1 class="lph-title">{{titleLine1}} <span class="lph-accent">{{titleAccent}}</span> {{titleLine2}}</h1>
    <p class="lph-subtitle">{{subtitle}}</p>
    <p class="lph-address">{{addressLine}}</p>
    <div class="lph-meta">
      <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>{{metaLeft}}</span>
      <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>{{metaRight}}</span>
    </div>
  </div>
  <div class="lph-scroll">
    Scroll to explore
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 13l5 5 5-5M7 6l5 5 5-5"/></svg>
  </div>
</div>`,
    css: HERO_LANDING_CSS,
  },
];
