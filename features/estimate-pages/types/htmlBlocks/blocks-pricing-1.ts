import type { HtmlBlock } from "./types";

export const PRICING_BLOCKS_1: HtmlBlock[] = [
  {
    id: "two-column-pricing",
    name: "2-Column Pricing Table",
    category: "pricing",
    description: "Two pricing tiers side-by-side with features list",
    variables: ["tier1Name", "tier1Price", "tier1Features", "tier2Name", "tier2Price", "tier2Features"],
    html: `<div class="pricing-container">
  <div class="pricing-card">
    <h3 class="pricing-name">{{tier1Name}}</h3>
    <div class="pricing-price">{{tier1Price}}</div>
    <ul class="pricing-features">
      {{tier1Features}}
    </ul>
    <button class="pricing-button">Choose Plan</button>
  </div>
  <div class="pricing-card featured">
    <div class="pricing-badge">Popular</div>
    <h3 class="pricing-name">{{tier2Name}}</h3>
    <div class="pricing-price">{{tier2Price}}</div>
    <ul class="pricing-features">
      {{tier2Features}}
    </ul>
    <button class="pricing-button">Choose Plan</button>
  </div>
</div>`,
    css: `:scope .pricing-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  padding: 2rem 0;
  max-width: 800px;
  margin: 0 auto;
}
:scope .pricing-card {
  position: relative;
  border: 2px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 2rem;
  background: white;
  transition: transform 0.2s, box-shadow 0.2s;
}
:scope .pricing-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}
:scope .pricing-card.featured {
  border-color: {{brand.primaryColor}};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
:scope .pricing-badge {
  position: absolute;
  top: -12px;
  right: 1rem;
  background: {{brand.primaryColor}};
  color: white;
  padding: 0.25rem 1rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 600;
}
:scope .pricing-name {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #111827;
}
:scope .pricing-price {
  font-size: 2.5rem;
  font-weight: 800;
  color: {{brand.primaryColor}};
  margin-bottom: 1.5rem;
}
:scope .pricing-features {
  list-style: none;
  padding: 0;
  margin: 0 0 2rem 0;
}
:scope .pricing-features li {
  padding: 0.5rem 0;
  color: #4b5563;
  border-bottom: 1px solid #f3f4f6;
}
:scope .pricing-features li:before {
  content: "\u2713";
  color: {{brand.primaryColor}};
  font-weight: bold;
  margin-right: 0.5rem;
}
:scope .pricing-button {
  width: 100%;
  padding: 0.75rem;
  background: {{brand.primaryColor}};
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
:scope .pricing-button:hover {
  opacity: 0.9;
}
@media (max-width: 640px) {
  :scope .pricing-container {
    grid-template-columns: 1fr;
  }
}`,
  },
];
