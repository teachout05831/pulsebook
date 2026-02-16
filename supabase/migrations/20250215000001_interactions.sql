-- Interactions table: user-logged communications (calls, texts, emails, meetings, notes)
-- Will be auto-populated by embedded phone/email systems in the future

CREATE TABLE interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('call', 'text', 'email', 'meeting', 'note')) NOT NULL,
  direction TEXT CHECK (direction IN ('inbound', 'outbound')) DEFAULT NULL,
  subject TEXT,
  details TEXT,
  outcome TEXT CHECK (outcome IN ('positive', 'neutral', 'no_answer', 'follow_up_needed')) DEFAULT NULL,
  duration_seconds INTEGER DEFAULT NULL,
  performed_by UUID REFERENCES users(id),
  performed_by_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_interactions_customer ON interactions(customer_id);
CREATE INDEX idx_interactions_company ON interactions(company_id);
CREATE INDEX idx_interactions_customer_created ON interactions(customer_id, created_at DESC);

-- RLS
ALTER TABLE interactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "interactions_company" ON interactions
  FOR ALL USING (company_id = get_active_company_id());
