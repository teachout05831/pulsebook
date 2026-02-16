-- Migration: Add sales_goals table
-- Purpose: Store monthly sales goals for team members (salespeople)

-- ============================================
-- SALES_GOALS TABLE
-- ============================================
CREATE TABLE sales_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  team_member_id UUID NOT NULL REFERENCES team_members(id) ON DELETE CASCADE,

  -- Goal period (monthly)
  year INTEGER NOT NULL,
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),

  -- Revenue target
  revenue_target DECIMAL(12,2) NOT NULL DEFAULT 0,

  -- Rate targets (percentages)
  booking_rate_target DECIMAL(5,2) DEFAULT 35,
  sent_estimate_rate_target DECIMAL(5,2) DEFAULT 80,
  closed_rate_target DECIMAL(5,2) DEFAULT 25,

  -- Tracking
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- One goal per team member per month
  UNIQUE(company_id, team_member_id, year, month)
);

-- Indexes for performance
CREATE INDEX idx_sales_goals_company ON sales_goals(company_id);
CREATE INDEX idx_sales_goals_team_member ON sales_goals(team_member_id);
CREATE INDEX idx_sales_goals_period ON sales_goals(year, month);
CREATE INDEX idx_sales_goals_active ON sales_goals(company_id, year, month, is_active)
  WHERE is_active = true;

-- Enable RLS
ALTER TABLE sales_goals ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view sales_goals in active company"
ON sales_goals FOR SELECT
USING (company_id = get_active_company_id());

CREATE POLICY "Users can insert sales_goals in active company"
ON sales_goals FOR INSERT
WITH CHECK (company_id = get_active_company_id());

CREATE POLICY "Users can update sales_goals in active company"
ON sales_goals FOR UPDATE
USING (company_id = get_active_company_id());

CREATE POLICY "Users can delete sales_goals in active company"
ON sales_goals FOR DELETE
USING (company_id = get_active_company_id());

-- Trigger for updated_at
CREATE TRIGGER update_sales_goals_updated_at
  BEFORE UPDATE ON sales_goals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
