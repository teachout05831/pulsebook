-- Phase 3: Add pricing columns to jobs table
-- Enables line items, resources, totals, deposits, fees, and notes on jobs

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
