import type { HtmlBlock } from "./types";

export const CTA_BLOCKS_3: HtmlBlock[] = [
  {
    id: "emergency-banner",
    name: "24/7 Emergency Banner",
    category: "cta",
    description: "Urgent availability banner with phone number for emergency services",
    variables: ["title", "phone", "subtext", "urgencyColor"],
    html: `<div class="emergency-banner">
  <div class="emergency-icon">🚨</div>
  <div class="emergency-title">{{title}}</div>
  <div class="emergency-phone">{{phone}}</div>
  <div class="emergency-subtext">{{subtext}}</div>
</div>`,
    css: `:scope .emergency-banner {
  background: linear-gradient(135deg, {{urgencyColor}} 0%, #991b1b 100%);
  color: white;
  padding: 2.5rem 2rem;
  border-radius: 12px;
  text-align: center;
  position: relative;
  overflow: hidden;
}
:scope .emergency-banner::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: repeating-linear-gradient(
    45deg,
    #fbbf24,
    #fbbf24 10px,
    #f59e0b 10px,
    #f59e0b 20px
  );
}
:scope .emergency-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  animation: pulse-emergency 2s infinite;
}
@keyframes pulse-emergency {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}
:scope .emergency-title {
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
:scope .emergency-phone {
  font-size: 2.5rem;
  font-weight: 900;
  margin: 1rem 0;
  color: #fbbf24;
}
:scope .emergency-subtext {
  font-size: 1.125rem;
  opacity: 0.95;
}
@media (max-width: 768px) {
  :scope .emergency-title {
    font-size: 1.5rem;
  }
  :scope .emergency-phone {
    font-size: 1.75rem;
  }
}`,
  },
  {
    id: "free-estimate-cta",
    name: "Free Estimate CTA",
    category: "cta",
    description: "Large prominent call-to-action for free estimates",
    variables: ["heading", "subtext", "buttonText"],
    html: `<div class="free-estimate">
  <div class="fe-title">{{heading}}</div>
  <div class="fe-text">{{subtext}}</div>
  <button class="fe-button">{{buttonText}}</button>
</div>`,
    css: `:scope .free-estimate {
  background: linear-gradient(135deg, {{brand.primaryColor}} 0%, #1e40af 100%);
  color: white;
  padding: 4rem 2rem;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 12px 32px rgba(37, 99, 235, 0.4);
}
:scope .fe-title {
  font-size: 3rem;
  font-weight: 900;
  margin-bottom: 1rem;
  line-height: 1.1;
}
:scope .fe-text {
  font-size: 1.25rem;
  opacity: 0.95;
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}
:scope .fe-button {
  display: inline-block;
  background: white;
  color: {{brand.primaryColor}};
  padding: 1.5rem 4rem;
  border-radius: 12px;
  font-weight: 800;
  font-size: 1.5rem;
  border: none;
  cursor: pointer;
  box-shadow: 0 8px 16px rgba(0,0,0,0.2);
  transition: all 0.3s;
}
:scope .fe-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(0,0,0,0.3);
}
@media (max-width: 768px) {
  :scope .fe-title {
    font-size: 2rem;
  }
  :scope .fe-text {
    font-size: 1rem;
  }
  :scope .fe-button {
    font-size: 1.25rem;
    padding: 1.25rem 3rem;
  }
}`,
  },
];
