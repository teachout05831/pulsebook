const API_KEY = '0381c110-3b81-4d19-8f25-7e74c5d3e9bc';
const WHITEBOARD_ID = 'cb98c681-d5c7-4ee6-80aa-01aa20e1a345';

const resources = [
  { id: '802a8c00-32e1-49f1-bc07-5068e89d3110', name: 'Mobile Dispatch - Index' },
  { id: '0c8db700-2046-42ed-b062-1d489519b556', name: 'Mobile Dispatch - Job Cards' },
  { id: 'c58513e5-88cf-41a8-a637-3f6f465711a0', name: 'Mobile Dispatch - Technician View' },
  { id: '7c6c0716-9c99-4140-97e7-2114b483c778', name: 'Mobile Dispatch - Job Detail' },
  { id: 'a4556c96-ec83-4dd2-a7c2-12a0640ecde0', name: 'Mobile Dispatch - Inventory' },
  { id: '5f155832-9dfc-4c08-9e72-45267b103fdd', name: 'Mobile Dispatch - Complete Job' },
  { id: '25895724-c170-4a40-b2ac-52e04733fe7f', name: 'Mobile Dispatch - Interactive Prototype' },
];

// Layout: 3 columns, decent size cards (not too big, not too small)
const CARD_WIDTH = 380;
const CARD_HEIGHT = 280;
const GAP = 30;
const START_X = 50;
const START_Y = 50;

// Build canvas_data with resource items
const items = resources.map((resource, i) => {
  const col = i % 3;
  const row = Math.floor(i / 3);
  return {
    id: `item-${i}`,
    type: 'resource',
    resource_id: resource.id,
    name: resource.name,
    x: START_X + col * (CARD_WIDTH + GAP),
    y: START_Y + row * (CARD_HEIGHT + GAP),
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
  };
});

const canvasData = {
  version: 1,
  items: items,
};

console.log('Updating whiteboard with canvas data...');
console.log(JSON.stringify(canvasData, null, 2));

const response = await fetch(`https://task-system-nine.vercel.app/api/v1/whiteboards/${WHITEBOARD_ID}`, {
  method: 'PATCH',
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    canvas_data: canvasData,
  }),
});

const text = await response.text();
console.log(`\nStatus: ${response.status}`);
console.log(`Response: ${text || '(empty)'}`);
