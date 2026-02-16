-- Migration: Add follow_ups table
-- Purpose: Store follow-up tasks/reminders for customers

CREATE TABLE follow_ups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('call', 'email', 'meeting')) NOT NULL,
  details TEXT,
  due_date DATE NOT NULL,
  status TEXT CHECK (status IN ('pending', 'completed', 'cancelled')) DEFAULT 'pending',
  assigned_to UUID REFERENCES team_members(id),
  completed_at TIMESTAMPTZ,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_follow_ups_customer ON follow_ups(customer_id);
CREATE INDEX idx_follow_ups_company ON follow_ups(company_id);
CREATE INDEX idx_follow_ups_due_date ON follow_ups(due_date);
CREATE INDEX idx_follow_ups_status ON follow_ups(status);
CREATE INDEX idx_follow_ups_pending ON follow_ups(company_id, status, due_date) WHERE status = 'pending';

-- Enable RLS
ALTER TABLE follow_ups ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view follow_ups in active company"
ON follow_ups FOR SELECT
USING (company_id = get_active_company_id());

CREATE POLICY "Users can insert follow_ups in active company"
ON follow_ups FOR INSERT
WITH CHECK (company_id = get_active_company_id());

CREATE POLICY "Users can update follow_ups in active company"
ON follow_ups FOR UPDATE
USING (company_id = get_active_company_id());

CREATE POLICY "Users can delete follow_ups in active company"
ON follow_ups FOR DELETE
USING (company_id = get_active_company_id());

-- Trigger for updated_at
CREATE TRIGGER update_follow_ups_updated_at
  BEFORE UPDATE ON follow_ups
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
