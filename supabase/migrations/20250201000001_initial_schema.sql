-- ============================================
-- ServicePro Initial Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- ============================================
-- 1. USERS TABLE (extends auth.users)
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  active_company_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. COMPANIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3. USER_COMPANIES JUNCTION TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS user_companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, company_id)
);

-- Add foreign key for active_company_id after companies table exists
ALTER TABLE users
ADD CONSTRAINT users_active_company_fkey
FOREIGN KEY (active_company_id) REFERENCES companies(id) ON DELETE SET NULL;

-- ============================================
-- 4. SERVICE_TYPES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS service_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  default_price DECIMAL(10,2),
  duration_minutes INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 5. TEAM_MEMBERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'technician' CHECK (role IN ('admin', 'office', 'technician')),
  color TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 6. CUSTOMERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  notes TEXT,
  tags TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 7. JOBS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  assigned_to UUID REFERENCES team_members(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'scheduled', 'in_progress', 'completed', 'cancelled')),
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  scheduled_start TIMESTAMPTZ,
  scheduled_end TIMESTAMPTZ,
  actual_start TIMESTAMPTZ,
  actual_end TIMESTAMPTZ,
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 8. ESTIMATES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS estimates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  job_id UUID REFERENCES jobs(id) ON DELETE SET NULL,
  estimate_number TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'viewed', 'approved', 'rejected', 'expired')),
  subtotal DECIMAL(10,2) DEFAULT 0,
  tax_rate DECIMAL(5,2) DEFAULT 0,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) DEFAULT 0,
  valid_until DATE,
  notes TEXT,
  terms TEXT,
  sent_at TIMESTAMPTZ,
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 9. ESTIMATE_ITEMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS estimate_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  estimate_id UUID NOT NULL REFERENCES estimates(id) ON DELETE CASCADE,
  service_type_id UUID REFERENCES service_types(id) ON DELETE SET NULL,
  description TEXT NOT NULL,
  quantity DECIMAL(10,2) DEFAULT 1,
  unit_price DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) DEFAULT 0,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 10. INVOICES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  job_id UUID REFERENCES jobs(id) ON DELETE SET NULL,
  estimate_id UUID REFERENCES estimates(id) ON DELETE SET NULL,
  invoice_number TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'viewed', 'paid', 'partial', 'overdue', 'cancelled')),
  subtotal DECIMAL(10,2) DEFAULT 0,
  tax_rate DECIMAL(5,2) DEFAULT 0,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) DEFAULT 0,
  amount_paid DECIMAL(10,2) DEFAULT 0,
  balance_due DECIMAL(10,2) DEFAULT 0,
  due_date DATE,
  notes TEXT,
  terms TEXT,
  sent_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 11. INVOICE_ITEMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  service_type_id UUID REFERENCES service_types(id) ON DELETE SET NULL,
  description TEXT NOT NULL,
  quantity DECIMAL(10,2) DEFAULT 1,
  unit_price DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) DEFAULT 0,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_user_companies_user_id ON user_companies(user_id);
CREATE INDEX IF NOT EXISTS idx_user_companies_company_id ON user_companies(company_id);
CREATE INDEX IF NOT EXISTS idx_customers_company_id ON customers(company_id);
CREATE INDEX IF NOT EXISTS idx_jobs_company_id ON jobs(company_id);
CREATE INDEX IF NOT EXISTS idx_jobs_customer_id ON jobs(customer_id);
CREATE INDEX IF NOT EXISTS idx_jobs_assigned_to ON jobs(assigned_to);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_estimates_company_id ON estimates(company_id);
CREATE INDEX IF NOT EXISTS idx_estimates_customer_id ON estimates(customer_id);
CREATE INDEX IF NOT EXISTS idx_invoices_company_id ON invoices(company_id);
CREATE INDEX IF NOT EXISTS idx_invoices_customer_id ON invoices(customer_id);
CREATE INDEX IF NOT EXISTS idx_service_types_company_id ON service_types(company_id);
CREATE INDEX IF NOT EXISTS idx_team_members_company_id ON team_members(company_id);

-- ============================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE estimates ENABLE ROW LEVEL SECURITY;
ALTER TABLE estimate_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES: USERS
-- ============================================
CREATE POLICY "Users can view own profile"
ON users FOR SELECT
USING (id = auth.uid());

CREATE POLICY "Users can update own profile"
ON users FOR UPDATE
USING (id = auth.uid());

CREATE POLICY "Users can insert own profile"
ON users FOR INSERT
WITH CHECK (id = auth.uid());

-- ============================================
-- RLS POLICIES: COMPANIES
-- ============================================
CREATE POLICY "Users can view their companies"
ON companies FOR SELECT
USING (
  id IN (SELECT company_id FROM user_companies WHERE user_id = auth.uid())
);

CREATE POLICY "Users can create companies"
ON companies FOR INSERT
WITH CHECK (true);

CREATE POLICY "Owners can update their companies"
ON companies FOR UPDATE
USING (
  id IN (
    SELECT company_id FROM user_companies
    WHERE user_id = auth.uid() AND role = 'owner'
  )
);

-- ============================================
-- RLS POLICIES: USER_COMPANIES
-- ============================================
CREATE POLICY "Users can view own memberships"
ON user_companies FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can create memberships for themselves"
ON user_companies FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Owners can manage company memberships"
ON user_companies FOR ALL
USING (
  company_id IN (
    SELECT company_id FROM user_companies
    WHERE user_id = auth.uid() AND role = 'owner'
  )
);

-- ============================================
-- RLS POLICIES: ACTIVE COMPANY FILTER
-- Helper function to get active company
-- ============================================
CREATE OR REPLACE FUNCTION get_active_company_id()
RETURNS UUID AS $$
  SELECT active_company_id FROM users WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER;

-- ============================================
-- RLS POLICIES: SERVICE_TYPES
-- ============================================
CREATE POLICY "Users can view service types in active company"
ON service_types FOR SELECT
USING (company_id = get_active_company_id());

CREATE POLICY "Users can insert service types in active company"
ON service_types FOR INSERT
WITH CHECK (company_id = get_active_company_id());

CREATE POLICY "Users can update service types in active company"
ON service_types FOR UPDATE
USING (company_id = get_active_company_id());

CREATE POLICY "Users can delete service types in active company"
ON service_types FOR DELETE
USING (company_id = get_active_company_id());

-- ============================================
-- RLS POLICIES: TEAM_MEMBERS
-- ============================================
CREATE POLICY "Users can view team members in active company"
ON team_members FOR SELECT
USING (company_id = get_active_company_id());

CREATE POLICY "Users can insert team members in active company"
ON team_members FOR INSERT
WITH CHECK (company_id = get_active_company_id());

CREATE POLICY "Users can update team members in active company"
ON team_members FOR UPDATE
USING (company_id = get_active_company_id());

CREATE POLICY "Users can delete team members in active company"
ON team_members FOR DELETE
USING (company_id = get_active_company_id());

-- ============================================
-- RLS POLICIES: CUSTOMERS
-- ============================================
CREATE POLICY "Users can view customers in active company"
ON customers FOR SELECT
USING (company_id = get_active_company_id());

CREATE POLICY "Users can insert customers in active company"
ON customers FOR INSERT
WITH CHECK (company_id = get_active_company_id());

CREATE POLICY "Users can update customers in active company"
ON customers FOR UPDATE
USING (company_id = get_active_company_id());

CREATE POLICY "Users can delete customers in active company"
ON customers FOR DELETE
USING (company_id = get_active_company_id());

-- ============================================
-- RLS POLICIES: JOBS
-- ============================================
CREATE POLICY "Users can view jobs in active company"
ON jobs FOR SELECT
USING (company_id = get_active_company_id());

CREATE POLICY "Users can insert jobs in active company"
ON jobs FOR INSERT
WITH CHECK (company_id = get_active_company_id());

CREATE POLICY "Users can update jobs in active company"
ON jobs FOR UPDATE
USING (company_id = get_active_company_id());

CREATE POLICY "Users can delete jobs in active company"
ON jobs FOR DELETE
USING (company_id = get_active_company_id());

-- ============================================
-- RLS POLICIES: ESTIMATES
-- ============================================
CREATE POLICY "Users can view estimates in active company"
ON estimates FOR SELECT
USING (company_id = get_active_company_id());

CREATE POLICY "Users can insert estimates in active company"
ON estimates FOR INSERT
WITH CHECK (company_id = get_active_company_id());

CREATE POLICY "Users can update estimates in active company"
ON estimates FOR UPDATE
USING (company_id = get_active_company_id());

CREATE POLICY "Users can delete estimates in active company"
ON estimates FOR DELETE
USING (company_id = get_active_company_id());

-- ============================================
-- RLS POLICIES: ESTIMATE_ITEMS
-- ============================================
CREATE POLICY "Users can view estimate items"
ON estimate_items FOR SELECT
USING (
  estimate_id IN (
    SELECT id FROM estimates WHERE company_id = get_active_company_id()
  )
);

CREATE POLICY "Users can insert estimate items"
ON estimate_items FOR INSERT
WITH CHECK (
  estimate_id IN (
    SELECT id FROM estimates WHERE company_id = get_active_company_id()
  )
);

CREATE POLICY "Users can update estimate items"
ON estimate_items FOR UPDATE
USING (
  estimate_id IN (
    SELECT id FROM estimates WHERE company_id = get_active_company_id()
  )
);

CREATE POLICY "Users can delete estimate items"
ON estimate_items FOR DELETE
USING (
  estimate_id IN (
    SELECT id FROM estimates WHERE company_id = get_active_company_id()
  )
);

-- ============================================
-- RLS POLICIES: INVOICES
-- ============================================
CREATE POLICY "Users can view invoices in active company"
ON invoices FOR SELECT
USING (company_id = get_active_company_id());

CREATE POLICY "Users can insert invoices in active company"
ON invoices FOR INSERT
WITH CHECK (company_id = get_active_company_id());

CREATE POLICY "Users can update invoices in active company"
ON invoices FOR UPDATE
USING (company_id = get_active_company_id());

CREATE POLICY "Users can delete invoices in active company"
ON invoices FOR DELETE
USING (company_id = get_active_company_id());

-- ============================================
-- RLS POLICIES: INVOICE_ITEMS
-- ============================================
CREATE POLICY "Users can view invoice items"
ON invoice_items FOR SELECT
USING (
  invoice_id IN (
    SELECT id FROM invoices WHERE company_id = get_active_company_id()
  )
);

CREATE POLICY "Users can insert invoice items"
ON invoice_items FOR INSERT
WITH CHECK (
  invoice_id IN (
    SELECT id FROM invoices WHERE company_id = get_active_company_id()
  )
);

CREATE POLICY "Users can update invoice items"
ON invoice_items FOR UPDATE
USING (
  invoice_id IN (
    SELECT id FROM invoices WHERE company_id = get_active_company_id()
  )
);

CREATE POLICY "Users can delete invoice items"
ON invoice_items FOR DELETE
USING (
  invoice_id IN (
    SELECT id FROM invoices WHERE company_id = get_active_company_id()
  )
);

-- ============================================
-- TRIGGER: Auto-create user profile on signup
-- ============================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================
-- TRIGGER: Update updated_at timestamp
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON companies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_jobs_updated_at
  BEFORE UPDATE ON jobs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_estimates_updated_at
  BEFORE UPDATE ON estimates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_invoices_updated_at
  BEFORE UPDATE ON invoices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_service_types_updated_at
  BEFORE UPDATE ON service_types
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_team_members_updated_at
  BEFORE UPDATE ON team_members
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
