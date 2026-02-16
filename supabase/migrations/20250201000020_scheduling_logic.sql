-- Scheduling Logic System — Phase 2A
-- Tables: scheduling_config, booking_requests, crews, service_zones,
--         zone_travel_times, technician_availability, technician_time_off

-- 1. scheduling_config (one per company)
CREATE TABLE IF NOT EXISTS scheduling_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  priority_mode TEXT NOT NULL DEFAULT 'balanced' CHECK (priority_mode IN ('location_first', 'crew_first', 'balanced')),
  priority_weights JSONB NOT NULL DEFAULT '{"crew": 0.40, "location": 0.35, "workload": 0.25}',
  team_mode TEXT NOT NULL DEFAULT 'crew_based' CHECK (team_mode IN ('crew_based', 'technician_based')),
  crews_per_day INTEGER NOT NULL DEFAULT 3,
  max_jobs_per_crew INTEGER NOT NULL DEFAULT 6,
  buffer_minutes INTEGER NOT NULL DEFAULT 30,
  default_duration_min INTEGER NOT NULL DEFAULT 60,
  booking_window_days INTEGER NOT NULL DEFAULT 28,
  min_notice_hours INTEGER NOT NULL DEFAULT 24,
  time_slot_mode TEXT NOT NULL DEFAULT 'exact' CHECK (time_slot_mode IN ('exact', 'window')),
  auto_confirm BOOLEAN NOT NULL DEFAULT true,
  waitlist_enabled BOOLEAN NOT NULL DEFAULT true,
  crew_override_enabled BOOLEAN NOT NULL DEFAULT false,
  zone_enforcement TEXT NOT NULL DEFAULT 'soft' CHECK (zone_enforcement IN ('soft', 'strict', 'off')),
  payment_required BOOLEAN NOT NULL DEFAULT false,
  payment_type TEXT DEFAULT 'deposit_flat' CHECK (payment_type IN ('deposit_flat', 'deposit_pct', 'full')),
  deposit_amount DECIMAL(10,2) DEFAULT 0,
  cancellation_hours INTEGER DEFAULT 24,
  business_hours JSONB NOT NULL DEFAULT '{
    "monday": {"enabled": true, "start": "08:00", "end": "17:00"},
    "tuesday": {"enabled": true, "start": "08:00", "end": "17:00"},
    "wednesday": {"enabled": true, "start": "08:00", "end": "17:00"},
    "thursday": {"enabled": true, "start": "08:00", "end": "17:00"},
    "friday": {"enabled": true, "start": "08:00", "end": "17:00"},
    "saturday": {"enabled": false, "start": "09:00", "end": "13:00"},
    "sunday": {"enabled": false, "start": "09:00", "end": "13:00"}
  }',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(company_id)
);

ALTER TABLE scheduling_config ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_scheduling_config_company ON scheduling_config(company_id);

CREATE POLICY "scheduling_config_company_access" ON scheduling_config
  FOR ALL USING (company_id = get_active_company_id());

-- 2. booking_requests (every booking attempt)
CREATE TABLE IF NOT EXISTS booking_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  scheduling_page_id UUID REFERENCES scheduling_pages(id) ON DELETE SET NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  job_id UUID REFERENCES jobs(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_phone TEXT,
  customer_address TEXT,
  service_type_id UUID,
  preferred_date DATE NOT NULL,
  preferred_time TEXT NOT NULL,
  date_flexibility TEXT NOT NULL DEFAULT 'flexible' CHECK (date_flexibility IN ('must_have', 'flexible')),
  preferred_crew_id UUID,
  assigned_crew_id UUID,
  assigned_team_member_id UUID,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'waitlisted', 'declined', 'cancelled', 'completed', 'no_show')),
  confirmed_date DATE,
  confirmed_time TIME,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  score DECIMAL(6,2),
  scoring_explanation JSONB,
  payment_status TEXT NOT NULL DEFAULT 'none' CHECK (payment_status IN ('none', 'pending', 'paid', 'refunded')),
  payment_amount DECIMAL(10,2) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE booking_requests ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_booking_requests_company ON booking_requests(company_id);
CREATE INDEX idx_booking_requests_date_status ON booking_requests(company_id, preferred_date, status);
CREATE INDEX idx_booking_requests_customer ON booking_requests(customer_id);

CREATE POLICY "booking_requests_company_access" ON booking_requests
  FOR ALL USING (company_id = get_active_company_id());

-- Public insert policy for customer-facing booking page
CREATE POLICY "booking_requests_public_insert" ON booking_requests
  FOR INSERT WITH CHECK (true);

-- 3. crews
CREATE TABLE IF NOT EXISTS crews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#3b82f6',
  leader_id UUID,
  member_ids UUID[] DEFAULT '{}',
  zone_id UUID,
  specializations TEXT[] DEFAULT '{}',
  max_hours_per_day INTEGER NOT NULL DEFAULT 8,
  max_jobs_per_day INTEGER NOT NULL DEFAULT 6,
  vehicle_name TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE crews ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_crews_company ON crews(company_id);

CREATE POLICY "crews_company_access" ON crews
  FOR ALL USING (company_id = get_active_company_id());

-- 4. service_zones
CREATE TABLE IF NOT EXISTS service_zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#3b82f6',
  zip_codes TEXT[] DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE service_zones ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_service_zones_company ON service_zones(company_id);

CREATE POLICY "service_zones_company_access" ON service_zones
  FOR ALL USING (company_id = get_active_company_id());

-- 5. zone_travel_times
CREATE TABLE IF NOT EXISTS zone_travel_times (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  from_zone_id UUID NOT NULL REFERENCES service_zones(id) ON DELETE CASCADE,
  to_zone_id UUID NOT NULL REFERENCES service_zones(id) ON DELETE CASCADE,
  travel_minutes INTEGER NOT NULL DEFAULT 15,
  UNIQUE(company_id, from_zone_id, to_zone_id)
);

ALTER TABLE zone_travel_times ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_zone_travel_company ON zone_travel_times(company_id);

CREATE POLICY "zone_travel_times_company_access" ON zone_travel_times
  FOR ALL USING (company_id = get_active_company_id());

-- 6. technician_availability (weekly recurring schedule)
CREATE TABLE IF NOT EXISTS technician_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  team_member_id UUID NOT NULL REFERENCES team_members(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME NOT NULL DEFAULT '08:00',
  end_time TIME NOT NULL DEFAULT '17:00',
  is_available BOOLEAN NOT NULL DEFAULT true,
  max_jobs INTEGER NOT NULL DEFAULT 6,
  UNIQUE(company_id, team_member_id, day_of_week)
);

ALTER TABLE technician_availability ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_tech_avail_company ON technician_availability(company_id);

CREATE POLICY "tech_availability_company_access" ON technician_availability
  FOR ALL USING (company_id = get_active_company_id());

-- 7. technician_time_off
CREATE TABLE IF NOT EXISTS technician_time_off (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  team_member_id UUID NOT NULL REFERENCES team_members(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE technician_time_off ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_tech_timeoff_company ON technician_time_off(company_id);
CREATE INDEX idx_tech_timeoff_dates ON technician_time_off(team_member_id, start_date, end_date);

CREATE POLICY "tech_time_off_company_access" ON technician_time_off
  FOR ALL USING (company_id = get_active_company_id());
