/**
 * Executive Template — Part 1: Hero + Scope/Trust HTML/CSS.
 */

// Shared CSS variables scoped to .ex- prefix classes
const VARS = `--ex-primary: #1e3a5f; --ex-primary-light: #2a5080; --ex-primary-dark: #142842; --ex-accent: #e8913a; --ex-accent-hover: #d4801f; --ex-success: #22c55e; --ex-success-dark: #16a34a; --ex-success-bg: #f0fdf4; --ex-text: #1a1a2e; --ex-text-sec: #4a5568; --ex-text-muted: #718096; --ex-bg: #f7f8fc; --ex-border: #e2e8f0; --ex-radius: 12px; --ex-shadow: 0 4px 14px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04);`;

// ─── Hero Section ──────────────────────────────────────────────
export const heroHtml = `<div class="ex-hero" style="${VARS}">
  <div class="ex-hero-inner">
    <div class="ex-badge"><span class="ex-dot"></span><span>Estimate #{{estimate.number}} &middot; Active</span></div>
    <p class="ex-greeting">Prepared exclusively for</p>
    <h1 class="ex-title">{{customer.name}}</h1>
    <p class="ex-subtitle">Thank you for choosing our team. Below is your customized estimate, carefully prepared to address your specific needs.</p>
    <div class="ex-meta">
      <div class="ex-meta-item">
        <div class="ex-meta-icon"><svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg></div>
        <div><div class="ex-meta-label">Date Prepared</div><div class="ex-meta-value">Today's Date</div></div>
      </div>
      <div class="ex-meta-item">
        <div class="ex-meta-icon"><svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg></div>
        <div><div class="ex-meta-label">Service Address</div><div class="ex-meta-value">Customer Address</div></div>
      </div>
      <div class="ex-meta-item">
        <div class="ex-meta-icon"><svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg></div>
        <div><div class="ex-meta-label">Your Specialist</div><div class="ex-meta-value">Assigned Technician</div></div>
      </div>
    </div>
  </div>
</div>`;

export const heroCss = `:scope .ex-hero { background: linear-gradient(170deg, #1e3a5f 0%, #2a5080 40%, #3a6b9f 100%); padding: 60px 24px 80px; position: relative; overflow: hidden; }
:scope .ex-hero::before { content: ''; position: absolute; top: -50%; right: -20%; width: 600px; height: 600px; background: radial-gradient(circle, rgba(232,145,58,0.08) 0%, transparent 70%); border-radius: 50%; }
:scope .ex-hero-inner { max-width: 1200px; margin: 0 auto; position: relative; z-index: 2; }
:scope .ex-badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.15); padding: 8px 16px; border-radius: 50px; margin-bottom: 24px; }
:scope .ex-dot { width: 8px; height: 8px; background: #22c55e; border-radius: 50%; animation: ex-pulse 2s infinite; }
@keyframes ex-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.3); } }
:scope .ex-badge span { color: rgba(255,255,255,0.9); font-size: 0.82rem; font-weight: 500; }
:scope .ex-greeting { color: rgba(255,255,255,0.7); font-size: 1rem; margin-bottom: 8px; }
:scope .ex-title { font-size: clamp(1.8rem, 4vw, 2.8rem); font-weight: 800; color: #fff; margin: 0 0 12px; letter-spacing: -0.02em; }
:scope .ex-subtitle { color: rgba(255,255,255,0.65); font-size: 1.05rem; max-width: 600px; margin: 0; }
:scope .ex-meta { display: flex; flex-wrap: wrap; gap: 28px; margin-top: 32px; }
:scope .ex-meta-item { display: flex; align-items: center; gap: 10px; }
:scope .ex-meta-icon { width: 40px; height: 40px; background: rgba(255,255,255,0.1); border-radius: 8px; display: flex; align-items: center; justify-content: center; }
:scope .ex-meta-icon svg { width: 18px; height: 18px; stroke: #e8913a; }
:scope .ex-meta-label { font-size: 0.72rem; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 0.06em; font-weight: 500; }
:scope .ex-meta-value { font-size: 0.95rem; color: #fff; font-weight: 600; }
@media (max-width: 768px) { :scope .ex-hero { padding: 40px 20px 60px; } :scope .ex-meta { gap: 20px; } }
@media (max-width: 480px) { :scope .ex-title { font-size: 1.5rem; } :scope .ex-meta-item { flex: 1 1 100%; } }`;

// ─── Scope + Trust Two-Column Section ──────────────────────────
export const scopeTrustHtml = `<div class="ex-scope" style="${VARS}">
  <div class="ex-scope-inner">
    <div class="ex-two-col">
      <div class="ex-card">
        <div class="ex-card-header">
          <div class="ex-card-icon"><svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg></div>
          <h3>Project Details</h3>
        </div>
        <div class="ex-card-body">
          <div class="ex-detail-grid">
            <div class="ex-detail"><span class="ex-dl">Project Type</span><span class="ex-dv">Full Service Package</span></div>
            <div class="ex-detail"><span class="ex-dl">Current Status</span><span class="ex-dv">Assessment Complete</span></div>
            <div class="ex-detail"><span class="ex-dl">Property Size</span><span class="ex-dv">Standard Residential</span></div>
            <div class="ex-detail"><span class="ex-dl">Est. Timeline</span><span class="ex-dv">1-2 Day Project</span></div>
          </div>
          <div class="ex-scope-work">
            <span class="ex-dl">Scope of Work</span>
            <ul class="ex-scope-list">
              <li><span class="ex-check"><svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg></span>Complete assessment and documentation of current conditions</li>
              <li><span class="ex-check"><svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg></span>Professional installation of recommended solution</li>
              <li><span class="ex-check"><svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg></span>Full system testing and quality verification</li>
              <li><span class="ex-check"><svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg></span>Site cleanup and debris removal</li>
              <li><span class="ex-check"><svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg></span>Final walkthrough and homeowner education</li>
            </ul>
          </div>
        </div>
      </div>
      <div class="ex-trust-col">
        <div class="ex-trust-card">
          <h4><svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg> Why Customers Trust Us</h4>
          <div class="ex-stat-grid">
            <div class="ex-stat"><div class="ex-stat-num">4.9</div><div class="ex-stat-lbl">Google Rating</div></div>
            <div class="ex-stat"><div class="ex-stat-num">2,400+</div><div class="ex-stat-lbl">Projects Done</div></div>
            <div class="ex-stat"><div class="ex-stat-num">18</div><div class="ex-stat-lbl">Years Experience</div></div>
            <div class="ex-stat"><div class="ex-stat-num">98%</div><div class="ex-stat-lbl">Satisfaction Rate</div></div>
          </div>
        </div>
        <div class="ex-trust-card">
          <h4><svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg> Certifications</h4>
          <div class="ex-badge-row">
            <span class="ex-badge-item"><svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>Licensed & Insured</span>
            <span class="ex-badge-item"><svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>Industry Certified</span>
            <span class="ex-badge-item"><svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>BBB A+ Rated</span>
            <span class="ex-badge-item"><svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>Background Checked</span>
          </div>
        </div>
        <div class="ex-guarantee">
          <div class="ex-guarantee-icon"><svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg></div>
          <h4>100% Satisfaction Guarantee</h4>
          <p>If you're not completely satisfied, we'll make it right at no additional cost. That's our promise.</p>
        </div>
      </div>
    </div>
  </div>
</div>`;
