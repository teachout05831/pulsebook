-- =============================================
-- Universal Blocks (Global Sections)
-- =============================================
-- Reusable section blocks that sync across
-- estimate pages, scheduling pages, and
-- consultation widgets.

CREATE TABLE IF NOT EXISTS universal_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  section_type TEXT NOT NULL,
  settings JSONB DEFAULT '{}'::jsonb,
  content JSONB DEFAULT '{}'::jsonb,
  usage_count INTEGER DEFAULT 0,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE universal_blocks ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_ub_company ON universal_blocks(company_id);

CREATE POLICY "ub_company_access" ON universal_blocks
  FOR ALL USING (company_id = get_active_company_id());
