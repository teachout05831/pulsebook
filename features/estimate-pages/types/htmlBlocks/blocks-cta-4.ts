import type { HtmlBlock } from "./types";

export const CTA_BLOCKS_4: HtmlBlock[] = [
  {
    id: "coupon-card",
    name: "Coupon Card",
    category: "cta",
    description: "Promotional coupon with discount amount and code",
    variables: ["amount", "title", "code", "expiry", "stampText"],
    html: `<div class="coupon-card">
  <div class="coupon-stamp">{{stampText}}</div>
  <div class="coupon-amount">{{amount}}</div>
  <div class="coupon-title">{{title}}</div>
  <div class="coupon-code">CODE: {{code}}</div>
  <div class="coupon-expiry">Expires: {{expiry}}</div>
</div>`,
    css: `:scope .coupon-card {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border: 3px dashed #f59e0b;
  border-radius: 16px;
  padding: 3rem 2rem;
  max-width: 600px;
  margin: 0 auto;
  position: relative;
  text-align: center;
}
:scope .coupon-stamp {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 80px;
  height: 80px;
  border: 3px solid #dc2626;
  border-radius: 50%;
  transform: rotate(-15deg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  font-size: 0.75rem;
  color: #dc2626;
  text-transform: uppercase;
  line-height: 1.2;
  padding: 0.5rem;
}
:scope .coupon-amount {
  font-size: 4rem;
  font-weight: 900;
  color: #dc2626;
  line-height: 1;
  margin-bottom: 1rem;
}
:scope .coupon-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #92400e;
  margin-bottom: 1.5rem;
}
:scope .coupon-code {
  background: white;
  padding: 1rem 2rem;
  border-radius: 8px;
  border: 2px dashed #f59e0b;
  font-weight: 700;
  color: #92400e;
  font-size: 1.25rem;
  margin-bottom: 1rem;
}
:scope .coupon-expiry {
  font-size: 0.875rem;
  color: #78350f;
  font-weight: 600;
}
@media (max-width: 640px) {
  :scope .coupon-amount {
    font-size: 3rem;
  }
  :scope .coupon-title {
    font-size: 1.25rem;
  }
}`,
  },
];
