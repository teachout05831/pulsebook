-- Auto-Fees: add applied_fees JSONB column to estimates
-- Stores per-estimate fee toggles and calculated amounts

ALTER TABLE estimates
  ADD COLUMN IF NOT EXISTS applied_fees jsonb DEFAULT '[]'::jsonb;

COMMENT ON COLUMN estimates.applied_fees IS 'Array of applied fee objects with feeId, name, type, rate, amount, applied';
