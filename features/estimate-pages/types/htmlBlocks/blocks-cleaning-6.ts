import type { HtmlBlock } from "./types";

export const CLEANING_BLOCKS_6: HtmlBlock[] = [
  // ─── Guarantee Badge ──────────────────────────────────────────
  {
    id: "cleaning-guarantee",
    name: "Satisfaction Guarantee",
    category: "cleaning",
    description: "Trust badge with guarantee title and description",
    variables: ["guaranteeTitle", "guaranteeDescription"],
    html: `<div class="cl-c">
  <div class="cl-guarantee">
    <div class="cl-guarantee-icon">🛡️</div>
    <div class="cl-guarantee-body">
      <strong>{{guaranteeTitle}}</strong>
      <span>{{guaranteeDescription}}</span>
    </div>
  </div>
</div>`,
    css: `:scope .cl-c {
  max-width: 680px;
  margin: 0 auto;
  padding: 0 20px;
}
:scope .cl-guarantee {
  display: flex;
  align-items: center;
  gap: 16px;
  background: #eff6ff;
  border-radius: 24px;
  padding: 20px 24px;
  margin-top: 32px;
  border: 1px solid #dbeafe;
}
:scope .cl-guarantee-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #dbeafe, #bfdbfe);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 1.5rem;
}
:scope .cl-guarantee-body strong {
  display: block;
  font-family: 'Poppins', var(--heading-font, sans-serif);
  font-size: 0.95rem;
  color: #292524;
  margin-bottom: 2px;
}
:scope .cl-guarantee-body span {
  font-size: 0.85rem;
  color: #78716c;
}
@media (max-width: 480px) {
  :scope .cl-guarantee {
    flex-direction: column;
    text-align: center;
  }
}`,
  },

  // ─── Estimate Note ────────────────────────────────────────────
  {
    id: "cleaning-estimate-note",
    name: "Estimate Footer Note",
    category: "cleaning",
    description: "Validity notice with estimate number and preparation date",
    variables: ["validDays", "estimateNumber", "preparedDate"],
    html: `<div class="cl-c">
  <div class="cl-note">
    <p>This estimate is valid for {{validDays}} days. Prices may vary for homes over 2,500 sq ft.</p>
    <p>Estimate #{{estimateNumber}} &bull; Prepared {{preparedDate}}</p>
  </div>
</div>`,
    css: `:scope .cl-c {
  max-width: 680px;
  margin: 0 auto;
  padding: 0 20px;
}
:scope .cl-note {
  font-size: 0.82rem;
  color: #a8a29e;
  margin-top: 20px;
  line-height: 1.5;
  text-align: center;
}
:scope .cl-note p {
  margin: 0 0 4px;
}`,
  },
];
