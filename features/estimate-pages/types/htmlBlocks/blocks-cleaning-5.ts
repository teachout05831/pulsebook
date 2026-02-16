import type { HtmlBlock } from "./types";

export const CLEANING_BLOCKS_5: HtmlBlock[] = [
  // ─── CTA Buttons ──────────────────────────────────────────────
  {
    id: "cleaning-cta-buttons",
    name: "CTA Button Stack",
    category: "cleaning",
    description: "Primary action button, secondary text button, and link with icons",
    variables: ["mainButtonLabel", "secondaryButtonLabel", "linkLabel"],
    html: `<div class="cl-c">
  <div class="cl-cta">
    <a href="#" class="cl-cta-main">📅 {{mainButtonLabel}}</a>
    <a href="#" class="cl-cta-secondary">💬 {{secondaryButtonLabel}}</a>
    <a href="#" class="cl-cta-link">📹 {{linkLabel}} →</a>
  </div>
</div>`,
    css: `:scope .cl-c {
  max-width: 680px;
  margin: 0 auto;
  padding: 0 20px;
}
:scope .cl-cta {
  padding: 40px 0 20px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}
:scope .cl-cta-main {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  max-width: 400px;
  padding: 18px 32px;
  background: linear-gradient(135deg, var(--primary-color, #10b981), color-mix(in srgb, var(--primary-color, #10b981), white 25%));
  color: white;
  font-family: 'Poppins', var(--heading-font, sans-serif);
  font-weight: 700;
  font-size: 1.15rem;
  border: none;
  border-radius: 24px;
  cursor: pointer;
  box-shadow: 0 6px 24px color-mix(in srgb, var(--primary-color, #10b981) 35%, transparent);
  transition: all 0.3s;
  text-decoration: none;
  animation: cl-pulse 2.5s infinite;
}
:scope .cl-cta-main:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 32px color-mix(in srgb, var(--primary-color, #10b981) 45%, transparent);
  color: white;
  animation: none;
}
@keyframes cl-pulse {
  0% { box-shadow: 0 6px 24px rgba(16, 185, 129, 0.35); }
  50% { box-shadow: 0 6px 24px rgba(16, 185, 129, 0.55), 0 0 0 8px rgba(16, 185, 129, 0.1); }
  100% { box-shadow: 0 6px 24px rgba(16, 185, 129, 0.35); }
}
:scope .cl-cta-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  max-width: 400px;
  padding: 15px 28px;
  background: #ffffff;
  color: #44403c;
  font-family: 'Poppins', var(--heading-font, sans-serif);
  font-weight: 600;
  font-size: 1rem;
  border: 2px solid #e7e5e4;
  border-radius: 24px;
  cursor: pointer;
  transition: all 0.3s;
  text-decoration: none;
}
:scope .cl-cta-secondary:hover {
  border-color: var(--primary-color, #10b981);
  color: color-mix(in srgb, var(--primary-color, #10b981), black 10%);
  background: color-mix(in srgb, var(--primary-color, #10b981) 8%, white);
}
:scope .cl-cta-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 6px;
  font-size: 0.95rem;
  font-weight: 600;
  color: #3b82f6;
  transition: all 0.2s;
  text-decoration: none;
}
:scope .cl-cta-link:hover {
  color: #2563eb;
  gap: 12px;
}`,
  },
];
