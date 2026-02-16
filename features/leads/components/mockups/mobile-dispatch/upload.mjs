import { readFileSync } from 'fs';

const API_KEY = '0381c110-3b81-4d19-8f25-7e74c5d3e9bc';
const BASE_URL = 'https://task-system-nine.vercel.app/api/v1/resources';

const mockups = [
  { file: 'index.html', name: 'Mobile Dispatch - Index', desc: 'Navigation hub for all mobile dispatch mockups' },
  { file: 'job-cards.html', name: 'Mobile Dispatch - Job Cards', desc: 'Swipeable job cards with priority badges and quick actions' },
  { file: 'technician-view.html', name: 'Mobile Dispatch - Technician View', desc: 'Team overview with expandable job lists per technician' },
  { file: 'job-detail.html', name: 'Mobile Dispatch - Job Detail', desc: 'Full job details with status tracker, addresses, and crew' },
  { file: 'inventory.html', name: 'Mobile Dispatch - Inventory', desc: 'Room-by-room checklist with progress tracking' },
  { file: 'complete-job.html', name: 'Mobile Dispatch - Complete Job', desc: 'Signature capture, time summary, and tip entry' },
  { file: 'prototype.html', name: 'Mobile Dispatch - Interactive Prototype', desc: 'All screens combined with clickable navigation' },
];

for (const mockup of mockups) {
  console.log(`Uploading ${mockup.file}...`);

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

  if (result.success) {
    console.log(`  ✓ SUCCESS: ${result.data.id}`);
  } else {
    console.log(`  ✗ FAILED: ${result.error}`);
  }
}

console.log('\nAll uploads complete!');
