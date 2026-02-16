import type { HtmlBlock } from "./types";

export const CONTENT_BLOCKS_2: HtmlBlock[] = [
  {
    id: "process-timeline",
    name: "Process Timeline",
    category: "content",
    description: "Step-by-step process with numbered timeline",
    variables: ["step1Title", "step1Description", "step2Title", "step2Description", "step3Title", "step3Description", "step4Title", "step4Description"],
    html: `<div class="process-timeline">
  <div class="process-step">
    <div class="process-number">1</div>
    <div class="process-content">
      <h3 class="process-title">{{step1Title}}</h3>
      <p class="process-description">{{step1Description}}</p>
    </div>
  </div>
  <div class="process-step">
    <div class="process-number">2</div>
    <div class="process-content">
      <h3 class="process-title">{{step2Title}}</h3>
      <p class="process-description">{{step2Description}}</p>
    </div>
  </div>
  <div class="process-step">
    <div class="process-number">3</div>
    <div class="process-content">
      <h3 class="process-title">{{step3Title}}</h3>
      <p class="process-description">{{step3Description}}</p>
    </div>
  </div>
  <div class="process-step">
    <div class="process-number">4</div>
    <div class="process-content">
      <h3 class="process-title">{{step4Title}}</h3>
      <p class="process-description">{{step4Description}}</p>
    </div>
  </div>
</div>`,
    css: `:scope .process-timeline {
  max-width: 700px;
  margin: 2rem auto;
  position: relative;
}
:scope .process-timeline:before {
  content: "";
  position: absolute;
  left: 30px;
  top: 40px;
  bottom: 40px;
  width: 2px;
  background: linear-gradient(to bottom, {{brand.primaryColor}}, #e5e7eb);
}
:scope .process-step {
  display: flex;
  gap: 2rem;
  margin-bottom: 2.5rem;
  position: relative;
}
:scope .process-number {
  flex-shrink: 0;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: {{brand.primaryColor}};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
  position: relative;
  z-index: 1;
}
:scope .process-content {
  flex: 1;
  padding-top: 0.5rem;
}
:scope .process-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.5rem;
}
:scope .process-description {
  color: #6b7280;
  line-height: 1.6;
}
@media (max-width: 640px) {
  :scope .process-timeline:before {
    left: 25px;
  }
  :scope .process-number {
    width: 50px;
    height: 50px;
    font-size: 1.25rem;
  }
}`,
  },
];
