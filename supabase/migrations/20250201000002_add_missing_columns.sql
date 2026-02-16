-- ============================================
-- Migration 002: Add missing columns to support API features
-- Created: 2026-02-02
-- ============================================

-- ============================================
-- 1. CUSTOMERS TABLE - Add lead tracking and address field
-- ============================================

-- Add status column for customer lifecycle (active, inactive, lead)
ALTER TABLE customers ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active'
  CHECK (status IN ('active', 'inactive', 'lead'));

-- Add lead tracking columns
ALTER TABLE customers ADD COLUMN IF NOT EXISTS lead_status TEXT
  CHECK (lead_status IS NULL OR lead_status IN ('new', 'contacted', 'qualified', 'proposal', 'won', 'lost'));
ALTER TABLE customers ADD COLUMN IF NOT EXISTS source TEXT;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS estimated_value DECIMAL(10,2);
ALTER TABLE customers ADD COLUMN IF NOT EXISTS service_type TEXT;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS service_date DATE;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS last_contact_date TIMESTAMPTZ;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS assigned_to UUID REFERENCES team_members(id) ON DELETE SET NULL;

-- Add single address field (combines address_line1, city, state, zip for display)
ALTER TABLE customers ADD COLUMN IF NOT EXISTS address TEXT;

-- Add custom_fields for extensibility
ALTER TABLE customers ADD COLUMN IF NOT EXISTS custom_fields JSONB DEFAULT '{}';

-- ============================================
-- 2. JOBS TABLE - Add scheduling fields for dispatch
-- ============================================

-- Add scheduled_date and scheduled_time (separate from scheduled_start timestamp)
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS scheduled_date DATE;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS scheduled_time TIME;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS estimated_duration INTEGER DEFAULT 60; -- in minutes

-- Add single address field for display
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS address TEXT;

-- Add custom_fields for extensibility
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS custom_fields JSONB DEFAULT '{}';

-- ============================================
-- 3. ESTIMATES TABLE - Add line items and dates
-- ============================================

-- Add line_items JSONB column for storing estimate items
ALTER TABLE estimates ADD COLUMN IF NOT EXISTS line_items JSONB DEFAULT '[]';

-- Add issue_date and expiry_date
ALTER TABLE estimates ADD COLUMN IF NOT EXISTS issue_date DATE DEFAULT CURRENT_DATE;
ALTER TABLE estimates ADD COLUMN IF NOT EXISTS expiry_date DATE;

-- Add address for estimate location
ALTER TABLE estimates ADD COLUMN IF NOT EXISTS address TEXT;

-- ============================================
-- 4. INVOICES TABLE - Add line items and payments
-- ============================================

-- Add line_items JSONB column for storing invoice items
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS line_items JSONB DEFAULT '[]';

-- Add payments JSONB column for tracking payments
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS payments JSONB DEFAULT '[]';

-- Add amount_due (calculated field, but useful for filtering)
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS amount_due DECIMAL(10,2) DEFAULT 0;

-- Add address for invoice location
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS address TEXT;

-- ============================================
-- 5. CREATE INDEXES FOR PERFORMANCE
-- ============================================

-- Customers indexes
CREATE INDEX IF NOT EXISTS idx_customers_status ON customers(status);
CREATE INDEX IF NOT EXISTS idx_customers_lead_status ON customers(lead_status);
CREATE INDEX IF NOT EXISTS idx_customers_assigned_to ON customers(assigned_to);

-- Jobs indexes
CREATE INDEX IF NOT EXISTS idx_jobs_scheduled_date ON jobs(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_jobs_scheduled_time ON jobs(scheduled_time);

-- ============================================
-- 6. UPDATE RLS POLICIES (if needed)
-- ============================================

-- The existing RLS policies should still work since they're based on company_id
-- No changes needed unless we want to add assigned_to filtering
