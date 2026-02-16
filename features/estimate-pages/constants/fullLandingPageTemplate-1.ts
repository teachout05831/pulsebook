/**
 * Full Landing Page Template — Part 1: Image helpers + About Us section HTML/CSS.
 */

// Unsplash stock photos — users replace with their own uploads
const u = (id: string, w: number, h: number) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;

export const IMG = {
  kitchen1: u("photo-1556909114-f6e7ad7d3136", 800, 600),
  kitchen2: u("photo-1600585154340-be6161a56a0c", 800, 600),
  kitchen3: u("photo-1600210492486-724fe5c67fb0", 800, 600),
  kitchen4: u("photo-1552321554-5fefe8c9ef14", 800, 600),
  kitchen5: u("photo-1484154218962-a197022b5858", 800, 600),
  kitchen6: u("photo-1615529328331-f8917597711f", 800, 600),
  before:   u("photo-1534430480872-3498386e7856", 800, 600),
  after:    u("photo-1600585154340-be6161a56a0c", 800, 600),
};

// ─── About Us Section (two-column with stats + certs) ────────────
export const aboutHtml = `<div class="flp-about">
  <div class="flp-about-inner">
    <p class="flp-label">Why Choose Us</p>
    <h2 class="flp-heading">Built on Trust, Delivered with Craft</h2>
    <div class="flp-about-grid">
      <div class="flp-about-text">
        <p>For over fifteen years, we've transformed kitchens, bathrooms, and living spaces across the greater metro area. We believe every home tells a story, and every renovation should write a beautiful new chapter.</p>
        <p>Our team of certified designers and master craftsmen bring an obsessive attention to detail to every project. From the first design consultation to the final walkthrough, you'll have a dedicated project manager ensuring everything stays on track, on budget, and beyond your expectations.</p>
        <p>We don't cut corners. We don't surprise you with hidden costs. And we always leave your home cleaner than we found it.</p>
      </div>
      <div>
        <div class="flp-stats-grid">
          <div class="flp-stat-card">
            <div class="flp-stat-num">347<span class="flp-accent">+</span></div>
            <div class="flp-stat-lbl">Google Reviews</div>
          </div>
          <div class="flp-stat-card">
            <div class="flp-stat-num">15</div>
            <div class="flp-stat-lbl">Years Experience</div>
          </div>
          <div class="flp-stat-card">
            <div class="flp-stat-num">500<span class="flp-accent">+</span></div>
            <div class="flp-stat-lbl">Projects Completed</div>
          </div>
          <div class="flp-stat-card">
            <div class="flp-stat-num">98<span class="flp-accent">%</span></div>
            <div class="flp-stat-lbl">Customer Satisfaction</div>
          </div>
        </div>
      </div>
    </div>
    <div class="flp-certs-row">
      <div class="flp-cert"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>EPA Certified</div>
      <div class="flp-cert"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>NARI Member</div>
      <div class="flp-cert"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>Bonded &amp; Insured</div>
      <div class="flp-cert"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>Lead-Safe Certified</div>
    </div>
  </div>
</div>`;

export const aboutCss = `:scope .flp-about { padding: 5rem 1.5rem; background: #ffffff; }
:scope .flp-about-inner { max-width: 1200px; margin: 0 auto; }
:scope .flp-label { text-align: center; font-size: 0.75rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--primary-color, #2563eb); margin-bottom: 0.75rem; }
:scope .flp-heading { text-align: center; font-size: clamp(1.75rem, 4vw, 2.5rem); font-weight: 700; color: #0f172a; margin: 0 0 3rem; }
:scope .flp-about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; }
@media (max-width: 768px) { :scope .flp-about-grid { grid-template-columns: 1fr; gap: 2.5rem; } }
:scope .flp-about-text p { font-size: 1.05rem; color: #475569; line-height: 1.8; margin-bottom: 1rem; }
:scope .flp-stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
@media (max-width: 480px) { :scope .flp-stats-grid { gap: 0.75rem; } }
:scope .flp-stat-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 1rem; padding: 1.75rem 1.5rem; text-align: center; transition: all 0.3s; }
:scope .flp-stat-card:hover { border-color: var(--primary-color, #2563eb); box-shadow: 0 4px 20px rgba(37,99,235,0.08); transform: translateY(-2px); }
:scope .flp-stat-num { font-size: 2.5rem; font-weight: 700; color: #0f172a; line-height: 1; margin-bottom: 0.375rem; }
:scope .flp-accent { color: var(--primary-color, #2563eb); }
:scope .flp-stat-lbl { font-size: 0.85rem; color: #64748b; font-weight: 500; }
:scope .flp-certs-row { display: flex; gap: 1rem; margin-top: 3rem; flex-wrap: wrap; justify-content: center; }
:scope .flp-cert { display: flex; align-items: center; gap: 0.5rem; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 100px; padding: 0.625rem 1.25rem; font-size: 0.8rem; font-weight: 600; color: #15803d; white-space: nowrap; }
:scope .flp-cert svg { width: 1rem; height: 1rem; }`;
