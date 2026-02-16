-- =============================================
-- Migration 007: Custom Field Definitions & Tags
-- =============================================

-- Custom field definitions (company-level schema for dynamic fields)
CREATE TABLE IF NOT EXISTS custom_field_definitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('customer', 'job')),
  section TEXT NOT NULL DEFAULT 'General',
  field_key TEXT NOT NULL,
  label TEXT NOT NULL,
  field_type TEXT NOT NULL CHECK (field_type IN (
    'text', 'textarea', 'number', 'select', 'date', 'checkbox', 'email', 'phone', 'url'
  )),
  options TEXT[],
  is_required BOOLEAN DEFAULT false,
  placeholder TEXT,
  sort_order INTEGER DEFAULT 0,
  section_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE custom_field_definitions ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_custom_field_defs_company ON custom_field_definitions(company_id);
CREATE INDEX idx_custom_field_defs_entity ON custom_field_definitions(company_id, entity_type);
CREATE UNIQUE INDEX idx_custom_field_defs_key ON custom_field_definitions(company_id, entity_type, field_key);

CREATE POLICY "custom_field_definitions_company_isolation" ON custom_field_definitions
  FOR ALL USING (company_id = get_active_company_id());

-- Tags table (local + future external sync)
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

CREATE UNIQUE INDEX idx_tags_company_name ON tags(company_id, name);

CREATE POLICY "tags_company_isolation" ON tags
  FOR ALL USING (company_id = get_active_company_id());
