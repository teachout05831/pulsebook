import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const API_KEY = '0381c110-3b81-4d19-8f25-7e74c5d3e9bc';
const BASE_URL = 'https://task-system-nine.vercel.app/api/v1';
const DASHBOARD_FOLDER_ID = '954d7f38-1b36-4b72-9762-d4aab6ef691f';

const mockups = [
  { file: 'index.html', name: 'Dashboard Redesign - Index', desc: 'Hub page with all 5 dashboard design concepts and comparison table' },
  { file: 'design-1-activity-feed.html', name: 'Dashboard - Design 1: Activity Feed', desc: 'Social media feed style dashboard with scrollable activity cards, sales leaders, and referral sources' },
  { file: 'design-2-pipeline-cards.html', name: 'Dashboard - Design 2: Pipeline & Cards', desc: 'CRM-forward kanban pipeline with customer cards flowing through sales stages' },
  { file: 'design-3-bento-grid.html', name: 'Dashboard - Design 3: Bento Grid', desc: 'Modern SaaS dashboard with iOS widget-like modular tiles' },
  { file: 'design-4-mobile-timeline.html', name: 'Dashboard - Design 4: Mobile Timeline', desc: 'Mobile-first vertical timeline of daily activity with inline customer cards' },
  { file: 'design-5-command-center.html', name: 'Dashboard - Design 5: Command Center', desc: 'Split-panel operations center with live activity left and metrics right' },
];

const uploadedIds = [];

// Step 1: Upload all resources
console.log(`\n=== Uploading ${mockups.length} dashboard mockups to TaskFlow ===\n`);

for (const mockup of mockups) {
  process.stdout.write(`  ${mockup.name}... `);

  try {
    const content = readFileSync(join(__dirname, mockup.file), 'utf-8');

    const response = await fetch(`${BASE_URL}/resources`, {
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
      const id = result.data?.id;
      console.log(`OK (${id})`);
      uploadedIds.push({ id, name: mockup.name });
    } else {
      console.log(`FAILED: ${result.error || response.statusText}`);
    }
  } catch (err) {
    console.log(`ERROR: ${err.message}`);
  }
}

console.log(`\nUploaded ${uploadedIds.length}/${mockups.length} resources.`);

// Step 2: Assign all to Dashboard folder
console.log(`\n=== Assigning resources to Dashboard folder ===\n`);

for (const resource of uploadedIds) {
  process.stdout.write(`  ${resource.name}... `);

  try {
    const response = await fetch(`${BASE_URL}/resources/${resource.id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ folder_id: DASHBOARD_FOLDER_ID }),
    });

    const result = await response.json();
    if (result.success || response.ok) {
      console.log('OK');
    } else {
      console.log(`FAILED: ${result.error || response.statusText}`);
    }
  } catch (err) {
    console.log(`ERROR: ${err.message}`);
  }
}

// Step 3: Create a pathway for the dashboard mockups
console.log(`\n=== Creating Dashboard Redesign pathway ===\n`);

try {
  const pathwayResponse = await fetch(`${BASE_URL}/pathways`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'Dashboard Redesign Review',
      description: 'Review all 5 dashboard design concepts — Activity Feed, Pipeline & Cards, Bento Grid, Mobile Timeline, and Command Center',
    }),
  });

  const pathwayResult = await pathwayResponse.json();

  if (pathwayResult.success || pathwayResponse.ok) {
    const pathwayId = pathwayResult.data?.id;
    console.log(`  Pathway created: ${pathwayId}`);

    // Step 4: Add each mockup as a step in the pathway
    console.log(`\n=== Adding mockups to pathway ===\n`);

    // Skip the index, only add the 5 designs as steps
    const designs = uploadedIds.filter(r => !r.name.includes('Index'));

    for (let i = 0; i < designs.length; i++) {
      const resource = designs[i];
      process.stdout.write(`  Step ${i + 1}: ${resource.name}... `);

      try {
        const stepResponse = await fetch(`${BASE_URL}/pathways/${pathwayId}/steps`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            resource_id: resource.id,
            order: i + 1,
            title: resource.name,
          }),
        });

        const stepResult = await stepResponse.json();
        if (stepResult.success || stepResponse.ok) {
          console.log('OK');
        } else {
          console.log(`FAILED: ${JSON.stringify(stepResult)}`);
        }
      } catch (err) {
        console.log(`ERROR: ${err.message}`);
      }
    }
  } else {
    console.log(`  FAILED: ${JSON.stringify(pathwayResult)}`);
  }
} catch (err) {
  console.log(`  ERROR: ${err.message}`);
}

// Summary
console.log(`\n=== SUMMARY ===`);
console.log(`  Resources uploaded: ${uploadedIds.length}`);
console.log(`  Folder: Dashboard (${DASHBOARD_FOLDER_ID})`);
console.log(`  Resource IDs:`);
for (const r of uploadedIds) {
  console.log(`    ${r.id} — ${r.name}`);
}
console.log(`\nDone!\n`);
