-- Migration 017: Sales Asset Library - extend video categories
-- Add 'case_study' and 'other' to estimate_videos category CHECK

ALTER TABLE estimate_videos
  DROP CONSTRAINT IF EXISTS estimate_videos_category_check;

ALTER TABLE estimate_videos
  ADD CONSTRAINT estimate_videos_category_check
  CHECK (category IN ('intro', 'testimonial', 'process', 'site_visit', 'before_after', 'personal_message', 'case_study', 'other'));
