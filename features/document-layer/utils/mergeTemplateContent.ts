import type { AIPageContent } from '../types';

interface Section {
  id: string;
  type: string;
  order: number;
  visible: boolean;
  settings: Record<string, unknown>;
  content: Record<string, unknown>;
}

// Merge AI-generated content into template sections
// AI content overwrites matching section types; static sections stay as-is
export function mergeTemplateContent(
  templateSections: Section[],
  aiContent: AIPageContent,
): Section[] {
  return templateSections.map(section => {
    const aiSectionContent = aiContent[section.type];

    if (!aiSectionContent) {
      return section;
    }

    return {
      ...section,
      content: {
        ...section.content,
        ...aiSectionContent,
      },
      settings: {
        ...section.settings,
        aiGenerated: true,
      },
    };
  });
}
