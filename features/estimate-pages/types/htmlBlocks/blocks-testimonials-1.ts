import type { HtmlBlock } from "./types";

export const TESTIMONIALS_BLOCKS_1: HtmlBlock[] = [
  {
    id: "testimonial-card",
    name: "Testimonial Card",
    category: "testimonials",
    description: "Customer testimonial with quote, name, and role",
    variables: ["quote", "customerName", "customerRole"],
    html: `<div class="testimonial-card">
  <div class="testimonial-quote-mark">"</div>
  <p class="testimonial-quote">{{quote}}</p>
  <div class="testimonial-author">
    <div class="testimonial-name">{{customerName}}</div>
    <div class="testimonial-role">{{customerRole}}</div>
  </div>
</div>`,
    css: `:scope .testimonial-card {
  max-width: 700px;
  margin: 2rem auto;
  padding: 2.5rem;
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
  border-radius: 1rem;
  border-left: 4px solid {{brand.primaryColor}};
  position: relative;
}
:scope .testimonial-quote-mark {
  position: absolute;
  top: 1rem;
  left: 1.5rem;
  font-size: 4rem;
  color: {{brand.primaryColor}};
  opacity: 0.2;
  font-family: Georgia, serif;
  line-height: 1;
}
:scope .testimonial-quote {
  font-size: 1.125rem;
  line-height: 1.8;
  color: #374151;
  font-style: italic;
  margin-bottom: 1.5rem;
  position: relative;
  z-index: 1;
}
:scope .testimonial-author {
  text-align: right;
}
:scope .testimonial-name {
  font-weight: 700;
  color: #111827;
  font-size: 1.125rem;
}
:scope .testimonial-role {
  color: #6b7280;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}`,
  },
  {
    id: "review-card",
    name: "Review Card",
    category: "testimonials",
    description: "Customer review with star rating",
    variables: ["reviewerName", "reviewText", "rating"],
    html: `<div class="review-card">
  <div class="review-stars">\u2B50\u2B50\u2B50\u2B50\u2B50</div>
  <p class="review-text">{{reviewText}}</p>
  <div class="review-author">\u2014 {{reviewerName}}</div>
</div>`,
    css: `:scope .review-card {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 1rem;
  border: 2px solid #f3f4f6;
  transition: border-color 0.3s;
}
:scope .review-card:hover {
  border-color: {{brand.primaryColor}};
}
:scope .review-stars {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #fbbf24;
}
:scope .review-text {
  font-size: 1.125rem;
  color: #374151;
  line-height: 1.8;
  margin-bottom: 1rem;
  font-style: italic;
}
:scope .review-author {
  color: {{brand.primaryColor}};
  font-weight: 700;
  font-size: 1rem;
  text-align: right;
}`,
  },
];
