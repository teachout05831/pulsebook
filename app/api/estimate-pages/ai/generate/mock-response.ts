export function buildMockResponse(mode: string, input: string) {
  const baseId = () => crypto.randomUUID();

  if (mode === "prompt") {
    return {
      sections: [
        {
          id: baseId(), type: "hero", order: 1, visible: true,
          settings: { variant: "clean" },
          content: {
            headline: "Your Project Estimate",
            subheadline: "A tailored proposal based on your requirements",
          },
        },
        {
          id: baseId(), type: "scope", order: 2, visible: true,
          settings: { variant: "checklist" },
          content: {
            title: "Scope of Work",
            items: [
              { label: "Initial consultation and assessment", included: true },
              { label: "Project planning and timeline", included: true },
              { label: "Implementation and execution", included: true },
              { label: "Quality assurance and review", included: true },
              { label: "Final walkthrough and handoff", included: true },
            ],
          },
        },
        {
          id: baseId(), type: "pricing", order: 3, visible: true,
          settings: { variant: "detailed" },
          content: {
            title: "Investment",
            useEstimateLineItems: true,
            note: "Pricing details will be populated from the linked estimate.",
          },
        },
        {
          id: baseId(), type: "timeline", order: 4, visible: true,
          settings: { variant: "steps" },
          content: {
            title: "Project Timeline",
            steps: [
              { label: "Planning Phase", duration: "1 week" },
              { label: "Execution Phase", duration: "2-3 weeks" },
              { label: "Review & Completion", duration: "1 week" },
            ],
          },
        },
        {
          id: baseId(), type: "approval", order: 5, visible: true,
          settings: {}, content: {},
        },
        {
          id: baseId(), type: "contact", order: 6, visible: true,
          settings: {}, content: {},
        },
      ],
      designTheme: { colorScheme: "blue", style: "modern", variant: "clean" },
      summary: `Generated a 6-section estimate page based on your description (${input.length} characters). Replace with AI-generated content when the API integration is complete.`,
    };
  }

  return {
    sections: [
      {
        id: baseId(), type: "hero", order: 1, visible: true,
        settings: { variant: "clean" },
        content: {
          headline: "Your Custom Proposal",
          subheadline: "Based on our recent conversation",
        },
      },
      {
        id: baseId(), type: "scope", order: 2, visible: true,
        settings: { variant: "checklist" },
        content: {
          title: "What We Discussed",
          items: [
            { label: "Item extracted from transcript", included: true },
            { label: "Second item from discussion", included: true },
            { label: "Additional scope item mentioned", included: true },
          ],
        },
      },
      {
        id: baseId(), type: "pricing", order: 3, visible: true,
        settings: { variant: "detailed" },
        content: {
          title: "Proposed Investment",
          useEstimateLineItems: true,
          note: "Based on the services discussed during our call.",
        },
      },
      {
        id: baseId(), type: "faq", order: 4, visible: true,
        settings: {},
        content: {
          title: "Questions You Raised",
          items: [
            { question: "Question from the call?", answer: "Answer based on discussion." },
          ],
        },
      },
      {
        id: baseId(), type: "approval", order: 5, visible: true,
        settings: {}, content: {},
      },
      {
        id: baseId(), type: "contact", order: 6, visible: true,
        settings: {}, content: {},
      },
    ],
    designTheme: { colorScheme: "blue", style: "modern", variant: "clean" },
    summary: `Analyzed transcript (${input.length} characters). Extracted scope items, pricing discussion points, and customer questions. Replace with AI-generated content when the API integration is complete.`,
  };
}
