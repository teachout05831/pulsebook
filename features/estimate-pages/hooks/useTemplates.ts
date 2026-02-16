'use client';

import { useState, useEffect, useCallback } from 'react';
import type { PageTemplate } from '../types';

type ActionResult = { success: true } | { error: string };

async function mutate(url: string, method: string, body?: unknown): Promise<ActionResult> {
  try {
    const res = await fetch(url, {
      method,
      ...(body ? { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) } : {}),
    });
    if (!res.ok) {
      const json = await res.json();
      return { error: json.error || 'Request failed' };
    }
    return { success: true };
  } catch {
    return { error: 'Request failed' };
  }
}

export function useTemplates() {
  const [templates, setTemplates] = useState<PageTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTemplates = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/estimate-pages/templates');
      if (!res.ok) throw new Error('Failed to fetch');
      const json = await res.json();
      setTemplates(json.data || []);
    } catch {
      setError('Failed to load templates');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createTemplate = useCallback(async (input: {
    name: string;
    description?: string;
    category?: string;
    layout?: string;
    sections: unknown[];
    designTheme?: Record<string, unknown>;
  }): Promise<ActionResult> => {
    const result = await mutate('/api/estimate-pages/templates', 'POST', input);
    if ('success' in result) await fetchTemplates();
    return result;
  }, [fetchTemplates]);

  const updateTemplate = useCallback(async (
    id: string,
    input: Partial<Omit<PageTemplate, 'id' | 'companyId' | 'createdAt' | 'updatedAt' | 'isSystem'>>,
  ): Promise<ActionResult> => {
    const result = await mutate(`/api/estimate-pages/templates/${id}`, 'PATCH', input);
    if ('success' in result) await fetchTemplates();
    return result;
  }, [fetchTemplates]);

  const duplicateTemplate = useCallback(async (id: string): Promise<ActionResult> => {
    const source = templates.find((t) => t.id === id);
    if (!source) return { error: 'Template not found' };
    return createTemplate({
      name: `${source.name} (Copy)`,
      description: source.description || undefined,
      category: source.category || undefined,
      layout: source.layout,
      sections: source.sections,
      designTheme: source.designTheme as Record<string, unknown>,
    });
  }, [templates, createTemplate]);

  const deleteTemplate = useCallback(async (id: string): Promise<ActionResult> => {
    const result = await mutate(`/api/estimate-pages/templates/${id}`, 'DELETE');
    if ('success' in result) await fetchTemplates();
    return result;
  }, [fetchTemplates]);

  useEffect(() => { fetchTemplates(); }, [fetchTemplates]);

  return {
    templates, isLoading, error,
    fetchTemplates, createTemplate, updateTemplate, duplicateTemplate, deleteTemplate,
  };
}
