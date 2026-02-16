-- Change follow_ups.due_date from DATE to TIMESTAMPTZ
-- Enables storing specific follow-up times (not just dates)
-- Existing DATE values convert to midnight UTC automatically

ALTER TABLE follow_ups
  ALTER COLUMN due_date TYPE TIMESTAMPTZ
  USING due_date::TIMESTAMPTZ;
