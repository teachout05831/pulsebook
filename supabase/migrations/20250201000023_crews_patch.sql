-- Patch: add missing columns to crews table
ALTER TABLE crews ADD COLUMN IF NOT EXISTS lead_member_id UUID REFERENCES team_members(id) ON DELETE SET NULL;
ALTER TABLE crews ADD COLUMN IF NOT EXISTS vehicle_name TEXT;
ALTER TABLE crews ADD COLUMN IF NOT EXISTS sort_order INTEGER NOT NULL DEFAULT 0;
ALTER TABLE crews ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Ensure jobs table has crew/dispatch columns
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS assigned_crew_id UUID REFERENCES crews(id) ON DELETE SET NULL;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS dispatched_at TIMESTAMPTZ;

-- Indexes (IF NOT EXISTS)
CREATE INDEX IF NOT EXISTS idx_jobs_assigned_crew ON jobs(assigned_crew_id) WHERE assigned_crew_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_jobs_dispatched ON jobs(dispatched_at) WHERE dispatched_at IS NOT NULL;
