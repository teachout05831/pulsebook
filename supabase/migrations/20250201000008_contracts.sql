-- =============================================
-- Migration 008: Contracts Feature
-- =============================================

-- 1. Contract templates (company designs these in Settings)
CREATE TABLE IF NOT EXISTS contract_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'standard',
  design_theme TEXT DEFAULT 'clean',
  blocks JSONB NOT NULL DEFAULT '[]',
  stage_colors JSONB DEFAULT '{"before_job":"#FEF3C7","neutral":"#FFFFFF","crew":"#DBEAFE","after_job":"#D1FAE5"}',
  is_active BOOLEAN DEFAULT false,
  is_default BOOLEAN DEFAULT false,
  version INTEGER DEFAULT 1,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE contract_templates ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_contract_templates_company ON contract_templates(company_id);
CREATE INDEX idx_contract_templates_active ON contract_templates(company_id, is_active);

CREATE POLICY "contract_templates_company_isolation" ON contract_templates
  FOR ALL USING (company_id = get_active_company_id());

-- 2. Contract instances (live documents attached to jobs)
CREATE TABLE IF NOT EXISTS contract_instances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  template_id UUID REFERENCES contract_templates(id),
  job_id UUID REFERENCES jobs(id),
  customer_id UUID REFERENCES customers(id),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'viewed', 'signed', 'paid', 'completed', 'cancelled')),
  filled_blocks JSONB NOT NULL DEFAULT '[]',
  template_snapshot JSONB NOT NULL DEFAULT '{}',
  signing_token TEXT UNIQUE,
  sent_at TIMESTAMPTZ,
  viewed_at TIMESTAMPTZ,
  signed_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE contract_instances ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_contract_instances_company ON contract_instances(company_id);
CREATE INDEX idx_contract_instances_job ON contract_instances(job_id);
CREATE INDEX idx_contract_instances_token ON contract_instances(signing_token);

CREATE POLICY "contract_instances_company_isolation" ON contract_instances
  FOR ALL USING (company_id = get_active_company_id());

-- Public read access for signing via token (anonymous users)
CREATE POLICY "contract_instances_public_signing" ON contract_instances
  FOR SELECT USING (signing_token IS NOT NULL);

-- 3. Contract signatures (audit trail for every signature)
CREATE TABLE IF NOT EXISTS contract_signatures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID NOT NULL REFERENCES contract_instances(id) ON DELETE CASCADE,
  block_id TEXT NOT NULL,
  signer_role TEXT NOT NULL,
  signer_name TEXT NOT NULL,
  signer_email TEXT,
  signature_data TEXT NOT NULL,
  stage TEXT DEFAULT 'neutral',
  ip_address TEXT,
  user_agent TEXT,
  gps_latitude DECIMAL,
  gps_longitude DECIMAL,
  signed_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE contract_signatures ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_contract_signatures_contract ON contract_signatures(contract_id);

CREATE POLICY "contract_signatures_via_instance" ON contract_signatures
  FOR ALL USING (
    contract_id IN (
      SELECT id FROM contract_instances WHERE company_id = get_active_company_id()
    )
  );

-- Public insert for anonymous signing
CREATE POLICY "contract_signatures_public_insert" ON contract_signatures
  FOR INSERT WITH CHECK (
    contract_id IN (
      SELECT id FROM contract_instances WHERE signing_token IS NOT NULL
    )
  );

-- 4. Contract time entries (atomic start/stop events)
CREATE TABLE IF NOT EXISTS contract_time_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID NOT NULL REFERENCES contract_instances(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('start', 'stop')),
  reason TEXT DEFAULT 'work',
  is_billable BOOLEAN DEFAULT true,
  recorded_at TIMESTAMPTZ DEFAULT NOW(),
  recorded_by UUID REFERENCES auth.users(id),
  gps_latitude DECIMAL,
  gps_longitude DECIMAL,
  notes TEXT,
  original_recorded_at TIMESTAMPTZ,
  edited_at TIMESTAMPTZ,
  edited_by UUID REFERENCES auth.users(id),
  edit_reason TEXT
);

ALTER TABLE contract_time_entries ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_contract_time_entries_contract ON contract_time_entries(contract_id);

CREATE POLICY "contract_time_entries_via_instance" ON contract_time_entries
  FOR ALL USING (
    contract_id IN (
      SELECT id FROM contract_instances WHERE company_id = get_active_company_id()
    )
  );

-- 5. Contract payments
CREATE TABLE IF NOT EXISTS contract_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID NOT NULL REFERENCES contract_instances(id) ON DELETE CASCADE,
  amount DECIMAL NOT NULL,
  payment_type TEXT NOT NULL,
  payment_method TEXT,
  stripe_payment_id TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'succeeded', 'failed', 'refunded')),
  collected_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE contract_payments ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_contract_payments_contract ON contract_payments(contract_id);

CREATE POLICY "contract_payments_via_instance" ON contract_payments
  FOR ALL USING (
    contract_id IN (
      SELECT id FROM contract_instances WHERE company_id = get_active_company_id()
    )
  );
