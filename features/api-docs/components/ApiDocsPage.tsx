import { Section, Code, CodeBlock, ParamTable } from "./ApiDocsHelpers"
import { ApiDocsEndpoints } from "./ApiDocsEndpoints"
import { ApiDocsExamples } from "./ApiDocsExamples"

export function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-3">Pulsebook API</h1>
          <p className="text-lg text-gray-600">
            Connect AI agents, automations, and external tools to your Pulsebook account.
          </p>
          <div className="mt-4 flex gap-3">
            <a href="/api/openapi.json" target="_blank" className="inline-flex items-center px-4 py-2 bg-slate-900 text-white rounded-md text-sm font-medium hover:bg-slate-800">
              OpenAPI Spec (JSON)
            </a>
            <a href="/settings/api-keys" className="inline-flex items-center px-4 py-2 border border-slate-300 rounded-md text-sm font-medium hover:bg-slate-50">
              Manage API Keys
            </a>
          </div>
        </div>

        <Section title="Quick Start">
          <p className="text-gray-600 mb-4">
            1. Go to <strong>Settings &rarr; API Keys</strong> and create an API key.<br />
            2. Include your key in requests as a Bearer token or X-API-Key header.<br />
            3. All endpoints are at <Code>/api/v1/</Code> and return JSON.
          </p>
          <CodeBlock title="Example: List your customers">{`curl -H "Authorization: Bearer sb_live_your_key_here" \\
  https://your-domain.com/api/v1/customers`}</CodeBlock>
        </Section>

        <Section title="Authentication">
          <p className="text-gray-600 mb-4">Every request requires an API key. Send it in one of two ways:</p>
          <CodeBlock title="Option 1: Authorization header">{`Authorization: Bearer sb_live_abc123...`}</CodeBlock>
          <CodeBlock title="Option 2: X-API-Key header">{`X-API-Key: sb_live_abc123...`}</CodeBlock>
          <p className="text-gray-600 mt-4">Invalid or missing keys return <Code>401 Unauthorized</Code>.</p>
        </Section>

        <Section title="Response Format">
          <p className="text-gray-600 mb-4">All responses are JSON with consistent structure:</p>
          <CodeBlock title="List response">{`{
  "data": [{ "id": "...", "name": "..." }, ...],
  "pagination": { "page": 1, "limit": 20, "total": 42 }
}`}</CodeBlock>
          <CodeBlock title="Single item response">{`{
  "data": { "id": "...", "name": "..." }
}`}</CodeBlock>
          <CodeBlock title="Error response">{`{
  "error": "Description of what went wrong"
}`}</CodeBlock>
        </Section>

        <Section title="Pagination & Filtering">
          <p className="text-gray-600 mb-4">List endpoints support these query parameters:</p>
          <ParamTable params={[
            { name: "page", type: "number", desc: "Page number (default: 1)" },
            { name: "limit", type: "number", desc: "Items per page (default: 20, max: 100)" },
            { name: "sort", type: "string", desc: "Sort field, e.g. createdAt, updatedAt" },
            { name: "order", type: "string", desc: "Sort direction: asc or desc (default: desc)" },
            { name: "q", type: "string", desc: "Search term (searches name, email, etc.)" },
            { name: "status", type: "string", desc: "Filter by status" },
          ]} />
        </Section>

        <ApiDocsEndpoints />
        <ApiDocsExamples />

        <Section title="Error Codes">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 pr-4">Status</th>
                  <th className="text-left py-2">Meaning</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b"><td className="py-2 pr-4 font-mono">400</td><td>Bad request -- invalid input or missing required fields</td></tr>
                <tr className="border-b"><td className="py-2 pr-4 font-mono">401</td><td>Unauthorized -- invalid or missing API key</td></tr>
                <tr className="border-b"><td className="py-2 pr-4 font-mono">404</td><td>Not found -- resource doesn&apos;t exist or belongs to another company</td></tr>
                <tr><td className="py-2 pr-4 font-mono">500</td><td>Server error -- something went wrong on our end</td></tr>
              </tbody>
            </table>
          </div>
        </Section>

        <div className="mt-16 pt-8 border-t text-center text-gray-400 text-sm">
          Pulsebook API v1
        </div>
      </div>
    </div>
  )
}
