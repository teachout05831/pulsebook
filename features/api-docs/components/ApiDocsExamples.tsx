import { Section, CodeBlock } from "./ApiDocsHelpers"

export function ApiDocsExamples() {
  return (
    <Section title="Code Examples">
      <CodeBlock title="JavaScript (fetch)">{`const response = await fetch("https://your-domain.com/api/v1/customers", {
  headers: { "Authorization": "Bearer sb_live_your_key_here" }
});
const { data, pagination } = await response.json();
console.log(\`Found \${pagination.total} customers\`);`}</CodeBlock>

      <CodeBlock title="JavaScript - Create a job">{`const response = await fetch("https://your-domain.com/api/v1/jobs", {
  method: "POST",
  headers: {
    "Authorization": "Bearer sb_live_your_key_here",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    title: "Deep Clean - Kitchen",
    customerId: "customer-uuid-here",
    scheduledDate: "2025-03-15",
    scheduledTime: "09:00",
    status: "scheduled"
  })
});
const { data } = await response.json();
console.log("Created job:", data.id);`}</CodeBlock>

      <CodeBlock title="Python (requests)">{`import requests

headers = {"Authorization": "Bearer sb_live_your_key_here"}

# List customers
resp = requests.get("https://your-domain.com/api/v1/customers", headers=headers)
customers = resp.json()["data"]

# Create an estimate
resp = requests.post("https://your-domain.com/api/v1/estimates", headers=headers, json={
    "customerId": customers[0]["id"],
    "lineItems": [{"description": "Cleaning service", "quantity": 1, "rate": 150, "total": 150}],
    "taxRate": 8
})
print("Estimate:", resp.json()["data"]["estimateNumber"])`}</CodeBlock>

      <CodeBlock title="curl">{`# List jobs for today
curl -H "Authorization: Bearer sb_live_your_key_here" \\
  "https://your-domain.com/api/v1/jobs?status=scheduled&sort=scheduledDate&order=asc"

# Update customer status
curl -X PATCH -H "Authorization: Bearer sb_live_your_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{"status": "active", "leadStatus": "won"}' \\
  "https://your-domain.com/api/v1/customers/{id}"`}</CodeBlock>
    </Section>
  )
}
