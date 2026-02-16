-- Consultation Settings: per-company configuration for video consultations
-- Pattern: one row per company (like company_brand_kits), upsert on company_id

CREATE TABLE consultation_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,

  -- General
  enabled BOOLEAN DEFAULT true,
  default_title TEXT NOT NULL DEFAULT 'Video Consultation',
  auto_record BOOLEAN DEFAULT false,
  expiration_hours INTEGER DEFAULT 48,

  -- Lobby
  show_trust_signals BOOLEAN DEFAULT true,
  show_portfolio BOOLEAN DEFAULT true,
  welcome_message TEXT,

  -- Call widgets (JSONB array of CallWidget objects)
  widgets JSONB DEFAULT '[]'::jsonb,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(company_id)
);

ALTER TABLE consultation_settings ENABLE ROW LEVEL SECURITY;

-- Authenticated: company isolation via get_active_company_id()
CREATE POLICY "consultation_settings_company_isolation" ON consultation_settings
  FOR ALL USING (company_id = get_active_company_id());

-- Public: read-only for /c/[token] pages (joined via company_id)
CREATE POLICY "consultation_settings_public_read" ON consultation_settings
  FOR SELECT USING (true);
