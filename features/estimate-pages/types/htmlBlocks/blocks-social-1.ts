import type { HtmlBlock } from "./types";

export const SOCIAL_BLOCKS_1: HtmlBlock[] = [
  {
    id: "social-proof-banner",
    name: "Social Proof Banner",
    category: "social",
    description: "Trust indicators with customer count and rating",
    variables: ["customerCount", "rating", "reviewCount"],
    html: `<div class="social-proof">
  <div class="proof-stat">
    <div class="proof-number">{{customerCount}}</div>
    <div class="proof-label">Happy Customers</div>
  </div>
  <div class="proof-divider"></div>
  <div class="proof-stat">
    <div class="proof-number">{{rating}} ⭐</div>
    <div class="proof-label">{{reviewCount}} Reviews</div>
  </div>
</div>`,
    css: `:scope .social-proof {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3rem;
  padding: 2rem;
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
  border-radius: 1rem;
  margin: 2rem 0;
}
:scope .proof-stat {
  text-align: center;
}
:scope .proof-number {
  font-size: 2.5rem;
  font-weight: 800;
  color: {{brand.primaryColor}};
  line-height: 1;
  margin-bottom: 0.5rem;
}
:scope .proof-label {
  font-size: 0.875rem;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 600;
}
:scope .proof-divider {
  width: 2px;
  height: 60px;
  background: #d1d5db;
}
@media (max-width: 640px) {
  :scope .social-proof {
    flex-direction: column;
    gap: 1.5rem;
  }
  :scope .proof-divider {
    width: 60px;
    height: 2px;
  }
}`,
  },
  {
    id: "trust-seal",
    name: "Trust Seals",
    category: "social",
    description: "Trust badges and certifications",
    variables: ["badge1Text", "badge2Text", "badge3Text"],
    html: `<div class="trust-seals">
  <div class="trust-badge">
    <div class="trust-icon">✓</div>
    <div class="trust-text">{{badge1Text}}</div>
  </div>
  <div class="trust-badge">
    <div class="trust-icon">🔒</div>
    <div class="trust-text">{{badge2Text}}</div>
  </div>
  <div class="trust-badge">
    <div class="trust-icon">⭐</div>
    <div class="trust-text">{{badge3Text}}</div>
  </div>
</div>`,
    css: `:scope .trust-seals {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  padding: 2rem;
  background: white;
  border-radius: 0.75rem;
  margin: 2rem 0;
}
:scope .trust-badge {
  text-align: center;
}
:scope .trust-icon {
  width: 60px;
  height: 60px;
  margin: 0 auto 0.75rem;
  background: linear-gradient(135deg, {{brand.primaryColor}} 0%, #1e3a8a 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
}
:scope .trust-text {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
@media (max-width: 640px) {
  :scope .trust-seals {
    flex-direction: column;
    gap: 1.5rem;
  }
}`,
  },
];
