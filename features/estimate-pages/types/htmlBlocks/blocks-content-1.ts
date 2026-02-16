import type { HtmlBlock } from "./types";

export const CONTENT_BLOCKS_1: HtmlBlock[] = [
  {
    id: "faq-accordion",
    name: "FAQ Accordion",
    category: "content",
    description: "Frequently asked questions with collapsible answers",
    variables: ["question1", "answer1", "question2", "answer2", "question3", "answer3"],
    html: `<div class="faq-container">
  <details class="faq-item">
    <summary class="faq-question">{{question1}}</summary>
    <div class="faq-answer">{{answer1}}</div>
  </details>
  <details class="faq-item">
    <summary class="faq-question">{{question2}}</summary>
    <div class="faq-answer">{{answer2}}</div>
  </details>
  <details class="faq-item">
    <summary class="faq-question">{{question3}}</summary>
    <div class="faq-answer">{{answer3}}</div>
  </details>
</div>`,
    css: `:scope .faq-container {
  max-width: 800px;
  margin: 2rem auto;
}
:scope .faq-item {
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  background: white;
  overflow: hidden;
}
:scope .faq-question {
  padding: 1.25rem;
  font-weight: 600;
  font-size: 1.125rem;
  color: #111827;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background 0.2s;
}
:scope .faq-question:hover {
  background: #f9fafb;
}
:scope .faq-question:after {
  content: "+";
  font-size: 1.5rem;
  color: {{brand.primaryColor}};
  font-weight: 300;
  transition: transform 0.3s;
}
:scope .faq-item[open] .faq-question:after {
  transform: rotate(45deg);
}
:scope .faq-answer {
  padding: 0 1.25rem 1.25rem 1.25rem;
  color: #4b5563;
  line-height: 1.7;
  border-top: 1px solid #f3f4f6;
}`,
  },
  {
    id: "two-column-content",
    name: "Two-Column Content",
    category: "content",
    description: "Two columns with heading and description on each side",
    variables: ["leftHeading", "leftDescription", "rightHeading", "rightDescription"],
    html: `<div class="two-column-content">
  <div class="content-column">
    <h3 class="content-heading">{{leftHeading}}</h3>
    <p class="content-description">{{leftDescription}}</p>
  </div>
  <div class="content-column">
    <h3 class="content-heading">{{rightHeading}}</h3>
    <p class="content-description">{{rightDescription}}</p>
  </div>
</div>`,
    css: `:scope .two-column-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 3rem;
  padding: 2rem 0;
}
:scope .content-column {
  padding: 1.5rem;
}
:scope .content-heading {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 1rem;
  border-bottom: 3px solid {{brand.primaryColor}};
  padding-bottom: 0.5rem;
}
:scope .content-description {
  color: #4b5563;
  line-height: 1.8;
}
@media (max-width: 768px) {
  :scope .two-column-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}`,
  },
];
