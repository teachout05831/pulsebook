import type { HtmlBlock } from "./types";

export const CTA_BLOCKS_5: HtmlBlock[] = [
  {
    id: "video-call-cta-dark",
    name: "Video Call CTA (Dark)",
    category: "cta",
    description:
      "Full-width dark gradient CTA with centered heading, subtitle, two buttons (video call + phone), and availability hint",
    variables: [
      "label",
      "heading",
      "subtitle",
      "primaryBtnText",
      "secondaryBtnText",
      "hintText",
    ],
    html: `<div class="vcd-cta">
  <div class="vcd-inner">
    <p class="vcd-label">{{label}}</p>
    <h2 class="vcd-heading">{{heading}}</h2>
    <p class="vcd-subtitle">{{subtitle}}</p>
    <div class="vcd-buttons">
      <a href="#" class="vcd-btn vcd-primary">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
        {{primaryBtnText}}
      </a>
      <a href="#" class="vcd-btn vcd-secondary">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>
        {{secondaryBtnText}}
      </a>
    </div>
    <p class="vcd-hint">{{hintText}}</p>
  </div>
</div>`,
    css: `:scope .vcd-cta {
  padding: 6rem 1.5rem;
  background: linear-gradient(135deg, #0f172a, #1e3a8a);
  position: relative;
  overflow: hidden;
}
:scope .vcd-cta::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 50% 80% at 80% 50%, rgba(59,130,246,0.15) 0%, transparent 60%);
}
:scope .vcd-inner {
  position: relative;
  z-index: 2;
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}
:scope .vcd-label {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #60a5fa;
  margin: 0 0 0.75rem;
}
:scope .vcd-heading {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 1rem;
}
:scope .vcd-subtitle {
  font-size: 1.1rem;
  color: rgba(255,255,255,0.65);
  max-width: 640px;
  margin: 0 auto 3rem;
}
:scope .vcd-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}
:scope .vcd-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 0.75rem;
  transition: all 0.2s;
  text-decoration: none;
  cursor: pointer;
}
:scope .vcd-btn svg { width: 1.25rem; height: 1.25rem; }
:scope .vcd-primary {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: #fff;
  box-shadow: 0 4px 15px rgba(37,99,235,0.3);
}
:scope .vcd-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(37,99,235,0.4); }
:scope .vcd-secondary {
  background: transparent;
  color: #fff;
  border: 2px solid rgba(255,255,255,0.3);
}
:scope .vcd-secondary:hover { border-color: rgba(255,255,255,0.6); background: rgba(255,255,255,0.05); }
:scope .vcd-hint {
  color: rgba(255,255,255,0.4);
  font-size: 0.85rem;
  margin: 0;
}
@media (max-width: 768px) {
  :scope .vcd-buttons { flex-direction: column; align-items: stretch; max-width: 360px; margin-left: auto; margin-right: auto; }
}`,
  },
];
