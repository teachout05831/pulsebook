import type { HtmlBlock } from "./types";

export const CLEANING_BLOCKS_3: HtmlBlock[] = [
  // ─── Pricing Card ─────────────────────────────────────────────
  {
    id: "cleaning-pricing-card",
    name: "Pricing Breakdown Card",
    category: "cleaning",
    description: "Clean pricing card with line items, badges, and total",
    variables: [
      "pricingTitle", "pricingSubtitle",
      "item1Name", "item1Badge", "item1Price",
      "item2Name", "item2Badge", "item2Price",
      "totalAmount",
    ],
    html: `<div class="cl-c">
  <div class="cl-pricing-section">
    <div class="cl-sh">
      <div class="cl-sh-icon">💰</div>
      <h2>Your Estimate</h2>
    </div>
    <div class="cl-pricing-card">
      <div class="cl-pricing-header">
        <h3>{{pricingTitle}}</h3>
        <p>{{pricingSubtitle}}</p>
      </div>
      <div class="cl-pricing-body">
        <div class="cl-pricing-line">
          <div class="cl-pricing-label">
            {{item1Name}}
            <span class="cl-badge cl-badge-blue">{{item1Badge}}</span>
          </div>
          <div class="cl-pricing-amount">{{item1Price}}</div>
        </div>
        <div class="cl-pricing-line">
          <div class="cl-pricing-label">
            {{item2Name}}
            <span class="cl-badge cl-badge-amber">{{item2Badge}}</span>
          </div>
          <div class="cl-pricing-amount">{{item2Price}}</div>
        </div>
      </div>
      <div class="cl-pricing-total">
        <div class="cl-total-label">Total</div>
        <div class="cl-total-amount">{{totalAmount}}</div>
      </div>
    </div>
  </div>
</div>`,
    css: `:scope .cl-c {
  max-width: 680px;
  margin: 0 auto;
  padding: 0 20px;
}
:scope .cl-sh {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding-top: 40px;
}
:scope .cl-sh-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: color-mix(in srgb, var(--primary-color, #10b981) 20%, white);
  font-size: 1.1rem;
}
:scope .cl-sh h2 {
  font-family: 'Poppins', var(--heading-font, sans-serif);
  font-size: 1.35rem;
  font-weight: 700;
  color: #292524;
  margin: 0;
}
:scope .cl-pricing-card {
  background: #ffffff;
  border-radius: 32px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.08), 0 4px 8px rgba(0,0,0,0.04);
  border: 2px solid color-mix(in srgb, var(--primary-color, #10b981) 20%, white);
  overflow: hidden;
  margin-top: 8px;
}
:scope .cl-pricing-header {
  background: linear-gradient(135deg, color-mix(in srgb, var(--primary-color, #10b981) 10%, white), #eff6ff);
  padding: 28px 28px 20px;
  text-align: center;
}
:scope .cl-pricing-header h3 {
  font-family: 'Poppins', var(--heading-font, sans-serif);
  font-size: 1.1rem;
  font-weight: 700;
  color: #44403c;
  margin: 0 0 4px;
}
:scope .cl-pricing-header p { font-size: 0.88rem; color: #78716c; margin: 0; }
:scope .cl-pricing-body { padding: 24px 28px; }
:scope .cl-pricing-line {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 0;
  border-bottom: 1px dashed #e7e5e4;
}
:scope .cl-pricing-line:last-of-type { border-bottom: none; }
:scope .cl-pricing-label {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.95rem;
  color: #57534e;
}
:scope .cl-badge {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 3px 8px;
  border-radius: 6px;
}
:scope .cl-badge-blue { background: #dbeafe; color: #3b82f6; }
:scope .cl-badge-amber { background: #fefce8; color: #d97706; }
:scope .cl-pricing-amount {
  font-family: 'Poppins', var(--heading-font, sans-serif);
  font-weight: 700;
  font-size: 1.1rem;
  color: #292524;
}
:scope .cl-pricing-total {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 28px;
  background: color-mix(in srgb, var(--primary-color, #10b981) 8%, white);
  border-top: 2px solid color-mix(in srgb, var(--primary-color, #10b981) 20%, white);
}
:scope .cl-total-label { font-family: 'Poppins', var(--heading-font, sans-serif); font-weight: 700; font-size: 1.05rem; color: #292524; }
:scope .cl-total-amount { font-family: 'Poppins', var(--heading-font, sans-serif); font-weight: 800; font-size: 1.7rem; color: color-mix(in srgb, var(--primary-color, #10b981), black 10%); }`,
  },
];
