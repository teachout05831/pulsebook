-- ============================================
-- TECH PORTAL: Index for fast team_member lookup by auth user_id
-- Used on every tech API call to identify the logged-in technician
-- ============================================
CREATE INDEX IF NOT EXISTS idx_team_members_user_id ON team_members(user_id) WHERE user_id IS NOT NULL;
