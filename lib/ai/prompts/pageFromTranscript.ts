interface PagePromptContext {
  transcript: string;
  templateSections: Array<{ type: string; content: Record<string, unknown> }>;
  customerName: string | null;
  serviceType: string | null;
  companyName: string | null;
}

// Section types that AI should populate with call-specific content
const AI_FILLABLE_TYPES = ['hero', 'scope', 'pricing', 'timeline', 'faq', 'content_block'];

export function getAIFillableSections(sections: Array<{ type: string }>): string[] {
  return sections.filter(s => AI_FILLABLE_TYPES.includes(s.type)).map(s => s.type);
}

export function buildPagePrompt(ctx: PagePromptContext): string {
  const sectionTypes = getAIFillableSections(ctx.templateSections);

  if (sectionTypes.length === 0) {
    return '';
  }

  const sectionInstructions = sectionTypes.map(type => {
    switch (type) {
      case 'hero':
        return `"hero": { "title": "string - compelling headline for this estimate", "subtitle": "string - brief tagline" }`;
      case 'scope':
        return `"scope": { "title": "Scope of Work", "narrative": "string - detailed narrative description of all work discussed on the call" }`;
      case 'pricing':
        return `"pricing": { "title": "Your Investment", "packages": [{ "name": "string", "price": number, "features": ["string"], "tierLabel": "string", "recommended": boolean }] }`;
      case 'timeline':
        return `"timeline": { "title": "What Happens Next", "items": [{ "title": "string - step name", "description": "string - step details" }] }`;
      case 'faq':
        return `"faq": { "title": "Frequently Asked Questions", "items": [{ "question": "string", "answer": "string" }] }`;
      case 'content_block':
        return `"content_block": { "columns": 2, "gap": "md", "cells": [{ "id": "uuid", "type": "text", "content": { "text": "string - relevant content from discussion" } }] }`;
      default:
        return '';
    }
  }).filter(Boolean).join(',\n    ');

  return `You are an AI assistant populating an estimate page template with content from a consultation call.

## Context
- Customer: ${ctx.customerName || 'Unknown'}
- Service Type: ${ctx.serviceType || 'Home Services'}
- Company: ${ctx.companyName || 'Our Company'}

## Transcript
${ctx.transcript}

## Instructions
Generate content ONLY for these section types present in the template: ${sectionTypes.join(', ')}
- Hero: Write a compelling, professional headline and subtitle specific to this project
- Scope: Write a detailed narrative of all work discussed, written to the customer
- Timeline: Extract next steps or project phases from the call
- FAQ: Generate Q&A pairs from questions the customer asked during the call
- Content Block: Generate relevant supporting content
- Keep tone professional and customer-friendly

## Output Format
Return ONLY valid JSON:
{
    ${sectionInstructions}
}`;
}
