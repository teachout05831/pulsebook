-- GHL Integration Settings: per-company configuration
-- Pattern: one row per company (like consultation_settings), upsert on company_id

CREATE TABLE integration_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  ghl_enabled BOOLEAN DEFAULT false,
  ghl_api_token TEXT,
  ghl_location_id TEXT,
  ghl_sync_new_leads BOOLEAN DEFAULT true,
  ghl_sync_job_booked BOOLEAN DEFAULT false,
  ghl_sync_lead_lost BOOLEAN DEFAULT false,
  ghl_sync_status_changes BOOLEAN DEFAULT false,
  ghl_default_tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(company_id)
);

ALTER TABLE integration_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "integration_settings_company_isolation" ON integration_settings
  FOR ALL USING (company_id = get_active_company_id());

CREATE INDEX idx_integration_settings_company ON integration_settings(company_id);

-- Store GHL contact ID on customers for update calls
ALTER TABLE customers ADD COLUMN IF NOT EXISTS ghl_contact_id TEXT;

CREATE INDEX idx_customers_ghl_contact ON customers(ghl_contact_id);
