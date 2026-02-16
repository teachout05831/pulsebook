-- Phase 6: Prepaid Packages

-- Company-defined package templates
CREATE TABLE service_packages (
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
CREATE POLICY "service_packages_company" ON service_packages
  FOR ALL USING (company_id = get_active_company_id());
CREATE INDEX idx_service_packages_company ON service_packages(company_id);

-- Customer-purchased package instances
CREATE TABLE customer_packages (
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
CREATE POLICY "customer_packages_company" ON customer_packages
  FOR ALL USING (company_id = get_active_company_id());
CREATE INDEX idx_customer_packages_customer ON customer_packages(customer_id);
CREATE INDEX idx_customer_packages_active ON customer_packages(status) WHERE status = 'active';
