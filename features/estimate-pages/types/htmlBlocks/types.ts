export type HtmlBlockCategory = string;

export interface HtmlBlock {
  id: string;
  name: string;
  category: string;
  description: string;
  html: string;
  css: string;
  variables: string[];
  previewImage?: string;
}

export interface HtmlBlockCategoryDef {
  value: string;
  label: string;
}
