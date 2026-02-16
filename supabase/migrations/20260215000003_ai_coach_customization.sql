-- AI Coach customization library (company-specific overrides)
-- Stores custom stage scripts, extra keywords, objection response overrides, and custom objections

ALTER TABLE consultation_settings
  ADD COLUMN IF NOT EXISTS ai_coach_library JSONB DEFAULT '{}'::jsonb;
