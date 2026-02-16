import type { HtmlBlock } from "./types";

export const SERVICES_BLOCKS_3: HtmlBlock[] = [
  {
    id: "service-areas",
    name: "Service Area List",
    category: "services",
    description: "List of service areas or locations",
    variables: ["areasTitle", "area1", "area2", "area3", "area4", "area5", "area6"],
    html: `<div class="service-areas">
  <h3 class="areas-title">{{areasTitle}}</h3>
  <div class="areas-grid">
    <div class="area-item">\uD83D\uDCCD {{area1}}</div>
    <div class="area-item">\uD83D\uDCCD {{area2}}</div>
    <div class="area-item">\uD83D\uDCCD {{area3}}</div>
    <div class="area-item">\uD83D\uDCCD {{area4}}</div>
    <div class="area-item">\uD83D\uDCCD {{area5}}</div>
    <div class="area-item">\uD83D\uDCCD {{area6}}</div>
  </div>
</div>`,
    css: `:scope .service-areas {
  padding: 2.5rem;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border-radius: 12px;
  margin: 2rem 0;
}
:scope .areas-title {
  font-size: 1.75rem;
  font-weight: 800;
  color: #0c4a6e;
  margin-bottom: 2rem;
  text-align: center;
}
:scope .areas-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}
:scope .area-item {
  padding: 1rem 1.5rem;
  background: white;
  border-radius: 8px;
  border: 2px solid #0ea5e9;
  font-weight: 700;
  color: #0c4a6e;
  text-align: center;
  transition: all 0.2s;
}
:scope .area-item:hover {
  background: {{brand.primaryColor}};
  color: white;
  border-color: {{brand.primaryColor}};
  transform: translateY(-2px);
}
@media (max-width: 768px) {
  :scope .areas-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 480px) {
  :scope .areas-grid {
    grid-template-columns: 1fr;
  }
}`,
  },
];
