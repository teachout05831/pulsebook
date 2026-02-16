import type { HtmlBlock } from "./types";

export const CTA_BLOCKS_1: HtmlBlock[] = [
  {
    id: "cta-banner",
    name: "Call-to-Action Banner",
    category: "cta",
    description: "Eye-catching CTA with heading, subtext, and button",
    variables: ["ctaHeading", "ctaSubtext", "ctaButtonText"],
    html: `<div class="cta-banner">
  <div class="cta-content">
    <h2 class="cta-heading">{{ctaHeading}}</h2>
    <p class="cta-subtext">{{ctaSubtext}}</p>
  </div>
  <button class="cta-button">{{ctaButtonText}}</button>
</div>`,
    css: `:scope .cta-banner {
  background: linear-gradient(135deg, {{brand.primaryColor}} 0%, #1e3a8a 100%);
  color: white;
  padding: 3rem 2rem;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  margin: 3rem 0;
}
:scope .cta-content {
  flex: 1;
}
:scope .cta-heading {
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  color: white;
}
:scope .cta-subtext {
  font-size: 1.125rem;
  opacity: 0.9;
  line-height: 1.6;
}
:scope .cta-button {
  padding: 1rem 2.5rem;
  background: white;
  color: {{brand.primaryColor}};
  border: none;
  border-radius: 0.5rem;
  font-weight: 700;
  font-size: 1.125rem;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  white-space: nowrap;
}
:scope .cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}
@media (max-width: 768px) {
  :scope .cta-banner {
    flex-direction: column;
    text-align: center;
  }
  :scope .cta-heading {
    font-size: 1.5rem;
  }
  :scope .cta-button {
    width: 100%;
  }
}`,
  },
  {
    id: "guarantee-badge",
    name: "Guarantee Badge",
    category: "cta",
    description: "Trust badge with guarantee headline and description",
    variables: ["guaranteeHeadline", "guaranteeDescription"],
    html: `<div class="guarantee-badge">
  <div class="guarantee-icon">🛡️</div>
  <div class="guarantee-content">
    <h3 class="guarantee-headline">{{guaranteeHeadline}}</h3>
    <p class="guarantee-description">{{guaranteeDescription}}</p>
  </div>
</div>`,
    css: `:scope .guarantee-badge {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
  border: 2px solid #10b981;
  border-radius: 1rem;
}
:scope .guarantee-icon {
  font-size: 4rem;
  flex-shrink: 0;
}
:scope .guarantee-content {
  flex: 1;
}
:scope .guarantee-headline {
  font-size: 1.5rem;
  font-weight: 700;
  color: #065f46;
  margin-bottom: 0.5rem;
}
:scope .guarantee-description {
  color: #047857;
  line-height: 1.6;
}
@media (max-width: 640px) {
  :scope .guarantee-badge {
    flex-direction: column;
    text-align: center;
  }
}`,
  },
];
