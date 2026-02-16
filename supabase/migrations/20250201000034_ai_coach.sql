-- AI Coach settings column on consultation_settings
ALTER TABLE consultation_settings
ADD COLUMN IF NOT EXISTS ai_coach JSONB DEFAULT '{}'::jsonb;

COMMENT ON COLUMN consultation_settings.ai_coach IS 'AI Sales Coach settings (enabled, show_transcript, show_service_suggestions, show_objection_responses, auto_advance_stage)';
