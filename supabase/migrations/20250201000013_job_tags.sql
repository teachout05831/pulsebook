-- =============================================
-- Migration 011: Job Tags + Entity Type
-- =============================================
-- Adds entity_type to tags table to support separate
-- customer tags (WHO) and job tags (WHAT).
-- Also adds tags column to jobs table.

-- 1. Create tags table if it doesn't exist (from migration 007)
CREATE TABLE IF NOT EXISTS tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#6B7280',
  source TEXT DEFAULT 'local' CHECK (source IN ('local', 'external')),
  external_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

-- RLS policy (safe to create if not exists via DO block)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'tags' AND policyname = 'tags_company_isolation'
  ) THEN
    CREATE POLICY "tags_company_isolation" ON tags
      FOR ALL USING (company_id = get_active_company_id());
  END IF;
END $$;

-- 2. Add entity_type column to tags
ALTER TABLE tags ADD COLUMN IF NOT EXISTS entity_type TEXT DEFAULT 'customer'
  CHECK (entity_type IN ('customer', 'job'));

-- 3. Update unique constraint: allow same tag name across entity types
DROP INDEX IF EXISTS idx_tags_company_name;
CREATE UNIQUE INDEX IF NOT EXISTS idx_tags_company_name_type ON tags(company_id, name, entity_type);

-- 4. Add tags column to jobs table
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
