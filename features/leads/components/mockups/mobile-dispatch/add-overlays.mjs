const API_KEY = '0381c110-3b81-4d19-8f25-7e74c5d3e9bc';
const WHITEBOARD_ID = 'cb98c681-d5c7-4ee6-80aa-01aa20e1a345';
const PAGE_ID = 'e4e006d0-c065-4647-8243-2860bc9015d1';

const resources = [
  { id: '802a8c00-32e1-49f1-bc07-5068e89d3110', name: 'Index' },
  { id: '0c8db700-2046-42ed-b062-1d489519b556', name: 'Job Cards' },
  { id: 'c58513e5-88cf-41a8-a637-3f6f465711a0', name: 'Technician View' },
  { id: '7c6c0716-9c99-4140-97e7-2114b483c778', name: 'Job Detail' },
  { id: 'a4556c96-ec83-4dd2-a7c2-12a0640ecde0', name: 'Inventory' },
  { id: '5f155832-9dfc-4c08-9e72-45267b103fdd', name: 'Complete Job' },
  { id: '25895724-c170-4a40-b2ac-52e04733fe7f', name: 'Interactive Prototype' },
];

// Layout: 3 columns, decent size (not too big, not too small)
const CARD_WIDTH = 400;
const CARD_HEIGHT = 300;
const GAP = 40;
const START_X = 50;
const START_Y = 50;

const BASE_URL = `https://task-system-nine.vercel.app/api/v1/whiteboards/${WHITEBOARD_ID}/pages/${PAGE_ID}/overlays`;

for (let i = 0; i < resources.length; i++) {
  const resource = resources[i];
  const col = i % 3;
  const row = Math.floor(i / 3);
  const x = START_X + col * (CARD_WIDTH + GAP);
  const y = START_Y + row * (CARD_HEIGHT + GAP);

  console.log(`Adding ${resource.name} at (${x}, ${y})...`);

  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      resourceId: resource.id,
      x: x,
      y: y,
      width: CARD_WIDTH,
      height: CARD_HEIGHT,
    }),
  });

  const result = await response.json();
  if (result.success) {
    console.log(`  ✓ Added: ${result.data.id}`);
  } else {
    console.log(`  ✗ Failed: ${result.error}`);
  }
}

console.log('\nAll overlays added!');
