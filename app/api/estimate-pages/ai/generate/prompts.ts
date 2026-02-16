export function buildPromptModeSystemPrompt(
  brandContext: Record<string, unknown> | null,
  rateCardContext: Array<{ name: string; items: unknown[] }>
): string {
  let prompt = `You are an expert estimate page builder for service-based businesses.
Given the user's description of a project, generate a complete estimate page with sections.

Return a JSON object with:
- sections: An array of page sections, each with { id, type, order, visible, settings, content }
  - Section types: "hero", "scope", "pricing", "timeline", "gallery", "testimonials", "faq", "terms", "approval", "contact", "video", "calendar"
  - Each section should have appropriate content filled in based on the user's description
- designTheme: An object with { colorScheme, style, variant } suggesting a visual theme
- summary: A brief 1-2 sentence summary of what was generated`;

  if (brandContext) {
    prompt += `\n\nCompany Context:`;
    if (brandContext.companyDescription) {
      prompt += `\n- Description: ${brandContext.companyDescription}`;
    }
    if (brandContext.tagline) {
      prompt += `\n- Tagline: ${brandContext.tagline}`;
    }
    if (brandContext.tone) {
      prompt += `\n- Preferred tone: ${brandContext.tone}`;
    }
    if (brandContext.defaultTerms) {
      prompt += `\n- Default terms: ${brandContext.defaultTerms}`;
    }
  }

  if (rateCardContext.length > 0) {
    prompt += `\n\nAvailable Rate Cards (use for pricing suggestions):`;
    for (const rc of rateCardContext) {
      prompt += `\n- ${rc.name}: ${JSON.stringify(rc.items)}`;
    }
  }

  return prompt;
}

export function buildTranscriptModeSystemPrompt(
  brandContext: Record<string, unknown> | null,
  rateCardContext: Array<{ name: string; items: unknown[] }>
): string {
  let prompt = `You are an expert at analyzing sales call transcripts for service-based businesses.
Given a transcript of a discovery or review call, extract structured information to build an estimate page.

Return a JSON object with:
- sections: An array of page sections derived from the conversation, each with { id, type, order, visible, settings, content }
  - Focus on extracting: scope items discussed, pricing mentioned, customer concerns, timeline expectations
  - Section types: "hero", "scope", "pricing", "timeline", "gallery", "testimonials", "faq", "terms", "approval", "contact"
- designTheme: An object with { colorScheme, style, variant } suggesting a visual theme appropriate to the project
- summary: A brief summary of key points from the call`;

  if (brandContext) {
    prompt += `\n\nCompany Context:`;
    if (brandContext.companyDescription) {
      prompt += `\n- Description: ${brandContext.companyDescription}`;
    }
    if (brandContext.tone) {
      prompt += `\n- Preferred tone: ${brandContext.tone}`;
    }
  }

  if (rateCardContext.length > 0) {
    prompt += `\n\nAvailable Rate Cards (match discussed services to these):`;
    for (const rc of rateCardContext) {
      prompt += `\n- ${rc.name}: ${JSON.stringify(rc.items)}`;
    }
  }

  return prompt;
}
