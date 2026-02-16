-- =============================================
-- Scheduling Pages (Online Booking)
-- =============================================
-- Public-facing scheduling/booking pages built with PageBuilder
-- Phase 1: Page design + configuration only
-- Phase 2: Availability system + booking logic

CREATE TABLE IF NOT EXISTS scheduling_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  public_token TEXT UNIQUE NOT NULL,
  sections JSONB DEFAULT '[]'::jsonb,
  design_theme JSONB DEFAULT '{}'::jsonb,
  settings JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  published_at TIMESTAMPTZ,
  total_views INTEGER DEFAULT 0,
  total_bookings INTEGER DEFAULT 0,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(company_id, slug)
);

ALTER TABLE scheduling_pages ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_scheduling_pages_company ON scheduling_pages(company_id);
CREATE INDEX idx_scheduling_pages_token ON scheduling_pages(public_token);

-- Company users can CRUD their own scheduling pages
CREATE POLICY "scheduling_pages_company_access" ON scheduling_pages
  FOR ALL USING (company_id = get_active_company_id());

-- Public read by token (for /s/[token] page)
CREATE POLICY "scheduling_pages_public_read" ON scheduling_pages
  FOR SELECT USING (status = 'published' AND is_active = true);
