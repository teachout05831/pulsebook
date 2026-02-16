import type { HtmlBlock } from "./types";

export const SERVICES_BLOCKS_2: HtmlBlock[] = [
  {
    id: "service-checklist",
    name: "Service Checklist",
    category: "services",
    description: "Checklist of services or features with checkmarks",
    variables: ["checklistTitle", "item1", "item2", "item3", "item4", "item5", "item6"],
    html: `<div class="service-checklist">
  <h3 class="checklist-title">{{checklistTitle}}</h3>
  <div class="checklist-grid">
    <div class="checklist-item">
      <span class="checklist-check">\u2713</span>
      <span class="checklist-text">{{item1}}</span>
    </div>
    <div class="checklist-item">
      <span class="checklist-check">\u2713</span>
      <span class="checklist-text">{{item2}}</span>
    </div>
    <div class="checklist-item">
      <span class="checklist-check">\u2713</span>
      <span class="checklist-text">{{item3}}</span>
    </div>
    <div class="checklist-item">
      <span class="checklist-check">\u2713</span>
      <span class="checklist-text">{{item4}}</span>
    </div>
    <div class="checklist-item">
      <span class="checklist-check">\u2713</span>
      <span class="checklist-text">{{item5}}</span>
    </div>
    <div class="checklist-item">
      <span class="checklist-check">\u2713</span>
      <span class="checklist-text">{{item6}}</span>
    </div>
  </div>
</div>`,
    css: `:scope .service-checklist {
  padding: 2.5rem;
  background: white;
  border-radius: 12px;
  border: 2px solid #e5e7eb;
  margin: 2rem 0;
}
:scope .checklist-title {
  font-size: 1.75rem;
  font-weight: 800;
  color: #111827;
  margin-bottom: 2rem;
  text-align: center;
}
:scope .checklist-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;
}
:scope .checklist-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 8px;
}
:scope .checklist-check {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  background: {{brand.primaryColor}};
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  font-size: 0.875rem;
}
:scope .checklist-text {
  font-size: 1rem;
  color: #374151;
  font-weight: 600;
}
@media (max-width: 768px) {
  :scope .checklist-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}`,
  },
];
