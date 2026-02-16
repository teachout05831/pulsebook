import type { PageSection } from "../../types";

export const VARIANT_OPTIONS: Record<string, string[]> = {
  hero: ["photo", "clean", "split", "gradient"],
  scope: ["checklist", "narrative", "detailed", "room-checklist"],
  pricing: ["simple", "detailed", "packages"],
  trust_badges: ["horizontal", "grid", "banner", "minimal", "stacked"],
  about: ["standard", "split", "centered", "cards", "minimal"],
  gallery: ["grid", "carousel", "masonry"],
  project_photos: ["grid", "carousel", "masonry"],
  testimonials: ["cards", "carousel", "minimal"],
  faq: ["accordion", "two-column"],
  approval: ["standard", "detailed"],
  video: ["standard", "fullwidth", "side-by-side"],
  payment: ["standard", "split"],
  contact: ["standard", "minimal", "detailed"],
  video_call: ["standard", "split"],
  calendar: ["embedded", "button"],
  chat: ["standard", "minimal"],
  before_after: ["slider"],
  content_block: ["default"],
  service_picker: ["grid", "list"],
  scheduler: ["inline", "compact"],
  booking_form: ["standard", "minimal"],
};

export const PADDING_OPTIONS = ["compact", "normal", "generous"] as const;

export function getSetting(section: PageSection, key: string, fallback: string = "") {
  return (section.settings[key] as string) ?? fallback;
}

export function getContent(section: PageSection, key: string, fallback: string = "") {
  return (section.content[key] as string) ?? fallback;
}
