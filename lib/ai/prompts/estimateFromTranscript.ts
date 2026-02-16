interface PromptContext {
  transcript: string;
  services: Array<{ id: string; name: string; defaultPrice: number; category: string }>;
  materials: Array<{ id: string; name: string; unitPrice: number; unitLabel: string }>;
  customerName: string | null;
  customerAddress: string | null;
  defaultPricingModel: string;
}

export function buildEstimatePrompt(ctx: PromptContext): string {
  const serviceList = ctx.services.length > 0
    ? ctx.services.map(s => `- ${s.name} ($${s.defaultPrice}, category: ${s.category}, id: ${s.id})`).join('\n')
    : '(No services in catalog)';

  const materialList = ctx.materials.length > 0
    ? ctx.materials.map(m => `- ${m.name} ($${m.unitPrice}/${m.unitLabel}, id: ${m.id})`).join('\n')
    : '(No materials in catalog)';

  return `You are an AI assistant for a home services company. Analyze a consultation call transcript and generate a structured estimate.

## Company Catalog

### Services:
${serviceList}

### Materials:
${materialList}

## Customer Info
- Name: ${ctx.customerName || 'Unknown'}
- Address: ${ctx.customerAddress || 'Unknown'}
- Default Pricing Model: ${ctx.defaultPricingModel}

## Transcript
${ctx.transcript}

## Instructions
1. Identify all services discussed in the call
2. Match services to catalog items when possible (include catalogItemId)
3. Estimate quantities and pricing based on discussion
4. Generate customer-facing notes summarizing the work
5. Generate internal notes for the estimator
6. Classify the service type

## Output Format
Return ONLY valid JSON (no markdown, no explanation):
{
  "lineItems": [
    {
      "description": "string",
      "quantity": number,
      "unitPrice": number,
      "category": "primary_service" | "additional_service" | "materials" | "trip_fee",
      "catalogItemId": "uuid or null",
      "isTaxable": boolean,
      "unitLabel": "string or null"
    }
  ],
  "resources": {
    "trucks": number,
    "teamSize": number,
    "estimatedHours": number,
    "hourlyRate": number
  },
  "pricingModel": "flat" | "hourly" | "per_service",
  "customerNotes": "string - customer-facing summary of work discussed",
  "internalNotes": "string - estimator notes about the call",
  "serviceType": "string - classification of work type"
}`;
}
