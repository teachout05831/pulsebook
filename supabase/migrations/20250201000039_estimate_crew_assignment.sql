-- Add crew and technician assignment to estimates
ALTER TABLE estimates ADD COLUMN IF NOT EXISTS assigned_crew_id UUID REFERENCES crews(id) ON DELETE SET NULL;
ALTER TABLE estimates ADD COLUMN IF NOT EXISTS technician_id UUID REFERENCES team_members(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_estimates_assigned_crew ON estimates(assigned_crew_id) WHERE assigned_crew_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_estimates_technician ON estimates(technician_id) WHERE technician_id IS NOT NULL;
