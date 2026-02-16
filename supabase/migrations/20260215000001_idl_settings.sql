-- IDL (Intelligent Document Layer) settings + presented estimate support

ALTER TABLE consultation_settings
  ADD COLUMN IF NOT EXISTS idl_settings JSONB DEFAULT '{}'::jsonb;

ALTER TABLE consultations
  ADD COLUMN IF NOT EXISTS presented_estimate_id UUID REFERENCES estimates(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_consultations_presented
  ON consultations(presented_estimate_id) WHERE presented_estimate_id IS NOT NULL;

-- Enable real-time for customer live view
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE consultations;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
