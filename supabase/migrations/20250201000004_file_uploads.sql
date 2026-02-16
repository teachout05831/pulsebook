-- Migration: Add file_uploads table
-- Purpose: Store file attachments for customers/jobs

CREATE TABLE file_uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  storage_path TEXT NOT NULL,
  category TEXT CHECK (category IN ('photo', 'document', 'contract')) NOT NULL DEFAULT 'document',
  description TEXT,
  is_signed BOOLEAN DEFAULT false,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_file_uploads_customer ON file_uploads(customer_id);
CREATE INDEX idx_file_uploads_job ON file_uploads(job_id);
CREATE INDEX idx_file_uploads_company ON file_uploads(company_id);
CREATE INDEX idx_file_uploads_category ON file_uploads(customer_id, category);

-- Enable RLS
ALTER TABLE file_uploads ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view files in active company"
ON file_uploads FOR SELECT
USING (company_id = get_active_company_id());

CREATE POLICY "Users can insert files in active company"
ON file_uploads FOR INSERT
WITH CHECK (company_id = get_active_company_id());

CREATE POLICY "Users can update files in active company"
ON file_uploads FOR UPDATE
USING (company_id = get_active_company_id());

CREATE POLICY "Users can delete files in active company"
ON file_uploads FOR DELETE
USING (company_id = get_active_company_id());
