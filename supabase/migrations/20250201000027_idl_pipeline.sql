-- Intelligent Document Layer (IDL) Pipeline
-- Extends consultations + estimate_video_calls for automated recording → transcription → AI estimate pipeline

-- Pipeline tracking on consultations
ALTER TABLE consultations ADD COLUMN IF NOT EXISTS pipeline_status TEXT DEFAULT 'idle'
  CHECK (pipeline_status IN ('idle','recording_ready','uploading','transcribing','analyzing','generating','ready','error'));
ALTER TABLE consultations ADD COLUMN IF NOT EXISTS pipeline_error TEXT;

-- Link estimate_video_calls to consultations + Bunny
ALTER TABLE estimate_video_calls ADD COLUMN IF NOT EXISTS consultation_id UUID REFERENCES consultations(id);
ALTER TABLE estimate_video_calls ADD COLUMN IF NOT EXISTS bunny_video_id TEXT;
ALTER TABLE estimate_video_calls ADD COLUMN IF NOT EXISTS ai_estimate_output JSONB;
ALTER TABLE estimate_video_calls ADD COLUMN IF NOT EXISTS ai_page_content JSONB;
ALTER TABLE estimate_video_calls ADD COLUMN IF NOT EXISTS processing_error TEXT;

-- Default template for IDL in consultation settings
ALTER TABLE consultation_settings ADD COLUMN IF NOT EXISTS default_template_id UUID REFERENCES estimate_page_templates(id);
ALTER TABLE consultation_settings ADD COLUMN IF NOT EXISTS auto_generate_estimate BOOLEAN DEFAULT false;

-- Indexes for pipeline queries
CREATE INDEX IF NOT EXISTS idx_video_calls_consultation ON estimate_video_calls(consultation_id);
CREATE INDEX IF NOT EXISTS idx_consultations_pipeline ON consultations(company_id, pipeline_status);
