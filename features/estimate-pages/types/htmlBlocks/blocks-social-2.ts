import type { HtmlBlock } from "./types";

export const SOCIAL_BLOCKS_2: HtmlBlock[] = [
  {
    id: "certification-grid",
    name: "Certification Grid",
    category: "social",
    description: "Display professional certifications and licenses",
    variables: ["cert1", "cert2", "cert3", "cert4"],
    html: `<div class="cert-grid">
  <div class="cert-item">
    <div class="cert-icon">📜</div>
    <div class="cert-name">{{cert1}}</div>
  </div>
  <div class="cert-item">
    <div class="cert-icon">🏆</div>
    <div class="cert-name">{{cert2}}</div>
  </div>
  <div class="cert-item">
    <div class="cert-icon">✓</div>
    <div class="cert-name">{{cert3}}</div>
  </div>
  <div class="cert-item">
    <div class="cert-icon">⭐</div>
    <div class="cert-name">{{cert4}}</div>
  </div>
</div>`,
    css: `:scope .cert-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  padding: 2rem;
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
  border-radius: 12px;
  margin: 2rem 0;
}
:scope .cert-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: white;
  border-radius: 8px;
  border: 2px solid #e5e7eb;
  transition: all 0.2s;
}
:scope .cert-item:hover {
  border-color: {{brand.primaryColor}};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
:scope .cert-icon {
  font-size: 2rem;
  flex-shrink: 0;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, {{brand.primaryColor}} 0%, #1e40af 100%);
  border-radius: 50%;
}
:scope .cert-name {
  font-weight: 700;
  color: #1f2937;
  font-size: 0.9rem;
  line-height: 1.3;
}
@media (max-width: 640px) {
  :scope .cert-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}`,
  },
  {
    id: "warranty-box",
    name: "Warranty Box",
    category: "social",
    description: "Highlight warranty or guarantee terms",
    variables: ["warrantyTitle", "warrantyYears", "warrantyDetails"],
    html: `<div class="warranty-box">
  <div class="warranty-badge">
    <div class="warranty-shield">🛡️</div>
    <div class="warranty-years">{{warrantyYears}}</div>
  </div>
  <div class="warranty-content">
    <h3 class="warranty-title">{{warrantyTitle}}</h3>
    <p class="warranty-details">{{warrantyDetails}}</p>
  </div>
</div>`,
    css: `:scope .warranty-box {
  display: flex;
  align-items: center;
  gap: 2rem;
  padding: 2.5rem;
  background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
  border: 3px solid #10b981;
  border-radius: 16px;
  margin: 2rem 0;
}
:scope .warranty-badge {
  position: relative;
  flex-shrink: 0;
}
:scope .warranty-shield {
  font-size: 5rem;
  filter: drop-shadow(0 4px 8px rgba(16, 185, 129, 0.3));
}
:scope .warranty-years {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.5rem;
  font-weight: 900;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}
:scope .warranty-content {
  flex: 1;
}
:scope .warranty-title {
  font-size: 1.75rem;
  font-weight: 800;
  color: #065f46;
  margin-bottom: 0.5rem;
}
:scope .warranty-details {
  font-size: 1rem;
  color: #047857;
  line-height: 1.6;
}
@media (max-width: 768px) {
  :scope .warranty-box {
    flex-direction: column;
    text-align: center;
    gap: 1.5rem;
  }
  :scope .warranty-shield {
    font-size: 4rem;
  }
  :scope .warranty-title {
    font-size: 1.5rem;
  }
}`,
  },
];
