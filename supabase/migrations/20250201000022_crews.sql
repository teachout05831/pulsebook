-- =============================================
-- Crew Management System
-- =============================================
-- Flexible crew/team assignment for dispatch.
-- Supports individual, crew, or both assignment modes.
-- Daily rosters for flexible crews (moving, landscaping).
-- Dispatch publish gating for tech portal visibility.

-- =============================================
-- 1. CREWS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS crews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#3b82f6',
  vehicle_name TEXT,
  lead_member_id UUID REFERENCES team_members(id) ON DELETE SET NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE crews ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_crews_company ON crews(company_id);

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'crews_company_isolation' AND tablename = 'crews') THEN
    CREATE POLICY "crews_company_isolation" ON crews FOR ALL USING (company_id = get_active_company_id());
  END IF;
END $$;

-- =============================================
-- 2. CREW MEMBERS (junction table)
-- =============================================
CREATE TABLE IF NOT EXISTS crew_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  crew_id UUID NOT NULL REFERENCES crews(id) ON DELETE CASCADE,
  team_member_id UUID NOT NULL REFERENCES team_members(id) ON DELETE CASCADE,
  is_default BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (crew_id, team_member_id)
);

ALTER TABLE crew_members ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_crew_members_crew ON crew_members(crew_id);
CREATE INDEX IF NOT EXISTS idx_crew_members_team_member ON crew_members(team_member_id);

-- RLS: access through crews table company_id
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'crew_members_company_isolation' AND tablename = 'crew_members') THEN
    CREATE POLICY "crew_members_company_isolation" ON crew_members FOR ALL USING (
      EXISTS (SELECT 1 FROM crews WHERE crews.id = crew_members.crew_id AND crews.company_id = get_active_company_id())
    );
  END IF;
END $$;

-- =============================================
-- 3. DAILY ROSTERS (flexible crew tracking)
-- =============================================
CREATE TABLE IF NOT EXISTS daily_rosters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  crew_id UUID NOT NULL REFERENCES crews(id) ON DELETE CASCADE,
  roster_date DATE NOT NULL,
  team_member_id UUID NOT NULL REFERENCES team_members(id) ON DELETE CASCADE,
  is_present BOOLEAN NOT NULL DEFAULT true,
  is_fill_in BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (crew_id, roster_date, team_member_id)
);

ALTER TABLE daily_rosters ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_daily_rosters_company_date ON daily_rosters(company_id, roster_date);
CREATE INDEX IF NOT EXISTS idx_daily_rosters_crew_date ON daily_rosters(crew_id, roster_date);

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'daily_rosters_company_isolation' AND tablename = 'daily_rosters') THEN
    CREATE POLICY "daily_rosters_company_isolation" ON daily_rosters FOR ALL USING (company_id = get_active_company_id());
  END IF;
END $$;

-- =============================================
-- 4. DISPATCH LOGS (publish tracking)
-- =============================================
CREATE TABLE IF NOT EXISTS dispatch_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  dispatch_date DATE NOT NULL,
  dispatched_at TIMESTAMPTZ DEFAULT NOW(),
  dispatched_by UUID NOT NULL REFERENCES auth.users(id),
  notes TEXT,
  UNIQUE (company_id, dispatch_date)
);

ALTER TABLE dispatch_logs ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_dispatch_logs_company_date ON dispatch_logs(company_id, dispatch_date);

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'dispatch_logs_company_isolation' AND tablename = 'dispatch_logs') THEN
    CREATE POLICY "dispatch_logs_company_isolation" ON dispatch_logs FOR ALL USING (company_id = get_active_company_id());
  END IF;
END $$;

-- =============================================
-- 5. JOBS TABLE ADDITIONS
-- =============================================
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS assigned_crew_id UUID REFERENCES crews(id) ON DELETE SET NULL;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS dispatched_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_jobs_assigned_crew ON jobs(assigned_crew_id) WHERE assigned_crew_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_jobs_dispatched ON jobs(dispatched_at) WHERE dispatched_at IS NOT NULL;
