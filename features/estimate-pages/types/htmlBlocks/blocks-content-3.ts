import type { HtmlBlock } from "./types";

export const CONTENT_BLOCKS_3: HtmlBlock[] = [
  {
    id: "hero-banner",
    name: "Hero Banner",
    category: "content",
    description: "Large hero section with headline and subheadline",
    variables: ["heroHeadline", "heroSubheadline", "heroButtonText"],
    html: `<div class="hero-banner">
  <div class="hero-content">
    <h1 class="hero-headline">{{heroHeadline}}</h1>
    <p class="hero-subheadline">{{heroSubheadline}}</p>
    <button class="hero-button">{{heroButtonText}}</button>
  </div>
</div>`,
    css: `:scope .hero-banner {
  background: linear-gradient(135deg, {{brand.primaryColor}} 0%, #1e3a8a 100%);
  color: white;
  padding: 5rem 2rem;
  border-radius: 1rem;
  margin: 2rem 0;
  text-align: center;
}
:scope .hero-content {
  max-width: 800px;
  margin: 0 auto;
}
:scope .hero-headline {
  font-size: 3rem;
  font-weight: 900;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  color: white;
}
:scope .hero-subheadline {
  font-size: 1.5rem;
  line-height: 1.6;
  opacity: 0.95;
  margin-bottom: 2.5rem;
}
:scope .hero-button {
  padding: 1rem 3rem;
  background: white;
  color: {{brand.primaryColor}};
  border: none;
  border-radius: 0.75rem;
  font-weight: 800;
  font-size: 1.25rem;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}
:scope .hero-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
}
@media (max-width: 768px) {
  :scope .hero-banner {
    padding: 3rem 1.5rem;
  }
  :scope .hero-headline {
    font-size: 2rem;
  }
  :scope .hero-subheadline {
    font-size: 1.125rem;
  }
}`,
  },
  {
    id: "contact-info",
    name: "Contact Information",
    category: "content",
    description: "Contact details with icons",
    variables: ["phone", "email", "address", "hours"],
    html: `<div class="contact-info">
  <div class="contact-item">
    <div class="contact-icon">📞</div>
    <div class="contact-text">{{phone}}</div>
  </div>
  <div class="contact-item">
    <div class="contact-icon">✉️</div>
    <div class="contact-text">{{email}}</div>
  </div>
  <div class="contact-item">
    <div class="contact-icon">📍</div>
    <div class="contact-text">{{address}}</div>
  </div>
  <div class="contact-item">
    <div class="contact-icon">🕐</div>
    <div class="contact-text">{{hours}}</div>
  </div>
</div>`,
    css: `:scope .contact-info {
  max-width: 500px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}
:scope .contact-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid #f3f4f6;
}
:scope .contact-item:last-child {
  border-bottom: none;
}
:scope .contact-icon {
  flex-shrink: 0;
  width: 2.5rem;
  height: 2.5rem;
  background: linear-gradient(135deg, {{brand.primaryColor}} 0%, #1e3a8a 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
}
:scope .contact-text {
  flex: 1;
  color: #374151;
  font-size: 1rem;
  line-height: 1.6;
}`,
  },
];
