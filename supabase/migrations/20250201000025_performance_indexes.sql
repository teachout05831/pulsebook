-- Performance indexes for common query patterns
-- Phase 3D: Add missing indexes to improve query planner efficiency
-- Uses DO blocks to safely skip indexes if tables/columns don't exist

-- Customers assigned_to lookups (sales goals, dispatch)
CREATE INDEX IF NOT EXISTS idx_customers_assigned_to ON customers(company_id, assigned_to);

-- Jobs parent_job_id lookups (recurring/child job queries)
CREATE INDEX IF NOT EXISTS idx_jobs_parent_job_id ON jobs(parent_job_id);

-- Estimates sent_at for date-range filtering (sales goals, dashboard)
CREATE INDEX IF NOT EXISTS idx_estimates_sent_at ON estimates(company_id, sent_at);

-- Invoices paid_at for date-range filtering (revenue queries, today stats)
CREATE INDEX IF NOT EXISTS idx_invoices_paid_at ON invoices(company_id, paid_at);

-- Follow-ups assigned_to lookups (today stats, follow-up lists)
DO $$ BEGIN
  CREATE INDEX IF NOT EXISTS idx_follow_ups_assigned_to ON follow_ups(company_id, assigned_to);
EXCEPTION WHEN undefined_table OR undefined_column THEN NULL;
END $$;

-- Custom field definitions active filter (custom fields form rendering)
DO $$ BEGIN
  CREATE INDEX IF NOT EXISTS idx_custom_field_defs_active ON custom_field_definitions(company_id, is_active);
EXCEPTION WHEN undefined_table OR undefined_column THEN NULL;
END $$;

-- Tags entity_type filter (tag picker, tag lists)
DO $$ BEGIN
  CREATE INDEX IF NOT EXISTS idx_tags_entity_type ON tags(company_id, entity_type);
EXCEPTION WHEN undefined_table OR undefined_column THEN NULL;
END $$;

-- RPC function to update page view tracking in a single query
-- Uses COALESCE to set first_viewed_at only if not already set
CREATE OR REPLACE FUNCTION update_page_view_tracking(page_id UUID, viewed_at TIMESTAMPTZ)
RETURNS void AS $$
BEGIN
  UPDATE estimate_pages
  SET
    last_viewed_at = viewed_at,
    first_viewed_at = COALESCE(first_viewed_at, viewed_at),
    status = CASE WHEN first_viewed_at IS NULL THEN 'viewed' ELSE status END
  WHERE id = page_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
