import type { HtmlBlock } from "./types";

export const PRICING_BLOCKS_2: HtmlBlock[] = [
  {
    id: "comparison-table",
    name: "Comparison Table",
    category: "pricing",
    description: "Compare two options side-by-side",
    variables: ["option1Name", "option1Price", "option1Feature1", "option1Feature2", "option2Name", "option2Price", "option2Feature1", "option2Feature2"],
    html: `<div class="comparison-table">
  <div class="comparison-column">
    <h3 class="comparison-name">{{option1Name}}</h3>
    <div class="comparison-price">{{option1Price}}</div>
    <ul class="comparison-features">
      <li>{{option1Feature1}}</li>
      <li>{{option1Feature2}}</li>
    </ul>
  </div>
  <div class="comparison-column featured">
    <div class="comparison-badge">Best Value</div>
    <h3 class="comparison-name">{{option2Name}}</h3>
    <div class="comparison-price">{{option2Price}}</div>
    <ul class="comparison-features">
      <li>{{option2Feature1}}</li>
      <li>{{option2Feature2}}</li>
    </ul>
  </div>
</div>`,
    css: `:scope .comparison-table {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin: 2rem 0;
}
:scope .comparison-column {
  padding: 2rem;
  border: 2px solid #e5e7eb;
  border-radius: 1rem;
  background: white;
  position: relative;
}
:scope .comparison-column.featured {
  border-color: {{brand.primaryColor}};
  background: linear-gradient(135deg, #fefefe 0%, #f9fafb 100%);
}
:scope .comparison-badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: {{brand.primaryColor}};
  color: white;
  padding: 0.25rem 1rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
}
:scope .comparison-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 1rem;
  text-align: center;
}
:scope .comparison-price {
  font-size: 2rem;
  font-weight: 800;
  color: {{brand.primaryColor}};
  text-align: center;
  margin-bottom: 1.5rem;
}
:scope .comparison-features {
  list-style: none;
  padding: 0;
  margin: 0;
}
:scope .comparison-features li {
  padding: 0.75rem 0;
  color: #4b5563;
  border-bottom: 1px solid #f3f4f6;
}
:scope .comparison-features li:before {
  content: "\u2713";
  color: {{brand.primaryColor}};
  font-weight: bold;
  margin-right: 0.5rem;
}
@media (max-width: 768px) {
  :scope .comparison-table {
    grid-template-columns: 1fr;
  }
}`,
  },
];
