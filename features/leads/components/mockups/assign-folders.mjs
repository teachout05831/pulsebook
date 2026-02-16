const API_KEY = '0381c110-3b81-4d19-8f25-7e74c5d3e9bc';
const BASE_URL = 'https://task-system-nine.vercel.app/api/v1/resources';
const FOLDER_ID = '28b30d24-6514-4961-896e-10c31fdf8dec'; // Schedule Software

// Fetch all resources
const res = await fetch(BASE_URL, {
  headers: { 'Authorization': `Bearer ${API_KEY}` }
});
const { data: resources } = await res.json();

const unassigned = resources.filter(r => !r.folder_id);
console.log(`\nFound ${unassigned.length} resources without a folder. Assigning to "Schedule Software"...\n`);

let success = 0;
for (const r of unassigned) {
  const update = await fetch(`${BASE_URL}/${r.id}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ folder_id: FOLDER_ID })
  });
  const result = await update.json();
  if (result.success) {
    console.log(`  OK  ${r.name}`);
    success++;
  } else {
    console.log(`  FAIL  ${r.name}: ${result.error}`);
  }
}

console.log(`\nDone! Assigned ${success}/${unassigned.length} resources to Schedule Software folder.\n`);
