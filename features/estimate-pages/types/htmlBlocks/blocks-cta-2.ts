import type { HtmlBlock } from "./types";

export const CTA_BLOCKS_2: HtmlBlock[] = [
  {
    id: "urgency-banner",
    name: "Urgency Banner",
    category: "cta",
    description: "Limited time offer banner with countdown feel",
    variables: ["urgencyHeading", "urgencySubtext"],
    html: `<div class="urgency-banner">
  <div class="urgency-pulse"></div>
  <div class="urgency-content">
    <h3 class="urgency-heading">{{urgencyHeading}}</h3>
    <p class="urgency-subtext">{{urgencySubtext}}</p>
  </div>
</div>`,
    css: `:scope .urgency-banner {
  position: relative;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border: 2px solid #f59e0b;
  border-radius: 0.75rem;
  padding: 1.5rem 2rem;
  margin: 2rem 0;
  overflow: hidden;
}
:scope .urgency-pulse {
  position: absolute;
  top: 50%;
  left: 1rem;
  transform: translateY(-50%);
  width: 12px;
  height: 12px;
  background: #dc2626;
  border-radius: 50%;
  animation: pulse 2s infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; transform: translateY(-50%) scale(1); }
  50% { opacity: 0.5; transform: translateY(-50%) scale(1.2); }
}
:scope .urgency-content {
  padding-left: 2rem;
}
:scope .urgency-heading {
  font-size: 1.25rem;
  font-weight: 800;
  color: #92400e;
  margin-bottom: 0.25rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
:scope .urgency-subtext {
  color: #b45309;
  font-weight: 600;
}
@media (max-width: 640px) {
  :scope .urgency-banner {
    padding: 1.25rem 1.5rem;
  }
  :scope .urgency-heading {
    font-size: 1rem;
  }
}`,
  },
  {
    id: "newsletter-signup",
    name: "Newsletter Signup",
    category: "cta",
    description: "Email newsletter subscription form",
    variables: ["newsletterHeading", "newsletterSubtext", "buttonText"],
    html: `<div class="newsletter-box">
  <h3 class="newsletter-heading">{{newsletterHeading}}</h3>
  <p class="newsletter-subtext">{{newsletterSubtext}}</p>
  <div class="newsletter-form">
    <input type="email" class="newsletter-input" placeholder="Enter your email..." />
    <button class="newsletter-button">{{buttonText}}</button>
  </div>
</div>`,
    css: `:scope .newsletter-box {
  max-width: 600px;
  margin: 2rem auto;
  padding: 3rem 2rem;
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
  border-radius: 1rem;
  text-align: center;
}
:scope .newsletter-heading {
  font-size: 1.75rem;
  font-weight: 800;
  color: #111827;
  margin-bottom: 0.5rem;
}
:scope .newsletter-subtext {
  color: #6b7280;
  margin-bottom: 2rem;
  line-height: 1.6;
}
:scope .newsletter-form {
  display: flex;
  gap: 0.5rem;
}
:scope .newsletter-input {
  flex: 1;
  padding: 0.875rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 1rem;
}
:scope .newsletter-input:focus {
  outline: none;
  border-color: {{brand.primaryColor}};
}
:scope .newsletter-button {
  padding: 0.875rem 2rem;
  background: {{brand.primaryColor}};
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.2s;
  white-space: nowrap;
}
:scope .newsletter-button:hover {
  opacity: 0.9;
}
@media (max-width: 640px) {
  :scope .newsletter-form {
    flex-direction: column;
  }
}`,
  },
];
