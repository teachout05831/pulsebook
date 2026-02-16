const API_KEY = '0381c110-3b81-4d19-8f25-7e74c5d3e9bc';
const FOLDER_ID = 'a00a22ee-34a7-417b-87a7-f5030fff6f5f'; // Mobile Dispatch folder

const resources = [
  '802a8c00-32e1-49f1-bc07-5068e89d3110',
  '0c8db700-2046-42ed-b062-1d489519b556',
  'c58513e5-88cf-41a8-a637-3f6f465711a0',
  '7c6c0716-9c99-4140-97e7-2114b483c778',
  'a4556c96-ec83-4dd2-a7c2-12a0640ecde0',
  '5f155832-9dfc-4c08-9e72-45267b103fdd',
  '25895724-c170-4a40-b2ac-52e04733fe7f',
];

for (const id of resources) {
  console.log(`Moving ${id.slice(0,8)}...`);

  const response = await fetch(`https://task-system-nine.vercel.app/api/v1/resources/${id}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      folder_id: FOLDER_ID,
    }),
  });

  const text = await response.text();
  console.log(`  ${response.status}: ${text}`);
}

console.log('\nDone!');
