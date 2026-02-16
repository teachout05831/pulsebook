export type EstimatePageStatus = "draft" | "published" | "viewed" | "approved" | "declined" | "expired";

export type PageLayout = "stacked" | "sidebar" | "split" | "magazine";

export type DepositType = "flat" | "percentage";

export type BrandTone = "formal" | "friendly" | "casual";

export type VideoCategory = "intro" | "testimonial" | "process" | "site_visit" | "before_after" | "personal_message" | "case_study" | "other";

export type VideoCallType = "discovery" | "review" | "instant";

export type SectionType =
  | "hero" | "trust_badges" | "about" | "scope" | "pricing"
  | "gallery" | "project_photos" | "testimonials" | "video_call" | "calendar"
  | "approval" | "payment" | "faq" | "contact" | "chat"
  | "video" | "timeline" | "before_after" | "content_block"
  | "custom_html" | "notes" | "customer_info" | "crew_details" | "addresses"
  | "service_picker" | "scheduler" | "booking_form";

export type AnalyticsEventType =
  | "page_view" | "section_view" | "section_scroll" | "pricing_hover"
  | "cta_click" | "video_call_scheduled" | "video_call_started"
  | "chat_opened" | "approved" | "declined" | "deposit_paid"
  | "link_shared" | "video_play" | "video_pause" | "video_complete";

export interface PageSection {
  id: string;
  type: SectionType;
  order: number;
  visible: boolean;
  customLabel?: string;
  settings: Record<string, unknown>;
  content: Record<string, unknown>;
  universalBlockId?: string;
  isConnected?: boolean;
  universalBlockName?: string;
}

export interface DesignTheme {
  activePresetId?: string;
  headingFont?: string;
  bodyFont?: string;
  headingWeight?: string;
  headingCase?: "uppercase" | "normal";
  borderRadius?: "none" | "small" | "medium" | "large";
  cardStyle?: "flat" | "bordered" | "soft-shadow" | "glass";
  buttonStyle?: "square-solid" | "rounded" | "pill" | "outline" | "gradient";
  sectionSpacing?: "tight" | "normal" | "generous";
  contentWidth?: "narrow" | "normal" | "wide" | "full";
  headerStyle?: "dark-filled" | "transparent" | "gradient";
  backgroundPattern?: "solid" | "alternating" | "subtle-dots" | "gradient-fade";
  accentPlacement?: "left-border" | "underline" | "highlight" | "none";
  dividerStyle?: "line" | "dots" | "wave" | "none";
  animations?: "none" | "subtle-fade" | "slide-up" | "expressive";
  hoverEffects?: "none" | "lift" | "glow" | "scale";
}

export type CellType = "text" | "heading" | "image" | "testimonial" | "bullet_list" | "icon_text" | "spacer";

export interface ContentCell {
  id: string;
  type: CellType;
  content: Record<string, unknown>;
}

export interface CustomHtmlContent {
  html: string;
  css: string;
  blockId?: string;
  blockValues?: Record<string, string>;
}

export interface PageAnalyticsEvent {
  id: string;
  pageId: string;
  eventType: AnalyticsEventType;
  eventData: Record<string, unknown> | null;
  ipAddress: string | null;
  userAgent: string | null;
  deviceType: string | null;
  referrer: string | null;
  createdAt: string;
}
