import type { HtmlBlock } from "./types";

export const STATS_BLOCKS: HtmlBlock[] = [
  {
    id: "stats-grid",
    name: "Stats Grid",
    category: "stats",
    description: "Four statistics with numbers and labels",
    variables: ["stat1Number", "stat1Label", "stat2Number", "stat2Label", "stat3Number", "stat3Label", "stat4Number", "stat4Label"],
    html: `<div class="stats-grid">
  <div class="stat-item">
    <div class="stat-number">{{stat1Number}}</div>
    <div class="stat-label">{{stat1Label}}</div>
  </div>
  <div class="stat-item">
    <div class="stat-number">{{stat2Number}}</div>
    <div class="stat-label">{{stat2Label}}</div>
  </div>
  <div class="stat-item">
    <div class="stat-number">{{stat3Number}}</div>
    <div class="stat-label">{{stat3Label}}</div>
  </div>
  <div class="stat-item">
    <div class="stat-number">{{stat4Number}}</div>
    <div class="stat-label">{{stat4Label}}</div>
  </div>
</div>`,
    css: `:scope .stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  padding: 3rem 0;
  text-align: center;
}
:scope .stat-item {
  padding: 1.5rem;
}
:scope .stat-number {
  font-size: 3rem;
  font-weight: 800;
  color: {{brand.primaryColor}};
  line-height: 1;
  margin-bottom: 0.5rem;
}
:scope .stat-label {
  font-size: 1rem;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 600;
}
@media (max-width: 640px) {
  :scope .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
  :scope .stat-number {
    font-size: 2.5rem;
  }
}`,
  },
];
