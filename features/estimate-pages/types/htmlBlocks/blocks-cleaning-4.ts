import type { HtmlBlock } from "./types";

export const CLEANING_BLOCKS_4: HtmlBlock[] = [
  // ─── Upsell Banner ────────────────────────────────────────────
  {
    id: "cleaning-upsell-banner",
    name: "Savings Upsell Banner",
    category: "cleaning",
    description: "Eye-catching upsell banner with savings offer and price",
    variables: ["upsellTitle", "upsellDescription", "upsellPrice", "upsellPeriod"],
    html: `<div class="cl-c">
  <div class="cl-upsell">
    <div class="cl-upsell-icon">✨</div>
    <div class="cl-upsell-body">
      <strong>{{upsellTitle}}</strong>
      <span>{{upsellDescription}}</span>
    </div>
    <div class="cl-upsell-price">{{upsellPrice}}<span class="cl-upsell-period">/{{upsellPeriod}}</span></div>
  </div>
</div>`,
    css: `:scope .cl-c {
  max-width: 680px;
  margin: 0 auto;
  padding: 0 20px;
}
:scope .cl-upsell {
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  border-radius: 24px;
  padding: 22px 26px;
  margin-top: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
  border: 1px solid #fde68a;
}
:scope .cl-upsell-icon {
  font-size: 2rem;
  flex-shrink: 0;
}
:scope .cl-upsell-body {
  flex: 1;
}
:scope .cl-upsell-body strong {
  display: block;
  font-family: 'Poppins', var(--heading-font, sans-serif);
  color: #292524;
  font-size: 1rem;
  margin-bottom: 2px;
}
:scope .cl-upsell-body span {
  font-size: 0.88rem;
  color: #57534e;
}
:scope .cl-upsell-price {
  font-family: 'Poppins', var(--heading-font, sans-serif);
  font-weight: 800;
  font-size: 1.25rem;
  color: #b45309;
  white-space: nowrap;
}
:scope .cl-upsell-period {
  font-size: 0.75rem;
  font-weight: 500;
  color: #92400e;
}
@media (max-width: 480px) {
  :scope .cl-upsell {
    flex-direction: column;
    text-align: center;
  }
}`,
  },
];
