import type { HtmlBlock } from "./types";

export const FEATURES_BLOCKS: HtmlBlock[] = [
  {
    id: "three-column-features",
    name: "3-Column Features",
    category: "features",
    description: "Three feature cards with icons, headings, and descriptions",
    variables: ["feature1Title", "feature1Description", "feature2Title", "feature2Description", "feature3Title", "feature3Description"],
    html: `<div class="feature-grid">
  <div class="feature-card">
    <div class="feature-icon">✓</div>
    <h3 class="feature-title">{{feature1Title}}</h3>
    <p class="feature-description">{{feature1Description}}</p>
  </div>
  <div class="feature-card">
    <div class="feature-icon">⚡</div>
    <h3 class="feature-title">{{feature2Title}}</h3>
    <p class="feature-description">{{feature2Description}}</p>
  </div>
  <div class="feature-card">
    <div class="feature-icon">★</div>
    <h3 class="feature-title">{{feature3Title}}</h3>
    <p class="feature-description">{{feature3Description}}</p>
  </div>
</div>`,
    css: `:scope .feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  padding: 2rem 0;
}
:scope .feature-card {
  text-align: center;
  padding: 1.5rem;
  border-radius: 0.5rem;
  background: #f9fafb;
  transition: transform 0.2s;
}
:scope .feature-card:hover {
  transform: translateY(-4px);
}
:scope .feature-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: {{brand.primaryColor}};
}
:scope .feature-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #111827;
}
:scope .feature-description {
  color: #6b7280;
  line-height: 1.6;
}
@media (max-width: 640px) {
  :scope .feature-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}`,
  },
  {
    id: "feature-list",
    name: "Feature List",
    category: "features",
    description: "Vertical list of features with checkmarks",
    variables: ["listHeading", "feature1", "feature2", "feature3", "feature4", "feature5"],
    html: `<div class="feature-list-container">
  <h2 class="feature-list-heading">{{listHeading}}</h2>
  <ul class="feature-list">
    <li>{{feature1}}</li>
    <li>{{feature2}}</li>
    <li>{{feature3}}</li>
    <li>{{feature4}}</li>
    <li>{{feature5}}</li>
  </ul>
</div>`,
    css: `:scope .feature-list-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}
:scope .feature-list-heading {
  font-size: 1.75rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 1.5rem;
  text-align: center;
}
:scope .feature-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
:scope .feature-list li {
  padding: 1rem 0 1rem 2.5rem;
  color: #374151;
  font-size: 1.125rem;
  line-height: 1.6;
  border-bottom: 1px solid #f3f4f6;
  position: relative;
}
:scope .feature-list li:before {
  content: "✓";
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 1.5rem;
  height: 1.5rem;
  background: {{brand.primaryColor}};
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.875rem;
}
:scope .feature-list li:last-child {
  border-bottom: none;
}`,
  },
];
