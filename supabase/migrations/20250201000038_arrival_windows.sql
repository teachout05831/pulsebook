-- Add arrival_window column to jobs
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS arrival_window text;
