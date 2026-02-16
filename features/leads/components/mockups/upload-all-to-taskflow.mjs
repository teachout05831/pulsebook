import { readFileSync, readdirSync, statSync } from 'fs';
import { join, basename } from 'path';

const API_KEY = '0381c110-3b81-4d19-8f25-7e74c5d3e9bc';
const BASE_URL = 'https://task-system-nine.vercel.app/api/v1/resources';

const mockups = [
  // Estimate Page Designs
  { file: 'estimate/index.html', name: 'Estimate - Design Gallery', desc: 'Gallery page for all estimate template designs' },
  { file: 'estimate/template-1-classic.html', name: 'Estimate - Classic Three-Column', desc: 'Desktop three-column layout matching reference design (Quote Info | Jobs/Stops/Notes | Pricing)' },
  { file: 'estimate/template-2-mobile.html', name: 'Estimate - Mobile-First Cards', desc: 'Mobile-optimized card stack layout for on-site estimating' },
  { file: 'estimate/template-3-universal.html', name: 'Estimate - Universal Service', desc: 'Template for non-moving services (HVAC, plumbing, cleaning) with custom fields and job history' },
  { file: 'estimate/template-4-quick-quote.html', name: 'Estimate - Quick Quote', desc: 'Minimal single-screen view for high-volume fast quoting' },
  { file: 'estimate/template-5-customer-preview.html', name: 'Estimate - Customer Preview', desc: 'Shareable customer-facing estimate with e-signature approval' },
  { file: 'estimate/template-6-payment-panel.html', name: 'Estimate - Payment Panel', desc: 'Slide-out payment recording panel with history and balance tracking' },

  // My Leads Page
  { file: 'my-leads/my-leads-mockup.html', name: 'My Leads - Dashboard', desc: 'Enhanced leads management interface with pipeline view' },

  // Follow-ups Page
  { file: 'follow-ups/follow-ups-mockup.html', name: 'Follow-ups - Dashboard', desc: 'Follow-up task management with reminders and tracking' },

  // Sales Goals Page
  { file: 'sales-goals/sales-goals-preview.html', name: 'Sales Goals - Preview', desc: 'Sales goals dashboard with targets and performance tracking' },

  // Sales Lead Detail Page Designs
  { file: 'sales-lead-detail-page/sales-designs-index.html', name: 'Sales Lead Detail - Design Gallery', desc: 'Gallery page for all sales lead detail concepts' },
  { file: 'sales-lead-detail-page/sales-concept-a.html', name: 'Sales Lead Detail - Concept A', desc: 'Sales lead detail page design concept A' },
  { file: 'sales-lead-detail-page/sales-concept-b.html', name: 'Sales Lead Detail - Concept B', desc: 'Sales lead detail page design concept B' },
  { file: 'sales-lead-detail-page/sales-concept-c.html', name: 'Sales Lead Detail - Concept C', desc: 'Sales lead detail page design concept C' },
  { file: 'sales-lead-detail-page/sales-concept-d.html', name: 'Sales Lead Detail - Concept D', desc: 'Sales lead detail page design concept D' },
  { file: 'sales-lead-detail-page/sales-concept-e.html', name: 'Sales Lead Detail - Concept E', desc: 'Sales lead detail page design concept E' },

  // Mobile Dispatch Designs
  { file: 'mobile-dispatch/index.html', name: 'Mobile Dispatch - Index', desc: 'Navigation hub for all mobile dispatch mockups' },
  { file: 'mobile-dispatch/job-cards.html', name: 'Mobile Dispatch - Job Cards', desc: 'Swipeable job cards with priority badges and quick actions' },
  { file: 'mobile-dispatch/technician-view.html', name: 'Mobile Dispatch - Technician View', desc: 'Team overview with expandable job lists per technician' },
  { file: 'mobile-dispatch/job-detail.html', name: 'Mobile Dispatch - Job Detail', desc: 'Full job details with status tracker, addresses, and crew' },
  { file: 'mobile-dispatch/inventory.html', name: 'Mobile Dispatch - Inventory', desc: 'Room-by-room checklist with progress tracking' },
  { file: 'mobile-dispatch/complete-job.html', name: 'Mobile Dispatch - Complete Job', desc: 'Signature capture, time summary, and tip entry' },
  { file: 'mobile-dispatch/prototype.html', name: 'Mobile Dispatch - Interactive Prototype', desc: 'All screens combined with clickable navigation' },
  { file: 'mobile-dispatch/mobile-dispatch-home.html', name: 'Mobile Dispatch - Home Screen', desc: 'Mobile dispatch home screen design' },
  { file: 'mobile-dispatch/mobile-map-toggle.html', name: 'Mobile Dispatch - Map Toggle', desc: 'Map view with toggle for dispatch' },
  { file: 'mobile-dispatch/mobile-timeline.html', name: 'Mobile Dispatch - Timeline', desc: 'Timeline view for mobile dispatch scheduling' },
  { file: 'mobile-dispatch/mobile-list-view.html', name: 'Mobile Dispatch - List View', desc: 'List view for mobile dispatch jobs' },
];

let success = 0;
let failed = 0;

console.log(`\nUploading ${mockups.length} mockups to TaskFlow...\n`);

for (const mockup of mockups) {
  process.stdout.write(`  ${mockup.name}... `);

  try {
    const content = readFileSync(mockup.file, 'utf-8');

    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: mockup.name,
        description: mockup.desc,
        type: 'html',
        content: content,
      }),
    });

    const result = await response.json();

    if (result.success || response.ok) {
      console.log(`OK (${result.data?.id || 'uploaded'})`);
      success++;
    } else {
      console.log(`FAILED: ${result.error || response.statusText}`);
      failed++;
    }
  } catch (err) {
    console.log(`ERROR: ${err.message}`);
    failed++;
  }
}

console.log(`\n--- DONE ---`);
console.log(`  Uploaded: ${success}`);
console.log(`  Failed:   ${failed}`);
console.log(`  Total:    ${mockups.length}\n`);
