/**
 * Full Landing Page Template — Part 3: Hero section HTML/CSS.
 */

// ─── Hero Section (gradient with logo, badge, accent title) ──────
export const heroHtml = `<div class="lph-hero">
  <div class="lph-hero-content">
    <div class="lph-logo">
      <div class="lph-logo-icon">A</div>
      <span class="lph-logo-text">Your Company Name</span>
    </div>
    <div class="lph-badge">
      <span class="lph-badge-dot"></span>
      Estimate Ready for Review
    </div>
    <h1 class="lph-title">Your <span class="lph-accent">Project</span> Estimate</h1>
    <p class="lph-subtitle">Prepared for {{customer.name}}</p>
    <p class="lph-address">Customer Address</p>
    <div class="lph-meta">
      <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>Estimate #{{estimate.number}}</span>
      <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>Valid until March 15, 2026</span>
    </div>
  </div>
  <div class="lph-scroll">
    Scroll to explore
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 13l5 5 5-5M7 6l5 5 5-5"/></svg>
  </div>
</div>`;

export const heroCss = `:scope .lph-hero { position: relative; min-height: 100vh; display: flex; align-items: center; justify-content: center; text-align: center; background: linear-gradient(135deg, #0f172a 0%, var(--primary-color, #1e3a8a) 50%, #1d4ed8 100%); overflow: hidden; padding: 5rem 1.5rem 7.5rem; }
:scope .lph-hero::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse 80% 60% at 20% 80%, rgba(59,130,246,0.15) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 20%, rgba(99,102,241,0.1) 0%, transparent 60%); }
:scope .lph-hero::after { content: ''; position: absolute; inset: 0; background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"); opacity: 0.5; }
:scope .lph-hero-content { position: relative; z-index: 2; max-width: 800px; }
:scope .lph-logo { display: inline-flex; align-items: center; gap: 0.75rem; margin-bottom: 2.5rem; }
:scope .lph-logo-icon { width: 3.25rem; height: 3.25rem; background: linear-gradient(135deg, #f59e0b, #d97706); border-radius: 0.75rem; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; color: #fff; font-weight: 800; box-shadow: 0 4px 20px rgba(245,158,11,0.3); }
:scope .lph-logo-text { font-size: 1.4rem; font-weight: 700; color: #ffffff; letter-spacing: -0.02em; }
:scope .lph-badge { display: inline-flex; align-items: center; gap: 0.5rem; background: rgba(255,255,255,0.1); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.15); border-radius: 100px; padding: 0.5rem 1.25rem; font-size: 0.85rem; color: rgba(255,255,255,0.8); margin-bottom: 2rem; }
:scope .lph-badge-dot { width: 0.5rem; height: 0.5rem; border-radius: 50%; background: #34d399; animation: lph-pulse 2s infinite; }
@keyframes lph-pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
:scope .lph-title { font-size: clamp(2.2rem, 5.5vw, 3.75rem); font-weight: 700; color: #ffffff; margin: 0 0 1.25rem; letter-spacing: -0.03em; line-height: 1.1; }
:scope .lph-accent { color: #fbbf24; }
:scope .lph-subtitle { font-size: clamp(1.05rem, 2vw, 1.3rem); color: rgba(255,255,255,0.75); margin: 0 0 0.25rem; font-weight: 400; }
:scope .lph-address { font-size: 0.95rem; color: rgba(255,255,255,0.5); margin: 0; }
:scope .lph-meta { display: flex; gap: 1.5rem; justify-content: center; flex-wrap: wrap; font-size: 0.9rem; color: rgba(255,255,255,0.5); margin-top: 1.5rem; }
:scope .lph-meta span { display: flex; align-items: center; gap: 0.375rem; }
:scope .lph-meta svg { width: 1rem; height: 1rem; opacity: 0.6; }
:scope .lph-scroll { position: absolute; bottom: 2.5rem; left: 50%; transform: translateX(-50%); z-index: 2; display: flex; flex-direction: column; align-items: center; gap: 0.5rem; color: rgba(255,255,255,0.4); font-size: 0.75rem; letter-spacing: 0.1em; text-transform: uppercase; animation: lph-float 3s ease-in-out infinite; }
@keyframes lph-float { 0%,100% { transform: translateX(-50%) translateY(0); } 50% { transform: translateX(-50%) translateY(8px); } }
:scope .lph-scroll svg { width: 1.25rem; height: 1.25rem; }
@media (max-width: 768px) { :scope .lph-hero { padding: 3.75rem 1.25rem 5rem; min-height: 100svh; } :scope .lph-title { font-size: 2rem; } :scope .lph-meta { flex-direction: column; gap: 0.5rem; } }`;
