-- Migration: Add customer_notes table
-- Purpose: Store notes/comments for customers

-- Create the updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE customer_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_pinned BOOLEAN DEFAULT false,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_customer_notes_customer ON customer_notes(customer_id);
CREATE INDEX idx_customer_notes_company ON customer_notes(company_id);
CREATE INDEX idx_customer_notes_pinned ON customer_notes(customer_id, is_pinned) WHERE is_pinned = true;

-- Enable RLS
ALTER TABLE customer_notes ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view notes in active company"
ON customer_notes FOR SELECT
USING (company_id = get_active_company_id());

CREATE POLICY "Users can insert notes in active company"
ON customer_notes FOR INSERT
WITH CHECK (company_id = get_active_company_id());

CREATE POLICY "Users can update notes in active company"
ON customer_notes FOR UPDATE
USING (company_id = get_active_company_id());

CREATE POLICY "Users can delete notes in active company"
ON customer_notes FOR DELETE
USING (company_id = get_active_company_id());

-- Trigger for updated_at
CREATE TRIGGER update_customer_notes_updated_at
  BEFORE UPDATE ON customer_notes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
