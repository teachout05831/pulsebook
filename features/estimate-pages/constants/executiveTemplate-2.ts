/**
 * Executive Template — Part 2: Scope/Trust CSS + CTA HTML/CSS.
 */

// Shared CSS variables scoped to .ex- prefix classes
const VARS = `--ex-primary: #1e3a5f; --ex-primary-light: #2a5080; --ex-primary-dark: #142842; --ex-accent: #e8913a; --ex-accent-hover: #d4801f; --ex-success: #22c55e; --ex-success-dark: #16a34a; --ex-success-bg: #f0fdf4; --ex-text: #1a1a2e; --ex-text-sec: #4a5568; --ex-text-muted: #718096; --ex-bg: #f7f8fc; --ex-border: #e2e8f0; --ex-radius: 12px; --ex-shadow: 0 4px 14px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04);`;

export const scopeTrustCss = `:scope .ex-scope { background: var(--ex-bg, #f7f8fc); padding: 0 24px 48px; }
:scope .ex-scope-inner { max-width: 1200px; margin: -40px auto 0; position: relative; z-index: 10; }
:scope .ex-two-col { display: grid; grid-template-columns: 1fr 380px; gap: 32px; }
@media (max-width: 1024px) { :scope .ex-two-col { grid-template-columns: 1fr; } }
:scope .ex-card { background: #fff; border-radius: 16px; box-shadow: 0 4px 14px rgba(0,0,0,0.08); border: 1px solid #f1f5f9; overflow: hidden; }
:scope .ex-card-header { padding: 24px 28px 20px; border-bottom: 1px solid #e2e8f0; display: flex; align-items: center; gap: 12px; }
:scope .ex-card-icon { width: 36px; height: 36px; background: linear-gradient(135deg, #1e3a5f, #2a5080); border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
:scope .ex-card-icon svg { width: 18px; height: 18px; stroke: white; }
:scope .ex-card-header h3 { font-size: 1.05rem; font-weight: 700; color: #1a1a2e; margin: 0; }
:scope .ex-card-body { padding: 24px 28px; }
:scope .ex-detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px; }
@media (max-width: 768px) { :scope .ex-detail-grid { grid-template-columns: 1fr; } }
:scope .ex-detail { display: flex; flex-direction: column; gap: 4px; }
:scope .ex-dl { font-size: 0.75rem; color: #718096; text-transform: uppercase; letter-spacing: 0.06em; font-weight: 600; }
:scope .ex-dv { font-size: 0.95rem; color: #1a1a2e; font-weight: 500; }
:scope .ex-scope-work { border-top: 1px solid #e2e8f0; padding-top: 20px; }
:scope .ex-scope-list { list-style: none; padding: 0; margin: 12px 0 0; display: flex; flex-direction: column; gap: 10px; }
:scope .ex-scope-list li { display: flex; align-items: flex-start; gap: 10px; font-size: 0.9rem; color: #4a5568; line-height: 1.5; }
:scope .ex-check { width: 20px; height: 20px; background: #f0fdf4; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px; }
:scope .ex-check svg { width: 12px; height: 12px; stroke: #16a34a; }
:scope .ex-trust-col { display: flex; flex-direction: column; gap: 20px; }
@media (max-width: 1024px) { :scope .ex-trust-col { display: grid; grid-template-columns: 1fr 1fr; } }
@media (max-width: 768px) { :scope .ex-trust-col { grid-template-columns: 1fr; } }
:scope .ex-trust-card { background: #fff; border-radius: 16px; box-shadow: 0 4px 14px rgba(0,0,0,0.08); padding: 24px; border: 1px solid #f1f5f9; }
:scope .ex-trust-card h4 { font-size: 0.95rem; font-weight: 700; color: #1a1a2e; margin: 0 0 16px; display: flex; align-items: center; gap: 8px; }
:scope .ex-stat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
:scope .ex-stat { text-align: center; padding: 16px 8px; background: #f7f8fc; border-radius: 12px; }
:scope .ex-stat-num { font-size: 1.5rem; font-weight: 800; color: #1e3a5f; line-height: 1; }
:scope .ex-stat-lbl { font-size: 0.72rem; color: #718096; margin-top: 4px; font-weight: 500; }
:scope .ex-badge-row { display: flex; flex-wrap: wrap; gap: 8px; }
:scope .ex-badge-item { display: inline-flex; align-items: center; gap: 6px; padding: 8px 12px; background: #f7f8fc; border-radius: 50px; font-size: 0.78rem; color: #4a5568; font-weight: 500; }
:scope .ex-badge-item svg { width: 14px; height: 14px; stroke: #1e3a5f; }
:scope .ex-guarantee { background: linear-gradient(135deg, #1e3a5f, #2a5080); border-radius: 12px; padding: 24px; text-align: center; color: #fff; }
:scope .ex-guarantee-icon { width: 48px; height: 48px; background: rgba(255,255,255,0.15); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 12px; }
:scope .ex-guarantee-icon svg { width: 24px; height: 24px; stroke: #e8913a; }
:scope .ex-guarantee h4 { color: #fff; font-size: 1rem; font-weight: 700; margin: 0 0 8px; }
:scope .ex-guarantee p { font-size: 0.82rem; color: rgba(255,255,255,0.75); line-height: 1.5; margin: 0; }`;

// ─── Questions CTA Banner ──────────────────────────────────────
export const ctaHtml = `<div class="ex-cta" style="${VARS}">
  <div class="ex-cta-inner">
    <div class="ex-cta-left">
      <h2>Have Questions About This Estimate?</h2>
      <p>Our team is ready to walk through every detail with you.</p>
    </div>
    <div class="ex-cta-right">
      <button class="ex-cta-btn ex-primary">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
        Call Us Now
      </button>
      <button class="ex-cta-btn ex-outline">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
        Schedule a Call
      </button>
    </div>
  </div>
</div>`;

export const ctaCss = `:scope .ex-cta { padding: 0 24px; margin-bottom: 48px; }
:scope .ex-cta-inner { max-width: 1200px; margin: 0 auto; background: linear-gradient(135deg, #1e3a5f 0%, #2a5080 60%, #3a6b9f 100%); border-radius: 20px; padding: 48px; display: flex; align-items: center; justify-content: space-between; gap: 40px; overflow: hidden; position: relative; }
:scope .ex-cta-inner::before { content: ''; position: absolute; top: -40%; right: -10%; width: 300px; height: 300px; background: radial-gradient(circle, rgba(232,145,58,0.12) 0%, transparent 70%); border-radius: 50%; }
:scope .ex-cta-left { position: relative; z-index: 2; }
:scope .ex-cta-left h2 { font-size: 1.7rem; font-weight: 800; color: #fff; margin: 0 0 8px; }
:scope .ex-cta-left p { color: rgba(255,255,255,0.7); font-size: 1rem; margin: 0; }
:scope .ex-cta-right { display: flex; gap: 16px; flex-shrink: 0; position: relative; z-index: 2; }
:scope .ex-cta-btn { padding: 14px 28px; border-radius: 12px; font-size: 0.92rem; font-weight: 700; cursor: pointer; transition: all 0.3s; display: flex; align-items: center; gap: 10px; border: 2px solid transparent; white-space: nowrap; }
:scope .ex-cta-btn svg { width: 18px; height: 18px; }
:scope .ex-primary { background: #e8913a; color: #fff; border-color: #e8913a; }
:scope .ex-primary:hover { background: #d4801f; transform: translateY(-2px); box-shadow: 0 8px 20px rgba(232,145,58,0.3); }
:scope .ex-outline { background: transparent; color: #fff; border-color: rgba(255,255,255,0.3); }
:scope .ex-outline:hover { border-color: #fff; background: rgba(255,255,255,0.08); transform: translateY(-2px); }
@media (max-width: 1024px) { :scope .ex-cta-inner { flex-direction: column; text-align: center; } :scope .ex-cta-right { flex-direction: column; width: 100%; max-width: 320px; } :scope .ex-cta-btn { justify-content: center; } }
@media (max-width: 768px) { :scope .ex-cta-inner { padding: 32px 24px; } }`;
