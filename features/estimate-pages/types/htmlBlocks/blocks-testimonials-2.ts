import type { HtmlBlock } from "./types";

export const TESTIMONIALS_BLOCKS_2: HtmlBlock[] = [
  {
    id: "before-after-grid",
    name: "Before/After Grid",
    category: "testimonials",
    description: "Side-by-side before and after comparison",
    variables: ["beforeTitle", "afterTitle", "beforeDescription", "afterDescription"],
    html: `<div class="before-after-grid">
  <div class="ba-column ba-before">
    <div class="ba-label">BEFORE</div>
    <div class="ba-placeholder">\uD83C\uDFE0</div>
    <h4 class="ba-title">{{beforeTitle}}</h4>
    <p class="ba-description">{{beforeDescription}}</p>
  </div>
  <div class="ba-divider">
    <div class="ba-arrow">\u2192</div>
  </div>
  <div class="ba-column ba-after">
    <div class="ba-label">AFTER</div>
    <div class="ba-placeholder">\u2728</div>
    <h4 class="ba-title">{{afterTitle}}</h4>
    <p class="ba-description">{{afterDescription}}</p>
  </div>
</div>`,
    css: `:scope .before-after-grid {
  display: flex;
  align-items: stretch;
  gap: 2rem;
  margin: 2rem 0;
  padding: 2rem;
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
  border-radius: 16px;
}
:scope .ba-column {
  flex: 1;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  text-align: center;
}
:scope .ba-before {
  border: 3px solid #ef4444;
}
:scope .ba-after {
  border: 3px solid #10b981;
}
:scope .ba-label {
  font-size: 0.875rem;
  font-weight: 900;
  letter-spacing: 0.1em;
  margin-bottom: 1rem;
}
:scope .ba-before .ba-label {
  color: #ef4444;
}
:scope .ba-after .ba-label {
  color: #10b981;
}
:scope .ba-placeholder {
  font-size: 5rem;
  margin: 1.5rem 0;
  filter: grayscale(0.3);
}
:scope .ba-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #111827;
  margin-bottom: 1rem;
}
:scope .ba-description {
  font-size: 0.9rem;
  color: #6b7280;
  line-height: 1.6;
}
:scope .ba-divider {
  display: flex;
  align-items: center;
  justify-content: center;
}
:scope .ba-arrow {
  width: 60px;
  height: 60px;
  background: {{brand.primaryColor}};
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 900;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
@media (max-width: 768px) {
  :scope .before-after-grid {
    flex-direction: column;
    gap: 1.5rem;
  }
  :scope .ba-divider {
    transform: rotate(90deg);
  }
}`,
  },
];
