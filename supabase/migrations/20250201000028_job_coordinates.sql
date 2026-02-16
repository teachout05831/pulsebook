-- Add latitude/longitude columns to jobs table for cached geocoding
-- Coordinates are populated on job create/update (write-time geocoding)
-- so the dispatch API doesn't need to geocode at read-time

ALTER TABLE jobs ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION;

-- Index for filtering jobs that have coordinates (map view)
CREATE INDEX IF NOT EXISTS idx_jobs_coordinates
  ON jobs (company_id)
  WHERE latitude IS NOT NULL AND longitude IS NOT NULL;
