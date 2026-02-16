-- Pre-built fields: recurring jobs + multi-stop routes

-- Recurring job columns on jobs table
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS is_recurring_template BOOLEAN DEFAULT false;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS parent_job_id UUID REFERENCES jobs(id) ON DELETE SET NULL;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS recurrence_config JSONB DEFAULT NULL;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS instance_date DATE DEFAULT NULL;

-- Multi-stop routes table
CREATE TABLE IF NOT EXISTS job_stops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  stop_order INTEGER NOT NULL DEFAULT 0,
  address TEXT NOT NULL,
  notes TEXT,
  stop_type TEXT DEFAULT 'stop' CHECK (stop_type IN ('start', 'stop', 'end')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE job_stops ENABLE ROW LEVEL SECURITY;

CREATE POLICY "job_stops_company_isolation" ON job_stops
  FOR ALL USING (company_id = get_active_company_id());

-- Indexes
CREATE INDEX idx_job_stops_job_id ON job_stops(job_id);
CREATE INDEX idx_jobs_parent_job_id ON jobs(parent_job_id);
CREATE INDEX idx_jobs_is_recurring ON jobs(is_recurring_template) WHERE is_recurring_template = true;

-- Updated_at trigger
CREATE TRIGGER update_job_stops_updated_at
  BEFORE UPDATE ON job_stops
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
