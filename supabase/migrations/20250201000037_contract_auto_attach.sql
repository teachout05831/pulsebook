-- Add auto-attachment fields to contract_templates
ALTER TABLE contract_templates
  ADD COLUMN IF NOT EXISTS attachment_mode text NOT NULL DEFAULT 'manual',
  ADD COLUMN IF NOT EXISTS applies_to text[] DEFAULT '{}';

COMMENT ON COLUMN contract_templates.attachment_mode IS 'auto or manual';
COMMENT ON COLUMN contract_templates.applies_to IS 'Pricing models: hourly, flat, per_service. Empty = all.';
