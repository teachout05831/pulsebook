-- Add incentive pricing config to estimate pages
ALTER TABLE estimate_pages
ADD COLUMN IF NOT EXISTS incentive_config JSONB DEFAULT NULL,
ADD COLUMN IF NOT EXISTS approved_incentive_tier JSONB DEFAULT NULL;

-- Add incentive config to templates
ALTER TABLE estimate_page_templates
ADD COLUMN IF NOT EXISTS incentive_config JSONB DEFAULT NULL;
