-- ============================================
-- REPORTS TEST DATA SEED SCRIPT
-- ============================================
-- This script adds realistic test data for the reports page
-- Run this against your Supabase database to test reports functionality

-- IMPORTANT: Replace 'YOUR_COMPANY_ID_HERE' with your actual company ID
-- You can get this by running: SELECT id FROM companies LIMIT 1;

DO $$
DECLARE
  v_company_id UUID;
  v_customer1_id UUID;
  v_customer2_id UUID;
  v_customer3_id UUID;
  v_customer4_id UUID;
  v_customer5_id UUID;
  v_job1_id UUID;
  v_job2_id UUID;
  v_job3_id UUID;
  v_job4_id UUID;
  v_job5_id UUID;
  v_job6_id UUID;
  v_job7_id UUID;
  v_job8_id UUID;
BEGIN
  -- Get the first company (or replace with your specific company ID)
  SELECT id INTO v_company_id FROM companies LIMIT 1;

  IF v_company_id IS NULL THEN
    RAISE EXCEPTION 'No company found. Please create a company first.';
  END IF;

  RAISE NOTICE 'Using company ID: %', v_company_id;

  -- ============================================
  -- CREATE TEST CUSTOMERS
  -- ============================================

  INSERT INTO customers (id, company_id, name, email, phone, city, state, is_active)
  VALUES
    (gen_random_uuid(), v_company_id, 'Acme Corporation', 'contact@acme.com', '555-0100', 'New York', 'NY', true)
  RETURNING id INTO v_customer1_id;

  INSERT INTO customers (id, company_id, name, email, phone, city, state, is_active)
  VALUES
    (gen_random_uuid(), v_company_id, 'Tech Solutions Inc', 'info@techsolutions.com', '555-0101', 'San Francisco', 'CA', true)
  RETURNING id INTO v_customer2_id;

  INSERT INTO customers (id, company_id, name, email, phone, city, state, is_active)
  VALUES
    (gen_random_uuid(), v_company_id, 'Global Services LLC', 'hello@globalservices.com', '555-0102', 'Chicago', 'IL', true)
  RETURNING id INTO v_customer3_id;

  INSERT INTO customers (id, company_id, name, email, phone, city, state, is_active)
  VALUES
    (gen_random_uuid(), v_company_id, 'Premier Properties', 'contact@premierprops.com', '555-0103', 'Miami', 'FL', true)
  RETURNING id INTO v_customer4_id;

  INSERT INTO customers (id, company_id, name, email, phone, city, state, is_active)
  VALUES
    (gen_random_uuid(), v_company_id, 'Downtown Retail Co', 'info@downtownretail.com', '555-0104', 'Seattle', 'WA', true)
  RETURNING id INTO v_customer5_id;

  RAISE NOTICE 'Created 5 test customers';

  -- ============================================
  -- CREATE TEST JOBS WITH DIFFERENT STATUSES AND DATES
  -- ============================================

  -- THIS MONTH - Completed jobs
  INSERT INTO jobs (id, company_id, customer_id, title, description, status, scheduled_date, scheduled_start, scheduled_end)
  VALUES
    (gen_random_uuid(), v_company_id, v_customer1_id, 'HVAC System Maintenance', 'Quarterly maintenance check', 'completed', CURRENT_DATE - INTERVAL '5 days', CURRENT_DATE - INTERVAL '5 days', CURRENT_DATE - INTERVAL '5 days')
  RETURNING id INTO v_job1_id;

  INSERT INTO jobs (id, company_id, customer_id, title, description, status, scheduled_date, scheduled_start, scheduled_end)
  VALUES
    (gen_random_uuid(), v_company_id, v_customer2_id, 'Plumbing Repair', 'Fix leaking pipes', 'completed', CURRENT_DATE - INTERVAL '10 days', CURRENT_DATE - INTERVAL '10 days', CURRENT_DATE - INTERVAL '10 days')
  RETURNING id INTO v_job2_id;

  INSERT INTO jobs (id, company_id, customer_id, title, description, status, scheduled_date, scheduled_start, scheduled_end)
  VALUES
    (gen_random_uuid(), v_company_id, v_customer3_id, 'Electrical Inspection', 'Annual safety inspection', 'completed', CURRENT_DATE - INTERVAL '15 days', CURRENT_DATE - INTERVAL '15 days', CURRENT_DATE - INTERVAL '15 days')
  RETURNING id INTO v_job3_id;

  -- THIS MONTH - In Progress
  INSERT INTO jobs (id, company_id, customer_id, title, description, status, scheduled_date, scheduled_start, scheduled_end)
  VALUES
    (gen_random_uuid(), v_company_id, v_customer4_id, 'Roof Repair', 'Emergency roof patch', 'in_progress', CURRENT_DATE - INTERVAL '2 days', CURRENT_DATE - INTERVAL '2 days', CURRENT_DATE)
  RETURNING id INTO v_job4_id;

  -- THIS MONTH - Scheduled (upcoming)
  INSERT INTO jobs (id, company_id, customer_id, title, description, status, scheduled_date, scheduled_start, scheduled_end)
  VALUES
    (gen_random_uuid(), v_company_id, v_customer5_id, 'Carpet Cleaning', 'Deep clean office carpets', 'scheduled', CURRENT_DATE + INTERVAL '3 days', CURRENT_DATE + INTERVAL '3 days', CURRENT_DATE + INTERVAL '3 days')
  RETURNING id INTO v_job5_id;

  INSERT INTO jobs (id, company_id, customer_id, title, description, status, scheduled_date, scheduled_start, scheduled_end)
  VALUES
    (gen_random_uuid(), v_company_id, v_customer1_id, 'Window Washing', 'Exterior window cleaning', 'scheduled', CURRENT_DATE + INTERVAL '7 days', CURRENT_DATE + INTERVAL '7 days', CURRENT_DATE + INTERVAL '7 days')
  RETURNING id INTO v_job6_id;

  -- LAST MONTH - Completed
  INSERT INTO jobs (id, company_id, customer_id, title, description, status, scheduled_date, scheduled_start, scheduled_end)
  VALUES
    (gen_random_uuid(), v_company_id, v_customer2_id, 'Generator Servicing', 'Backup generator maintenance', 'completed', CURRENT_DATE - INTERVAL '35 days', CURRENT_DATE - INTERVAL '35 days', CURRENT_DATE - INTERVAL '35 days')
  RETURNING id INTO v_job7_id;

  -- LAST MONTH - Cancelled
  INSERT INTO jobs (id, company_id, customer_id, title, description, status, scheduled_date, scheduled_start, scheduled_end)
  VALUES
    (gen_random_uuid(), v_company_id, v_customer3_id, 'Landscaping Service', 'Monthly landscaping', 'cancelled', CURRENT_DATE - INTERVAL '40 days', CURRENT_DATE - INTERVAL '40 days', CURRENT_DATE - INTERVAL '40 days')
  RETURNING id INTO v_job8_id;

  RAISE NOTICE 'Created 8 test jobs';

  -- ============================================
  -- CREATE TEST INVOICES WITH DIFFERENT STATUSES
  -- ============================================

  -- PAID INVOICES (for revenue calculations)
  INSERT INTO invoices (company_id, customer_id, job_id, invoice_number, status, issue_date, due_date, subtotal, tax_rate, tax_amount, total, amount_paid, amount_due)
  VALUES
    (v_company_id, v_customer1_id, v_job1_id, 'INV-2026-001', 'paid', CURRENT_DATE - INTERVAL '5 days', CURRENT_DATE + INTERVAL '25 days', 1200.00, 8.00, 96.00, 1296.00, 1296.00, 0.00);

  INSERT INTO invoices (company_id, customer_id, job_id, invoice_number, status, issue_date, due_date, subtotal, tax_rate, tax_amount, total, amount_paid, amount_due)
  VALUES
    (v_company_id, v_customer2_id, v_job2_id, 'INV-2026-002', 'paid', CURRENT_DATE - INTERVAL '10 days', CURRENT_DATE + INTERVAL '20 days', 850.00, 8.00, 68.00, 918.00, 918.00, 0.00);

  INSERT INTO invoices (company_id, customer_id, job_id, invoice_number, status, issue_date, due_date, subtotal, tax_rate, tax_amount, total, amount_paid, amount_due)
  VALUES
    (v_company_id, v_customer3_id, v_job3_id, 'INV-2026-003', 'paid', CURRENT_DATE - INTERVAL '15 days', CURRENT_DATE + INTERVAL '15 days', 2500.00, 8.00, 200.00, 2700.00, 2700.00, 0.00);

  INSERT INTO invoices (company_id, customer_id, job_id, invoice_number, status, issue_date, due_date, subtotal, tax_rate, tax_amount, total, amount_paid, amount_due)
  VALUES
    (v_company_id, v_customer2_id, v_job7_id, 'INV-2026-004', 'paid', CURRENT_DATE - INTERVAL '35 days', CURRENT_DATE - INTERVAL '5 days', 1800.00, 8.00, 144.00, 1944.00, 1944.00, 0.00);

  -- OUTSTANDING INVOICES (sent, not paid)
  INSERT INTO invoices (company_id, customer_id, job_id, invoice_number, status, issue_date, due_date, subtotal, tax_rate, tax_amount, total, amount_paid, amount_due)
  VALUES
    (v_company_id, v_customer4_id, v_job4_id, 'INV-2026-005', 'sent', CURRENT_DATE - INTERVAL '2 days', CURRENT_DATE + INTERVAL '28 days', 3200.00, 8.00, 256.00, 3456.00, 0.00, 3456.00);

  INSERT INTO invoices (company_id, customer_id, job_id, invoice_number, status, issue_date, due_date, subtotal, tax_rate, tax_amount, total, amount_paid, amount_due)
  VALUES
    (v_company_id, v_customer5_id, v_job5_id, 'INV-2026-006', 'sent', CURRENT_DATE - INTERVAL '1 day', CURRENT_DATE + INTERVAL '29 days', 450.00, 8.00, 36.00, 486.00, 0.00, 486.00);

  -- PARTIAL PAYMENT
  INSERT INTO invoices (company_id, customer_id, job_id, invoice_number, status, issue_date, due_date, subtotal, tax_rate, tax_amount, total, amount_paid, amount_due)
  VALUES
    (v_company_id, v_customer1_id, v_job6_id, 'INV-2026-007', 'partial', CURRENT_DATE - INTERVAL '8 days', CURRENT_DATE + INTERVAL '22 days', 1000.00, 8.00, 80.00, 1080.00, 540.00, 540.00);

  -- OVERDUE INVOICES
  INSERT INTO invoices (company_id, customer_id, invoice_number, status, issue_date, due_date, subtotal, tax_rate, tax_amount, total, amount_paid, amount_due)
  VALUES
    (v_company_id, v_customer3_id, 'INV-2026-008', 'overdue', CURRENT_DATE - INTERVAL '60 days', CURRENT_DATE - INTERVAL '30 days', 750.00, 8.00, 60.00, 810.00, 0.00, 810.00);

  INSERT INTO invoices (company_id, customer_id, invoice_number, status, issue_date, due_date, subtotal, tax_rate, tax_amount, total, amount_paid, amount_due)
  VALUES
    (v_company_id, v_customer4_id, 'INV-2026-009', 'overdue', CURRENT_DATE - INTERVAL '50 days', CURRENT_DATE - INTERVAL '20 days', 1250.00, 8.00, 100.00, 1350.00, 0.00, 1350.00);

  RAISE NOTICE 'Created 9 test invoices';

  -- ============================================
  -- SUMMARY OF TEST DATA
  -- ============================================
  RAISE NOTICE '========================================';
  RAISE NOTICE 'TEST DATA SUMMARY';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Customers: 5';
  RAISE NOTICE 'Jobs: 8 (3 completed, 1 in_progress, 2 scheduled, 1 cancelled, 1 last month)';
  RAISE NOTICE 'Invoices: 9 (4 paid, 2 sent, 1 partial, 2 overdue)';
  RAISE NOTICE '';
  RAISE NOTICE 'EXPECTED REPORT METRICS (This Month):';
  RAISE NOTICE '- Revenue: $4,914.00 (3 paid invoices this month)';
  RAISE NOTICE '- Jobs Completed: 3';
  RAISE NOTICE '- Outstanding Balance: $4,782.00 (all unpaid + partial)';
  RAISE NOTICE '- Overdue Count: 2';
  RAISE NOTICE '';
  RAISE NOTICE 'Top Customer (This Month): Acme Corporation ($1,296)';
  RAISE NOTICE '========================================';

END $$;
