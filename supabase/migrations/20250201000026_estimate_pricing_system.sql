-- =============================================
-- Estimate Pricing System
-- =============================================
-- Adds service catalog, materials catalog, estimate locations,
-- estimate tasks, and pricing-related columns to estimates.

-- =============================================
-- 1. SERVICE CATALOG
-- =============================================
CREATE TABLE IF NOT EXISTS service_catalog (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'primary' CHECK (category IN ('primary', 'additional', 'trip_fee')),
  pricing_model TEXT NOT NULL DEFAULT 'flat' CHECK (pricing_model IN ('hourly', 'flat', 'per_unit')),
  default_price DECIMAL(10,2) DEFAULT 0,
  unit_label TEXT,
  is_taxable BOOLEAN NOT NULL DEFAULT true,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE service_catalog ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_service_catalog_company ON service_catalog(company_id);

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'service_catalog_company_isolation' AND tablename = 'service_catalog') THEN
    CREATE POLICY "service_catalog_company_isolation" ON service_catalog FOR ALL USING (company_id = get_active_company_id());
  END IF;
END $$;

-- =============================================
-- 2. MATERIALS CATALOG
-- =============================================
CREATE TABLE IF NOT EXISTS materials_catalog (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  unit_price DECIMAL(10,2) DEFAULT 0,
  unit_label TEXT NOT NULL DEFAULT 'each',
  sku TEXT,
  is_taxable BOOLEAN NOT NULL DEFAULT true,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE materials_catalog ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_materials_catalog_company ON materials_catalog(company_id);

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'materials_catalog_company_isolation' AND tablename = 'materials_catalog') THEN
    CREATE POLICY "materials_catalog_company_isolation" ON materials_catalog FOR ALL USING (company_id = get_active_company_id());
  END IF;
END $$;

-- =============================================
-- 3. ESTIMATE TABLE ADDITIONS
-- =============================================
ALTER TABLE estimates ADD COLUMN IF NOT EXISTS pricing_model TEXT DEFAULT 'flat';
ALTER TABLE estimates ADD COLUMN IF NOT EXISTS binding_type TEXT DEFAULT 'non_binding';
ALTER TABLE estimates ADD COLUMN IF NOT EXISTS source TEXT;
ALTER TABLE estimates ADD COLUMN IF NOT EXISTS lead_status TEXT;
ALTER TABLE estimates ADD COLUMN IF NOT EXISTS service_type TEXT;
ALTER TABLE estimates ADD COLUMN IF NOT EXISTS sales_person_id UUID REFERENCES team_members(id) ON DELETE SET NULL;
ALTER TABLE estimates ADD COLUMN IF NOT EXISTS estimator_id UUID REFERENCES team_members(id) ON DELETE SET NULL;
ALTER TABLE estimates ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE estimates ADD COLUMN IF NOT EXISTS scheduled_date DATE;
ALTER TABLE estimates ADD COLUMN IF NOT EXISTS scheduled_time TIME;
ALTER TABLE estimates ADD COLUMN IF NOT EXISTS internal_notes TEXT;
ALTER TABLE estimates ADD COLUMN IF NOT EXISTS customer_notes TEXT;
ALTER TABLE estimates ADD COLUMN IF NOT EXISTS crew_notes TEXT;
ALTER TABLE estimates ADD COLUMN IF NOT EXISTS crew_feedback TEXT;
ALTER TABLE estimates ADD COLUMN IF NOT EXISTS resources JSONB DEFAULT '{}';
ALTER TABLE estimates ADD COLUMN IF NOT EXISTS deposit_type TEXT;
ALTER TABLE estimates ADD COLUMN IF NOT EXISTS deposit_amount DECIMAL(10,2);
ALTER TABLE estimates ADD COLUMN IF NOT EXISTS deposit_paid DECIMAL(10,2) DEFAULT 0;
ALTER TABLE estimates ADD COLUMN IF NOT EXISTS custom_fields JSONB DEFAULT '{}';

CREATE INDEX IF NOT EXISTS idx_estimates_pricing_model ON estimates(pricing_model);
CREATE INDEX IF NOT EXISTS idx_estimates_sales_person ON estimates(sales_person_id) WHERE sales_person_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_estimates_estimator ON estimates(estimator_id) WHERE estimator_id IS NOT NULL;

-- =============================================
-- 4. ESTIMATE LOCATIONS
-- =============================================
CREATE TABLE IF NOT EXISTS estimate_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  estimate_id UUID NOT NULL REFERENCES estimates(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  location_type TEXT NOT NULL DEFAULT 'service_location' CHECK (location_type IN ('origin', 'destination', 'stop', 'service_location')),
  label TEXT,
  address TEXT NOT NULL,
  city TEXT,
  state TEXT,
  zip TEXT,
  property_type TEXT,
  access_notes TEXT,
  lat DECIMAL(10,8),
  lng DECIMAL(11,8),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE estimate_locations ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_estimate_locations_estimate ON estimate_locations(estimate_id);

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'estimate_locations_company_isolation' AND tablename = 'estimate_locations') THEN
    CREATE POLICY "estimate_locations_company_isolation" ON estimate_locations FOR ALL USING (company_id = get_active_company_id());
  END IF;
END $$;

-- =============================================
-- 5. ESTIMATE TASKS
-- =============================================
CREATE TABLE IF NOT EXISTS estimate_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  estimate_id UUID NOT NULL REFERENCES estimates(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  due_date DATE,
  assigned_to UUID REFERENCES team_members(id) ON DELETE SET NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE estimate_tasks ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_estimate_tasks_estimate ON estimate_tasks(estimate_id);

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'estimate_tasks_company_isolation' AND tablename = 'estimate_tasks') THEN
    CREATE POLICY "estimate_tasks_company_isolation" ON estimate_tasks FOR ALL USING (company_id = get_active_company_id());
  END IF;
END $$;
