-- Phase 9: Documents table for unified document management
-- Stores invoices, work orders (estimate pages + contracts queried from their own tables)

CREATE TABLE documents (
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

CREATE INDEX idx_documents_company ON documents(company_id);
CREATE INDEX idx_documents_estimate ON documents(estimate_id);
CREATE INDEX idx_documents_job ON documents(job_id);

ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "documents_company_access" ON documents
  FOR ALL USING (company_id = get_active_company_id());
