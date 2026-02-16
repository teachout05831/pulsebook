import type { HtmlBlock } from "./types";

export const FOOTER_BLOCKS: HtmlBlock[] = [
  {
    id: "landing-page-footer",
    name: "Landing Page Footer",
    category: "footer",
    description:
      "Rich dark footer with company logo, description, social icons, contact info, business hours, license numbers, and powered-by line",
    variables: [
      "companyInitial",
      "companyName",
      "description",
      "address1",
      "address2",
      "phone",
      "email",
      "hoursWeekday",
      "hoursSaturday",
      "hoursSunday",
      "license",
      "bond",
      "year",
    ],
    html: `<footer class="lpf-footer">
  <div class="lpf-inner">
    <div class="lpf-grid">
      <div class="lpf-brand">
        <div class="lpf-logo">
          <div class="lpf-logo-icon">{{companyInitial}}</div>
          <span class="lpf-logo-text">{{companyName}}</span>
        </div>
        <p class="lpf-desc">{{description}}</p>
        <div class="lpf-social">
          <a href="#" aria-label="Facebook"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg></a>
          <a href="#" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg></a>
          <a href="#" aria-label="YouTube"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg></a>
        </div>
      </div>
      <div>
        <div class="lpf-heading">Contact</div>
        <ul class="lpf-list">
          <li>{{address1}}</li>
          <li>{{address2}}</li>
          <li><a href="tel:{{phone}}">{{phone}}</a></li>
          <li><a href="mailto:{{email}}">{{email}}</a></li>
        </ul>
      </div>
      <div>
        <div class="lpf-heading">Business Hours</div>
        <ul class="lpf-list">
          <li>{{hoursWeekday}}</li>
          <li>{{hoursSaturday}}</li>
          <li>{{hoursSunday}}</li>
          <li class="lpf-license">{{license}}</li>
          <li class="lpf-license">{{bond}}</li>
        </ul>
      </div>
    </div>
    <div class="lpf-bottom">
      <span>&copy; {{year}} {{companyName}}. All rights reserved.</span>
      <div class="lpf-powered">Powered by <strong>ServicePro</strong></div>
    </div>
  </div>
</footer>`,
    css: `:scope .lpf-footer {
  background: #0f172a;
  color: rgba(255,255,255,0.6);
  padding: 4rem 1.5rem 2rem;
}
:scope .lpf-inner { max-width: 1200px; margin: 0 auto; }
:scope .lpf-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 3rem;
  margin-bottom: 3rem;
}
@media (max-width: 1024px) { :scope .lpf-grid { grid-template-columns: 1fr; } }
:scope .lpf-logo {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}
:scope .lpf-logo-icon {
  width: 3.25rem; height: 3.25rem;
  background: linear-gradient(135deg, #f59e0b, #d97706);
  border-radius: 0.75rem;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.5rem; color: #fff; font-weight: 800;
  box-shadow: 0 4px 20px rgba(245,158,11,0.3);
}
:scope .lpf-logo-text {
  font-size: 1.4rem;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: -0.02em;
}
:scope .lpf-desc {
  font-size: 0.9rem;
  line-height: 1.7;
  margin-bottom: 1.25rem;
}
:scope .lpf-social { display: flex; gap: 0.75rem; }
:scope .lpf-social a {
  width: 2.5rem; height: 2.5rem;
  border-radius: 0.625rem;
  background: rgba(255,255,255,0.08);
  display: flex; align-items: center; justify-content: center;
  transition: background 0.2s;
}
:scope .lpf-social a:hover { background: rgba(255,255,255,0.15); }
:scope .lpf-social a svg { width: 1.125rem; height: 1.125rem; color: rgba(255,255,255,0.6); }
:scope .lpf-heading {
  font-size: 0.85rem;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 1rem;
}
:scope .lpf-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.625rem; }
:scope .lpf-list li { font-size: 0.88rem; }
:scope .lpf-list li a { color: rgba(255,255,255,0.6); text-decoration: none; transition: color 0.2s; }
:scope .lpf-list li a:hover { color: #ffffff; }
:scope .lpf-license { margin-top: 0.75rem; font-size: 0.8rem !important; color: rgba(255,255,255,0.35) !important; }
:scope .lpf-bottom {
  border-top: 1px solid rgba(255,255,255,0.08);
  padding-top: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.75rem;
  font-size: 0.8rem;
}
:scope .lpf-powered {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  color: rgba(255,255,255,0.35);
}
:scope .lpf-powered strong { color: rgba(255,255,255,0.6); }
@media (max-width: 768px) {
  :scope .lpf-bottom { flex-direction: column; text-align: center; }
}`,
  },
];
