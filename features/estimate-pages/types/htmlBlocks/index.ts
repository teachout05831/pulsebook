export type { HtmlBlock, HtmlBlockCategory, HtmlBlockCategoryDef } from "./types";
export { HTML_BLOCK_CATEGORIES } from "./categories";
import { FEATURES_BLOCKS } from "./blocks-features";
import { PRICING_BLOCKS } from "./blocks-pricing";
import { TESTIMONIALS_BLOCKS } from "./blocks-testimonials";
import { CTA_BLOCKS } from "./blocks-cta";
import { STATS_BLOCKS } from "./blocks-stats";
import { CONTENT_BLOCKS } from "./blocks-content";
import { TEAM_BLOCKS } from "./blocks-team";
import { SERVICES_BLOCKS } from "./blocks-services";
import { SOCIAL_BLOCKS } from "./blocks-social";
import { HERO_BLOCKS } from "./blocks-hero";
import { FOOTER_BLOCKS } from "./blocks-footer";
import { CLEANING_BLOCKS } from "./blocks-cleaning";
export const HTML_BLOCKS = [
  ...FEATURES_BLOCKS, ...PRICING_BLOCKS, ...TESTIMONIALS_BLOCKS,
  ...CTA_BLOCKS, ...STATS_BLOCKS, ...CONTENT_BLOCKS,
  ...TEAM_BLOCKS, ...SERVICES_BLOCKS, ...SOCIAL_BLOCKS,
  ...HERO_BLOCKS, ...FOOTER_BLOCKS, ...CLEANING_BLOCKS,
];
