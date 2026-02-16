import type { SectionType } from "@/features/estimate-pages/types";

export interface UniversalBlock {
  id: string;
  companyId: string;
  name: string;
  description: string | null;
  category: string | null;
  sectionType: SectionType;
  settings: Record<string, unknown>;
  content: Record<string, unknown>;
  usageCount: number;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUniversalBlockInput {
  name: string;
  description?: string;
  category?: string;
  sectionType: SectionType;
  settings: Record<string, unknown>;
  content: Record<string, unknown>;
}

export interface UpdateUniversalBlockInput {
  name?: string;
  description?: string;
  category?: string;
  settings?: Record<string, unknown>;
  content?: Record<string, unknown>;
}

export const BLOCK_CATEGORIES = [
  "headers",
  "social-proof",
  "content",
  "media",
  "cta",
  "other",
] as const;

export type BlockCategory = (typeof BLOCK_CATEGORIES)[number];
