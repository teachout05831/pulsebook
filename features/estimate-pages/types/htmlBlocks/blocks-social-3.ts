import type { HtmlBlock } from "./types";

export const SOCIAL_BLOCKS_3: HtmlBlock[] = [
  {
    id: "insurance-badge",
    name: "Insurance Badge",
    category: "social",
    description: "Display insurance and bonding information",
    variables: ["insuranceTitle", "insuranceProvider", "insuranceDetails"],
    html: `<div class="insurance-badge">
  <div class="insurance-icon">🔐</div>
  <div class="insurance-info">
    <h4 class="insurance-title">{{insuranceTitle}}</h4>
    <div class="insurance-provider">{{insuranceProvider}}</div>
    <p class="insurance-details">{{insuranceDetails}}</p>
  </div>
</div>`,
    css: `:scope .insurance-badge {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border: 2px solid #3b82f6;
  border-radius: 12px;
}
:scope .insurance-icon {
  font-size: 4rem;
  flex-shrink: 0;
  filter: drop-shadow(0 2px 8px rgba(59, 130, 246, 0.3));
}
:scope .insurance-info {
  flex: 1;
}
:scope .insurance-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #1e40af;
  margin-bottom: 0.25rem;
}
:scope .insurance-provider {
  font-size: 0.875rem;
  font-weight: 700;
  color: #3b82f6;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.75rem;
}
:scope .insurance-details {
  font-size: 0.9rem;
  color: #1e40af;
  line-height: 1.5;
}
@media (max-width: 640px) {
  :scope .insurance-badge {
    flex-direction: column;
    text-align: center;
  }
  :scope .insurance-icon {
    font-size: 3rem;
  }
}`,
  },
];
