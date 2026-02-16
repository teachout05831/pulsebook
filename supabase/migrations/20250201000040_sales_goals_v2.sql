-- Migration: Sales Goals V2 — Number-based targets + Weekly goals
-- Purpose: Replace percentage-based rate targets with number targets,
--          add weekly goals table for salesperson self-set weekly targets

-- ============================================
-- ADD NUMBER COLUMNS TO sales_goals (monthly)
-- ============================================
ALTER TABLE sales_goals ADD COLUMN bookings_target INTEGER DEFAULT 0;
ALTER TABLE sales_goals ADD COLUMN estimates_target INTEGER DEFAULT 0;
ALTER TABLE sales_goals ADD COLUMN calls_target INTEGER DEFAULT 0;

-- ============================================
-- WEEKLY_GOALS TABLE
-- ============================================
CREATE TABLE weekly_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  team_member_id UUID NOT NULL REFERENCES team_members(id) ON DELETE CASCADE,
  week_start DATE NOT NULL,  -- Always a Monday
  bookings_target INTEGER DEFAULT 0,
  estimates_target INTEGER DEFAULT 0,
  calls_target INTEGER DEFAULT 0,
  revenue_target DECIMAL(12,2) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(company_id, team_member_id, week_start)
);

-- Indexes
CREATE INDEX idx_weekly_goals_company ON weekly_goals(company_id);
CREATE INDEX idx_weekly_goals_team_member ON weekly_goals(team_member_id);
CREATE INDEX idx_weekly_goals_week ON weekly_goals(company_id, week_start);

-- Enable RLS
ALTER TABLE weekly_goals ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view weekly_goals in active company"
ON weekly_goals FOR SELECT
USING (company_id = get_active_company_id());

CREATE POLICY "Users can insert weekly_goals in active company"
ON weekly_goals FOR INSERT
WITH CHECK (company_id = get_active_company_id());

CREATE POLICY "Users can update weekly_goals in active company"
ON weekly_goals FOR UPDATE
USING (company_id = get_active_company_id());

CREATE POLICY "Users can delete weekly_goals in active company"
ON weekly_goals FOR DELETE
USING (company_id = get_active_company_id());

-- Trigger for updated_at
CREATE TRIGGER update_weekly_goals_updated_at
  BEFORE UPDATE ON weekly_goals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
