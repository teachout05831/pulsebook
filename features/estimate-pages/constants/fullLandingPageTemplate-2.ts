/**
 * Full Landing Page Template — Part 2: Scope of Work section HTML/CSS.
 */

// ─── Scope of Work (5 phase cards) ───────────────────────────────
export const scopeHtml = `<div class="flp-scope">
  <div class="flp-scope-inner">
    <p class="flp-label">The Plan</p>
    <h2 class="flp-heading">Your Project Transformation</h2>
    <p class="flp-subheading">Every detail planned, every phase executed with precision. Here's how we'll bring your vision to life.</p>
    <div class="flp-phases">
      <div class="flp-phase">
        <div class="flp-phase-head">
          <div class="flp-phase-icon p1"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg></div>
          <div><div class="flp-phase-num">Phase 1</div><div class="flp-phase-title">Design &amp; Planning</div></div>
        </div>
        <ul class="flp-phase-list">
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>Layout and design renderings</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>Material and finish selections</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>Permit acquisition</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>Detailed project timeline</li>
        </ul>
      </div>
      <div class="flp-phase">
        <div class="flp-phase-head">
          <div class="flp-phase-icon p2"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg></div>
          <div><div class="flp-phase-num">Phase 2</div><div class="flp-phase-title">Demolition &amp; Prep</div></div>
        </div>
        <ul class="flp-phase-list">
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>Existing removal and teardown</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>Subfloor and structure inspection</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>Debris removal and site protection</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>Temporary setup assistance</li>
        </ul>
      </div>
      <div class="flp-phase">
        <div class="flp-phase-head">
          <div class="flp-phase-icon p3"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg></div>
          <div><div class="flp-phase-num">Phase 3</div><div class="flp-phase-title">Electrical &amp; Plumbing</div></div>
        </div>
        <ul class="flp-phase-list">
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>Electrical panel and wiring updates</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>New outlet and switch placements</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>Plumbing rough-in and connections</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>Gas line work (if applicable)</li>
        </ul>
      </div>
      <div class="flp-phase">
        <div class="flp-phase-head">
          <div class="flp-phase-icon p4"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg></div>
          <div><div class="flp-phase-num">Phase 4</div><div class="flp-phase-title">Cabinets &amp; Countertops</div></div>
        </div>
        <ul class="flp-phase-list">
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>Cabinet installation and leveling</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>Countertop fabrication and install</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>Sink and faucet installation</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>Hardware and soft-close mechanisms</li>
        </ul>
      </div>
      <div class="flp-phase">
        <div class="flp-phase-head">
          <div class="flp-phase-icon p5"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></div>
          <div><div class="flp-phase-num">Phase 5</div><div class="flp-phase-title">Finishing Touches</div></div>
        </div>
        <ul class="flp-phase-list">
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>Backsplash and tile installation</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>Lighting fixture installation</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>Appliance delivery and hookup</li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>Final inspection and walkthrough</li>
        </ul>
      </div>
    </div>
    <div class="flp-timeline-badge">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
      Estimated Duration: 4-6 Weeks
    </div>
  </div>
</div>`;

export const scopeCss = `:scope .flp-scope { padding: 5rem 1.5rem; background: #f8fafc; }
:scope .flp-scope-inner { max-width: 1200px; margin: 0 auto; }
:scope .flp-label { text-align: center; font-size: 0.75rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--primary-color, #2563eb); margin-bottom: 0.75rem; }
:scope .flp-heading { text-align: center; font-size: clamp(1.75rem, 4vw, 2.5rem); font-weight: 700; color: #0f172a; margin: 0 0 1rem; }
:scope .flp-subheading { text-align: center; font-size: 1.1rem; color: #64748b; max-width: 640px; margin: 0 auto 3rem; }
:scope .flp-phases { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin-bottom: 3rem; }
@media (max-width: 768px) { :scope .flp-phases { grid-template-columns: 1fr; } }
:scope .flp-phase { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 1rem; padding: 2rem; position: relative; overflow: hidden; transition: all 0.3s; }
:scope .flp-phase::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; }
:scope .flp-phase:nth-child(1)::before { background: linear-gradient(90deg, #3b82f6, #60a5fa); }
:scope .flp-phase:nth-child(2)::before { background: linear-gradient(90deg, #f59e0b, #fbbf24); }
:scope .flp-phase:nth-child(3)::before { background: linear-gradient(90deg, #10b981, #34d399); }
:scope .flp-phase:nth-child(4)::before { background: linear-gradient(90deg, #8b5cf6, #a78bfa); }
:scope .flp-phase:nth-child(5)::before { background: linear-gradient(90deg, #ec4899, #f472b6); }
:scope .flp-phase:hover { border-color: transparent; box-shadow: 0 10px 40px rgba(0,0,0,0.08); transform: translateY(-4px); }
:scope .flp-phase-head { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.25rem; }
:scope .flp-phase-icon { width: 3rem; height: 3rem; border-radius: 0.75rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
:scope .flp-phase-icon svg { width: 1.5rem; height: 1.5rem; }
:scope .flp-phase-icon.p1 { background: #eff6ff; color: #2563eb; }
:scope .flp-phase-icon.p2 { background: #fffbeb; color: #d97706; }
:scope .flp-phase-icon.p3 { background: #ecfdf5; color: #059669; }
:scope .flp-phase-icon.p4 { background: #f5f3ff; color: #7c3aed; }
:scope .flp-phase-icon.p5 { background: #fdf2f8; color: #db2777; }
:scope .flp-phase-num { font-size: 0.7rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #94a3b8; }
:scope .flp-phase-title { font-size: 1.1rem; font-weight: 700; color: #0f172a; }
:scope .flp-phase-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.625rem; }
:scope .flp-phase-list li { display: flex; align-items: flex-start; gap: 0.625rem; font-size: 0.92rem; color: #475569; line-height: 1.5; }
:scope .flp-phase-list li svg { width: 1.125rem; height: 1.125rem; flex-shrink: 0; margin-top: 0.125rem; color: #22c55e; }
:scope .flp-timeline-badge { display: flex; align-items: center; gap: 0.75rem; justify-content: center; background: #ffffff; border: 2px solid var(--primary-color, #2563eb); border-radius: 100px; padding: 1rem 2rem; font-size: 1rem; font-weight: 600; color: #1e40af; width: fit-content; margin: 0 auto; }
:scope .flp-timeline-badge svg { width: 1.375rem; height: 1.375rem; }`;
