-- Repair: add incentive_config columns that were tracked but not applied
ALTER TABLE estimate_pages
ADD COLUMN IF NOT EXISTS incentive_config JSONB DEFAULT NULL,
ADD COLUMN IF NOT EXISTS approved_incentive_tier JSONB DEFAULT NULL;

ALTER TABLE estimate_page_templates
ADD COLUMN IF NOT EXISTS incentive_config JSONB DEFAULT NULL;
