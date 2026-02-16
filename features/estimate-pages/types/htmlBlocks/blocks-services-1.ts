import type { HtmlBlock } from "./types";

export const SERVICES_BLOCKS_1: HtmlBlock[] = [
  {
    id: "service-card",
    name: "Service Card",
    category: "services",
    description: "Service offering with icon, title, description, and price",
    variables: ["serviceName", "serviceDescription", "servicePrice"],
    html: `<div class="service-card">
  <div class="service-icon">\u2699\uFE0F</div>
  <h3 class="service-name">{{serviceName}}</h3>
  <p class="service-description">{{serviceDescription}}</p>
  <div class="service-price">{{servicePrice}}</div>
  <button class="service-button">Learn More</button>
</div>`,
    css: `:scope .service-card {
  max-width: 400px;
  padding: 2rem;
  border: 2px solid #e5e7eb;
  border-radius: 1rem;
  background: white;
  transition: all 0.3s;
}
:scope .service-card:hover {
  border-color: {{brand.primaryColor}};
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  transform: translateY(-4px);
}
:scope .service-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}
:scope .service-name {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 1rem;
}
:scope .service-description {
  color: #6b7280;
  line-height: 1.7;
  margin-bottom: 1.5rem;
}
:scope .service-price {
  font-size: 2rem;
  font-weight: 800;
  color: {{brand.primaryColor}};
  margin-bottom: 1.5rem;
}
:scope .service-button {
  width: 100%;
  padding: 0.75rem;
  background: {{brand.primaryColor}};
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}
:scope .service-button:hover {
  opacity: 0.9;
}`,
  },
  {
    id: "service-grid",
    name: "Service Grid",
    category: "services",
    description: "Grid of service offerings",
    variables: ["service1", "service2", "service3", "service4"],
    html: `<div class="service-grid">
  <div class="service-item">
    <div class="service-icon-grid">\uD83D\uDD27</div>
    <h3 class="service-title-grid">{{service1}}</h3>
  </div>
  <div class="service-item">
    <div class="service-icon-grid">\u26A1</div>
    <h3 class="service-title-grid">{{service2}}</h3>
  </div>
  <div class="service-item">
    <div class="service-icon-grid">\uD83C\uDFE0</div>
    <h3 class="service-title-grid">{{service3}}</h3>
  </div>
  <div class="service-item">
    <div class="service-icon-grid">\u2728</div>
    <h3 class="service-title-grid">{{service4}}</h3>
  </div>
</div>`,
    css: `:scope .service-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  padding: 2rem 0;
}
:scope .service-item {
  text-align: center;
  padding: 2rem 1rem;
  background: white;
  border-radius: 0.75rem;
  border: 2px solid #f3f4f6;
  transition: all 0.3s;
}
:scope .service-item:hover {
  border-color: {{brand.primaryColor}};
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}
:scope .service-icon-grid {
  font-size: 3rem;
  margin-bottom: 1rem;
}
:scope .service-title-grid {
  font-size: 1.125rem;
  font-weight: 700;
  color: #111827;
}
@media (max-width: 640px) {
  :scope .service-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
}`,
  },
];
