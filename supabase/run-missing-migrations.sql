-- Combined migrations 030-039 (all idempotent / safe to re-run)

-- 030: Auto-fees
ALTER TABLE estimates
  ADD COLUMN IF NOT EXISTS applied_fees jsonb DEFAULT '[]'::jsonb;

-- 031: Job line items
ALTER TABLE jobs
  ADD COLUMN IF NOT EXISTS line_items jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS pricing_model text DEFAULT 'flat',
  ADD COLUMN IF NOT EXISTS resources jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS subtotal numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS tax_rate numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS tax_amount numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS deposit_type text,
  ADD COLUMN IF NOT EXISTS deposit_amount numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS deposit_paid numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS applied_fees jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS source_estimate_id uuid REFERENCES estimates(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS internal_notes text,
  ADD COLUMN IF NOT EXISTS customer_notes text,
  ADD COLUMN IF NOT EXISTS crew_notes text,
  ADD COLUMN IF NOT EXISTS crew_feedback text;
CREATE INDEX IF NOT EXISTS idx_jobs_source_estimate ON jobs(source_estimate_id) WHERE source_estimate_id IS NOT NULL;

-- 032: Payments
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id),
  customer_id uuid NOT NULL REFERENCES customers(id),
  estimate_id uuid REFERENCES estimates(id),
  job_id uuid REFERENCES jobs(id),
  amount numeric(10,2) NOT NULL,
  method text NOT NULL,
  status text NOT NULL DEFAULT 'completed',
  reference_number text,
  cc_fee_amount numeric(10,2) DEFAULT 0,
  cc_fee_rate numeric(5,2) DEFAULT 0,
  notes text,
  received_by text,
  payment_date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'payments' AND policyname = 'payments_company') THEN
    CREATE POLICY "payments_company" ON payments FOR ALL USING (company_id = get_active_company_id());
  END IF;
END $$;
CREATE INDEX IF NOT EXISTS idx_payments_estimate ON payments(estimate_id) WHERE estimate_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_payments_job ON payments(job_id) WHERE job_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_payments_company ON payments(company_id);

CREATE TABLE IF NOT EXISTS payment_methods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id),
  customer_id uuid NOT NULL REFERENCES customers(id),
  type text NOT NULL,
  last_four text NOT NULL,
  brand text,
  exp_month integer,
  exp_year integer,
  is_default boolean DEFAULT false,
  stripe_payment_method_id text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'payment_methods' AND policyname = 'payment_methods_company') THEN
    CREATE POLICY "payment_methods_company" ON payment_methods FOR ALL USING (company_id = get_active_company_id());
  END IF;
END $$;

-- 033: Prepaid packages
CREATE TABLE IF NOT EXISTS service_packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id),
  name text NOT NULL,
  visit_count integer NOT NULL,
  total_price numeric(10,2) NOT NULL,
  per_visit_price numeric(10,2) NOT NULL,
  discount_percent numeric(5,2) DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE service_packages ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'service_packages' AND policyname = 'service_packages_company') THEN
    CREATE POLICY "service_packages_company" ON service_packages FOR ALL USING (company_id = get_active_company_id());
  END IF;
END $$;
CREATE INDEX IF NOT EXISTS idx_service_packages_company ON service_packages(company_id);

CREATE TABLE IF NOT EXISTS customer_packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id),
  customer_id uuid NOT NULL REFERENCES customers(id),
  package_id uuid NOT NULL REFERENCES service_packages(id),
  job_id uuid REFERENCES jobs(id),
  visits_total integer NOT NULL,
  visits_used integer NOT NULL DEFAULT 0,
  amount_paid numeric(10,2) NOT NULL,
  payment_id uuid REFERENCES payments(id),
  auto_renew boolean DEFAULT false,
  status text NOT NULL DEFAULT 'active',
  purchased_at timestamptz DEFAULT now(),
  completed_at timestamptz
);
ALTER TABLE customer_packages ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'customer_packages' AND policyname = 'customer_packages_company') THEN
    CREATE POLICY "customer_packages_company" ON customer_packages FOR ALL USING (company_id = get_active_company_id());
  END IF;
END $$;
CREATE INDEX IF NOT EXISTS idx_customer_packages_customer ON customer_packages(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_packages_active ON customer_packages(status) WHERE status = 'active';

-- 034: AI Coach
ALTER TABLE consultation_settings
  ADD COLUMN IF NOT EXISTS ai_coach JSONB DEFAULT '{}'::jsonb;

-- 035: Documents
CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id),
  customer_id uuid REFERENCES customers(id),
  estimate_id uuid REFERENCES estimates(id),
  job_id uuid REFERENCES jobs(id),
  type text NOT NULL,
  name text NOT NULL,
  status text NOT NULL DEFAULT 'draft',
  content jsonb,
  public_token text UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex'),
  sent_at timestamptz,
  signed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_documents_company ON documents(company_id);
CREATE INDEX IF NOT EXISTS idx_documents_estimate ON documents(estimate_id);
CREATE INDEX IF NOT EXISTS idx_documents_job ON documents(job_id);
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'documents' AND policyname = 'documents_company_access') THEN
    CREATE POLICY "documents_company_access" ON documents FOR ALL USING (company_id = get_active_company_id());
  END IF;
END $$;

-- 036: Activity log
CREATE TABLE IF NOT EXISTS activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id),
  entity_type text NOT NULL,
  entity_id uuid NOT NULL,
  action text NOT NULL,
  description text NOT NULL,
  metadata jsonb,
  performed_by uuid,
  performed_by_name text,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_activity_log_entity ON activity_log(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_company ON activity_log(company_id);
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'activity_log' AND policyname = 'activity_log_company_access') THEN
    CREATE POLICY "activity_log_company_access" ON activity_log FOR ALL USING (company_id = get_active_company_id());
  END IF;
END $$;

-- 037: Contract auto-attach
ALTER TABLE contract_templates
  ADD COLUMN IF NOT EXISTS attachment_mode text NOT NULL DEFAULT 'manual',
  ADD COLUMN IF NOT EXISTS applies_to text[] DEFAULT '{}';

-- 038: Arrival windows
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS arrival_window text;

-- 039: Estimate crew assignment
ALTER TABLE estimates ADD COLUMN IF NOT EXISTS assigned_crew_id UUID REFERENCES crews(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_estimates_assigned_crew ON estimates(assigned_crew_id) WHERE assigned_crew_id IS NOT NULL;

-- 040: Activity log dashboard enrichment
ALTER TABLE activity_log
  ADD COLUMN IF NOT EXISTS customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS customer_name TEXT,
  ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'system',
  ADD COLUMN IF NOT EXISTS amount NUMERIC(10,2);
CREATE INDEX IF NOT EXISTS idx_activity_log_company_created ON activity_log(company_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_log_customer ON activity_log(customer_id);

-- 041: IDL settings + presented estimate
ALTER TABLE consultation_settings
  ADD COLUMN IF NOT EXISTS idl_settings JSONB DEFAULT '{}'::jsonb;
ALTER TABLE consultations
  ADD COLUMN IF NOT EXISTS presented_estimate_id UUID REFERENCES estimates(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_consultations_presented
  ON consultations(presented_estimate_id) WHERE presented_estimate_id IS NOT NULL;
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE consultations;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
