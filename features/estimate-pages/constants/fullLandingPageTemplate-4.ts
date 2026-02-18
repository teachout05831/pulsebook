/**
 * Full Landing Page Template — Part 4: Video Call CTA + Footer HTML/CSS.
 */

// ─── Video Call CTA (dark gradient centered) ─────────────────────
export const videoCtaHtml = `<div class="vcd-cta">
  <div class="vcd-inner">
    <p class="vcd-label">Let's Connect</p>
    <h2 class="vcd-heading">Let's Walk Through The Design Together</h2>
    <p class="vcd-subtitle">Schedule a 20-minute video call to discuss your plans, ask questions, and refine the estimate.</p>
    <div class="vcd-buttons">
      <a href="#" class="vcd-btn vcd-primary">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
        Schedule a Video Call
      </a>
      <a href="#" class="vcd-btn vcd-secondary">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>
        Call Us Now
      </a>
    </div>
    <p class="vcd-hint">Next available: Tomorrow at 10:00 AM</p>
  </div>
</div>`;

export const videoCtaCss = `:scope .vcd-cta { padding: 6rem 1.5rem; background: linear-gradient(135deg, #0f172a, #1e3a8a); position: relative; overflow: hidden; }
:scope .vcd-cta::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse 50% 80% at 80% 50%, rgba(59,130,246,0.15) 0%, transparent 60%); }
:scope .vcd-inner { position: relative; z-index: 2; max-width: 1200px; margin: 0 auto; text-align: center; }
:scope .vcd-label { font-size: 0.75rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #60a5fa; margin: 0 0 0.75rem; }
:scope .vcd-heading { font-size: clamp(1.75rem, 4vw, 2.5rem); font-weight: 700; color: #ffffff; margin: 0 0 1rem; }
:scope .vcd-subtitle { font-size: 1.1rem; color: rgba(255,255,255,0.65); max-width: 640px; margin: 0 auto 3rem; }
:scope .vcd-buttons { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; margin-bottom: 1rem; }
:scope .vcd-btn { display: inline-flex; align-items: center; gap: 0.625rem; padding: 1rem 2rem; font-size: 1rem; font-weight: 600; border-radius: 0.75rem; transition: all 0.2s; text-decoration: none; cursor: pointer; }
:scope .vcd-btn svg { width: 1.25rem; height: 1.25rem; }
:scope .vcd-primary { background: linear-gradient(135deg, #2563eb, #1d4ed8); color: #fff; box-shadow: 0 4px 15px rgba(37,99,235,0.3); }
:scope .vcd-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(37,99,235,0.4); }
:scope .vcd-secondary { background: transparent; color: #fff; border: 2px solid rgba(255,255,255,0.3); }
:scope .vcd-secondary:hover { border-color: rgba(255,255,255,0.6); background: rgba(255,255,255,0.05); }
:scope .vcd-hint { color: rgba(255,255,255,0.4); font-size: 0.85rem; margin: 0; }
@media (max-width: 768px) { :scope .vcd-buttons { flex-direction: column; align-items: stretch; max-width: 360px; margin-left: auto; margin-right: auto; } }`;

// ─── Footer (dark with logo, columns, social, license) ───────────
export const footerHtml = `<footer class="lpf-footer">
  <div class="lpf-inner">
    <div class="lpf-grid">
      <div class="lpf-brand">
        <div class="lpf-logo">
          <div class="lpf-logo-icon">A</div>
          <span class="lpf-logo-text">Your Company Name</span>
        </div>
        <p class="lpf-desc">Transforming homes across the greater metro area. Licensed, bonded, and fully insured. We don't just renovate spaces — we elevate the way you live.</p>
        <div class="lpf-social">
          <a href="#" aria-label="Facebook"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg></a>
          <a href="#" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg></a>
          <a href="#" aria-label="YouTube"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg></a>
        </div>
      </div>
      <div>
        <div class="lpf-heading">Contact</div>
        <ul class="lpf-list">
          <li>1247 Commerce Blvd, Suite 200</li>
          <li>Riverside, CA 92501</li>
          <li><a href="tel:+19515551234">(951) 555-1234</a></li>
          <li><a href="mailto:hello@yourcompany.com">hello@yourcompany.com</a></li>
        </ul>
      </div>
      <div>
        <div class="lpf-heading">Business Hours</div>
        <ul class="lpf-list">
          <li>Mon - Fri: 8:00 AM - 6:00 PM</li>
          <li>Saturday: 9:00 AM - 2:00 PM</li>
          <li>Sunday: Closed</li>
          <li class="lpf-license">License #CA-REN-2011-8834</li>
          <li class="lpf-license">Contractor Bond #SUR-447821</li>
        </ul>
      </div>
    </div>
    <div class="lpf-bottom">
      <span>&copy; 2026 Your Company Name. All rights reserved.</span>
      <div class="lpf-powered">Powered by <strong>Pulsebook</strong></div>
    </div>
  </div>
</footer>`;

export const footerCss = `:scope .lpf-footer { background: #0f172a; color: rgba(255,255,255,0.6); padding: 4rem 1.5rem 2rem; }
:scope .lpf-inner { max-width: 1200px; margin: 0 auto; }
:scope .lpf-grid { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 3rem; margin-bottom: 3rem; }
@media (max-width: 1024px) { :scope .lpf-grid { grid-template-columns: 1fr; } }
:scope .lpf-logo { display: inline-flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem; }
:scope .lpf-logo-icon { width: 3.25rem; height: 3.25rem; background: linear-gradient(135deg, #f59e0b, #d97706); border-radius: 0.75rem; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; color: #fff; font-weight: 800; box-shadow: 0 4px 20px rgba(245,158,11,0.3); }
:scope .lpf-logo-text { font-size: 1.4rem; font-weight: 700; color: #ffffff; letter-spacing: -0.02em; }
:scope .lpf-desc { font-size: 0.9rem; line-height: 1.7; margin-bottom: 1.25rem; }
:scope .lpf-social { display: flex; gap: 0.75rem; }
:scope .lpf-social a { width: 2.5rem; height: 2.5rem; border-radius: 0.625rem; background: rgba(255,255,255,0.08); display: flex; align-items: center; justify-content: center; transition: background 0.2s; }
:scope .lpf-social a:hover { background: rgba(255,255,255,0.15); }
:scope .lpf-social a svg { width: 1.125rem; height: 1.125rem; color: rgba(255,255,255,0.6); }
:scope .lpf-heading { font-size: 0.85rem; font-weight: 700; color: #ffffff; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 1rem; }
:scope .lpf-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.625rem; }
:scope .lpf-list li { font-size: 0.88rem; }
:scope .lpf-list li a { color: rgba(255,255,255,0.6); text-decoration: none; transition: color 0.2s; }
:scope .lpf-list li a:hover { color: #ffffff; }
:scope .lpf-license { margin-top: 0.75rem; font-size: 0.8rem !important; color: rgba(255,255,255,0.35) !important; }
:scope .lpf-bottom { border-top: 1px solid rgba(255,255,255,0.08); padding-top: 1.5rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem; font-size: 0.8rem; }
:scope .lpf-powered { display: flex; align-items: center; gap: 0.375rem; color: rgba(255,255,255,0.35); }
:scope .lpf-powered strong { color: rgba(255,255,255,0.6); }
@media (max-width: 768px) { :scope .lpf-bottom { flex-direction: column; text-align: center; } }`;
