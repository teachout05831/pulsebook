import type { HtmlBlock } from "./types";

export const CLEANING_BLOCKS_1: HtmlBlock[] = [
  // ─── Personal Greeting ────────────────────────────────────────
  {
    id: "cleaning-greeting",
    name: "Personal Greeting",
    category: "cleaning",
    description: "Personalized greeting with customer name, address badge, and intro paragraph",
    variables: ["customerName", "introLine", "address", "bodyText"],
    html: `<div class="cl-c">
  <div class="cl-greeting">
    <h1 class="cl-greeting-title">Hi {{customerName}}! 👋</h1>
    <div class="cl-greeting-card">
      <p>{{introLine}} <span class="cl-address-badge">📍 {{address}}</span> {{bodyText}}</p>
    </div>
  </div>
</div>`,
    css: `:scope .cl-c {
  max-width: 680px;
  margin: 0 auto;
  padding: 0 20px;
}
:scope .cl-greeting {
  padding: 20px 0 16px;
}
:scope .cl-greeting-title {
  font-family: 'Poppins', var(--heading-font, sans-serif);
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 16px;
  color: #1c1917;
  line-height: 1.3;
}
:scope .cl-greeting-card {
  font-size: 1.05rem;
  color: #57534e;
  line-height: 1.75;
  background: #ffffff;
  padding: 24px 28px;
  border-radius: 24px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
  border: 1px solid color-mix(in srgb, var(--primary-color, #10b981) 12%, white);
}
:scope .cl-greeting-card strong {
  color: #292524;
}
:scope .cl-address-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: color-mix(in srgb, var(--primary-color, #10b981) 10%, white);
  padding: 2px 10px;
  border-radius: 20px;
  font-weight: 600;
  color: color-mix(in srgb, var(--primary-color, #10b981), black 10%);
  white-space: nowrap;
}
@media (min-width: 640px) {
  :scope .cl-greeting-title {
    font-size: 2.6rem;
  }
}`,
  },

  // ─── Section Heading ──────────────────────────────────────────
  {
    id: "cleaning-scope-heading",
    name: "Section Heading with Icon",
    category: "cleaning",
    description: "Styled section heading with colored icon circle and subtitle",
    variables: ["headingIcon", "heading", "subtitle"],
    html: `<div class="cl-c">
  <div class="cl-section-heading">
    <div class="cl-icon-circle">{{headingIcon}}</div>
    <h2>{{heading}}</h2>
  </div>
  <p class="cl-section-subtitle">{{subtitle}}</p>
</div>`,
    css: `:scope .cl-c {
  max-width: 680px;
  margin: 0 auto;
  padding: 0 20px;
}
:scope .cl-section-heading {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding-top: 40px;
}
:scope .cl-icon-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: color-mix(in srgb, var(--primary-color, #10b981) 20%, white);
  color: color-mix(in srgb, var(--primary-color, #10b981), black 10%);
  font-size: 1.1rem;
}
:scope .cl-section-heading h2 {
  font-family: 'Poppins', var(--heading-font, sans-serif);
  font-size: 1.35rem;
  font-weight: 700;
  color: #292524;
  margin: 0;
  line-height: 1.3;
}
:scope .cl-section-subtitle {
  color: #78716c;
  font-size: 0.95rem;
  margin-top: -12px;
  margin-bottom: 20px;
  padding-left: 52px;
}`,
  },
];
