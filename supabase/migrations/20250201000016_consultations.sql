-- =============================================
-- Video Consultations
-- =============================================
-- Standalone video consultation rooms with
-- Daily.co integration and public token access.
-- Can be linked to customers and/or estimates.

CREATE TABLE IF NOT EXISTS consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id),
  estimate_id UUID REFERENCES estimates(id),

  -- Consultation info
  title TEXT NOT NULL DEFAULT 'Video Consultation',
  purpose TEXT CHECK (purpose IN ('discovery', 'estimate_review', 'follow_up')),

  -- Public access
  public_token TEXT UNIQUE NOT NULL,

  -- Daily.co room
  daily_room_name TEXT,
  daily_room_url TEXT,

  -- Lifecycle
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'active', 'completed', 'cancelled', 'expired')),
  scheduled_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  duration_seconds INTEGER,
  expires_at TIMESTAMPTZ,

  -- Host info (company user who created it)
  host_user_id UUID REFERENCES auth.users(id),
  host_name TEXT,

  -- Customer info (denormalized for public page display)
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_consultations_company ON consultations(company_id);
CREATE INDEX idx_consultations_token ON consultations(public_token);
CREATE INDEX idx_consultations_customer ON consultations(customer_id);

-- Company users can CRUD their own consultations
CREATE POLICY "consultations_company_isolation" ON consultations
  FOR ALL USING (company_id = get_active_company_id());

-- Public read by token (for /c/[token] page)
CREATE POLICY "consultations_public_read" ON consultations
  FOR SELECT USING (true);
