-- Add issue_date column to invoices table if it doesn't exist
-- This is needed for reports functionality

ALTER TABLE invoices ADD COLUMN IF NOT EXISTS issue_date DATE DEFAULT CURRENT_DATE;

-- Create index for better query performance on reports
CREATE INDEX IF NOT EXISTS idx_invoices_issue_date ON invoices(issue_date);

-- Update existing invoices to use created_at as issue_date if issue_date is null
UPDATE invoices
SET issue_date = created_at::date
WHERE issue_date IS NULL;
