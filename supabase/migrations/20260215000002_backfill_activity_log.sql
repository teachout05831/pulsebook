-- Performance indexes for customer stats page (covers customer_id + status queries)
CREATE INDEX IF NOT EXISTS idx_jobs_customer_status ON jobs(customer_id, status);
CREATE INDEX IF NOT EXISTS idx_estimates_customer_status ON estimates(customer_id, status);
CREATE INDEX IF NOT EXISTS idx_invoices_customer_status ON invoices(customer_id, status);

-- Backfill activity_log entries with customer names and richer descriptions
-- This fixes old entries that have null customer_name and generic descriptions

-- 1. Backfill customer_name for job activities (where customer_id is on the job)
UPDATE activity_log al
SET customer_name = c.name,
    customer_id = COALESCE(al.customer_id, j.customer_id)
FROM jobs j
JOIN customers c ON c.id = j.customer_id
WHERE al.entity_type = 'job'
  AND al.entity_id = j.id
  AND al.customer_name IS NULL
  AND j.customer_id IS NOT NULL;

-- 2. Backfill customer_name for estimate activities
UPDATE activity_log al
SET customer_name = c.name,
    customer_id = COALESCE(al.customer_id, e.customer_id)
FROM estimates e
JOIN customers c ON c.id = e.customer_id
WHERE al.entity_type = 'estimate'
  AND al.entity_id = e.id
  AND al.customer_name IS NULL
  AND e.customer_id IS NOT NULL;

-- 3. Enrich generic job descriptions with job title
-- "Job updated" → "Job <strong>Title</strong> updated — fields"
UPDATE activity_log al
SET description = 'Job <strong>' || j.title || '</strong> updated'
FROM jobs j
WHERE al.entity_type = 'job'
  AND al.action = 'updated'
  AND al.entity_id = j.id
  AND al.description = 'Job updated'
  AND j.title IS NOT NULL;

-- 4. Enrich generic job status_changed descriptions
-- "Job status changed to <strong>X</strong>" → "Job <strong>Title</strong> changed to <strong>X</strong>"
UPDATE activity_log al
SET description = 'Job <strong>' || j.title || '</strong> changed to <strong>' || (al.metadata->>'newStatus') || '</strong>'
FROM jobs j
WHERE al.entity_type = 'job'
  AND al.action = 'status_changed'
  AND al.entity_id = j.id
  AND al.description LIKE 'Job status changed to%'
  AND al.metadata->>'newStatus' IS NOT NULL
  AND j.title IS NOT NULL;

-- 5. Enrich generic estimate descriptions with estimate number
-- "Estimate updated" → "Estimate <strong>#123</strong> updated"
UPDATE activity_log al
SET description = 'Estimate <strong>#' || e.estimate_number || '</strong> updated'
FROM estimates e
WHERE al.entity_type = 'estimate'
  AND al.action = 'updated'
  AND al.entity_id = e.id
  AND al.description = 'Estimate updated'
  AND e.estimate_number IS NOT NULL;

-- 6. Enrich generic estimate status_changed descriptions
UPDATE activity_log al
SET description = 'Estimate <strong>#' || e.estimate_number || '</strong> changed to <strong>' || (al.metadata->>'newStatus') || '</strong>'
FROM estimates e
WHERE al.entity_type = 'estimate'
  AND al.action = 'status_changed'
  AND al.entity_id = e.id
  AND al.description LIKE 'Estimate status changed to%'
  AND al.metadata->>'newStatus' IS NOT NULL
  AND e.estimate_number IS NOT NULL;

-- 7. Backfill amount for job activities that are missing it
UPDATE activity_log al
SET amount = j.total
FROM jobs j
WHERE al.entity_type = 'job'
  AND al.entity_id = j.id
  AND al.amount IS NULL
  AND j.total IS NOT NULL
  AND j.total > 0;

-- 8. Backfill amount for estimate activities that are missing it
UPDATE activity_log al
SET amount = e.total
FROM estimates e
WHERE al.entity_type = 'estimate'
  AND al.entity_id = e.id
  AND al.amount IS NULL
  AND e.total IS NOT NULL
  AND e.total > 0;
