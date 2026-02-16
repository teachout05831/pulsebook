/**
 * Utility functions for HTML block editing
 */

export function getFieldLabel(varName: string): string {
  return varName
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

export function isLongText(varName: string): boolean {
  const longTextKeywords = ['description', 'text', 'answer', 'subtext', 'narrative', 'content'];
  return longTextKeywords.some((keyword) => varName.toLowerCase().includes(keyword));
}

export function replaceVariables(template: string, values: Record<string, string>): string {
  return template.replace(/\{\{(\s*[\w.]+\s*)\}\}/g, (_, key: string) => {
    const k = key.trim();
    return k in values ? values[k] : `{{${k}}}`;
  });
}

export function regenerateBlockHtml(
  blockHtml: string,
  blockCss: string,
  values: Record<string, string>
): { html: string; css: string } {
  return {
    html: replaceVariables(blockHtml, values),
    css: replaceVariables(blockCss, values),
  };
}
