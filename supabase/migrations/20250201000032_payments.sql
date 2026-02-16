-- Phase 5: Payments
-- Tracks individual payment records for estimates and jobs.
-- payment_methods placeholder for future Stripe/Square integration.

-- payments table
CREATE TABLE payments (
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
CREATE POLICY "payments_company" ON payments
  FOR ALL USING (company_id = get_active_company_id());

CREATE INDEX idx_payments_estimate ON payments(estimate_id) WHERE estimate_id IS NOT NULL;
CREATE INDEX idx_payments_job ON payments(job_id) WHERE job_id IS NOT NULL;
CREATE INDEX idx_payments_company ON payments(company_id);

-- payment_methods table (placeholder for future Stripe/Square)
CREATE TABLE payment_methods (
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
CREATE POLICY "payment_methods_company" ON payment_methods
  FOR ALL USING (company_id = get_active_company_id());
