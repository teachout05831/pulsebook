import type { EstimatePageStatus, SectionType } from "./core";

export const PAGE_STATUS_LABELS: Record<EstimatePageStatus, string> = {
  draft: "Draft",
  published: "Published",
  viewed: "Viewed",
  approved: "Approved",
  declined: "Declined",
  expired: "Expired",
};

export const PAGE_STATUS_COLORS: Record<EstimatePageStatus, string> = {
  draft: "bg-gray-100 text-gray-800",
  published: "bg-blue-100 text-blue-800",
  viewed: "bg-purple-100 text-purple-800",
  approved: "bg-green-100 text-green-800",
  declined: "bg-red-100 text-red-800",
  expired: "bg-yellow-100 text-yellow-800",
};

// Generic section types usable in consultation widget builders (excludes estimate-specific + interactive)
export const WIDGET_SECTION_TYPES: SectionType[] = [
  "hero", "trust_badges", "about", "gallery", "testimonials",
  "video", "faq", "timeline", "before_after", "content_block", "custom_html",
];

export const SECTION_LABELS: Record<SectionType, string> = {
  hero: "Hero",
  trust_badges: "Trust Badges",
  about: "About Us",
  scope: "Scope of Work",
  pricing: "Pricing",
  gallery: "Photo & Video Gallery",
  project_photos: "Project Photos",
  testimonials: "Testimonials",
  video_call: "Video Call",
  calendar: "Calendar",
  approval: "Approval",
  payment: "Payment",
  faq: "FAQ",
  contact: "Contact",
  chat: "Chat",
  video: "Video",
  timeline: "Timeline",
  before_after: "Before & After",
  content_block: "Content Block",
  custom_html: "Custom HTML",
  notes: "Customer Notes",
  customer_info: "Customer Info",
  crew_details: "Crew Details",
  addresses: "Addresses",
  service_picker: "Service Selection",
  scheduler: "Date & Time",
  booking_form: "Booking Form",
};

// Sections allowed in scheduling page builder (generic + scheduling-specific)
export const SCHEDULING_SECTION_TYPES: SectionType[] = [
  "hero", "trust_badges", "about", "gallery", "testimonials",
  "video", "faq", "timeline", "before_after", "content_block", "custom_html",
  "service_picker", "scheduler", "booking_form",
];
