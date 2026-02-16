# Supabase Integration Game Plan

## Current State Analysis

### What Exists
| Component | Status | Location |
|-----------|--------|----------|
| Supabase Client (browser) | Configured, unused | `lib/supabase/client.ts` |
| Supabase Server (SSR) | Configured, unused | `lib/supabase/server.ts` |
| API Routes | 14 endpoints, mock data | `app/api/` |
| Data Provider | Custom Refine provider | `providers/dataProvider.ts` |
| Type Definitions | Complete | `types/` (9 files) |
| Prisma Schema | Incomplete (3 models) | `prisma/schema.prisma` |

### Data Flow (Current)
```
Refine hooks → dataProvider → fetch(/api/*) → Mock data (in-memory)
```

### Data Flow (Target)
```
Refine hooks → dataProvider → fetch(/api/*) → Supabase database
```

---

## Phase 1: Database Setup

### 1.1 Required Tables

| Table | Description | Priority |
|-------|-------------|----------|
| `companies` | Multi-tenant companies | HIGH |
| `users` | Auth users with roles | HIGH |
| `customers` | Customer records | HIGH |
| `jobs` | Service jobs | HIGH |
| `estimates` | Quotes/estimates | HIGH |
| `invoices` | Invoices | HIGH |
| `invoice_payments` | Payment records | HIGH |
| `service_types` | Service catalog | MEDIUM |
| `team_members` | Employees | MEDIUM |
| `customer_notes` | Customer notes | MEDIUM |
| `customer_files` | File attachments | MEDIUM |
| `activities` | Activity log | LOW |

### 1.2 SQL Schema

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Companies (Tenants)
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  website TEXT,
  industry TEXT,
  logo_url TEXT,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users (extends Supabase auth.users)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  role TEXT CHECK (role IN ('admin', 'office', 'technician')) DEFAULT 'office',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Customers
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  notes TEXT,
  status TEXT CHECK (status IN ('active', 'inactive', 'lead')) DEFAULT 'active',
  custom_fields JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Service Types
CREATE TABLE service_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  default_price DECIMAL(10,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Jobs
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')) DEFAULT 'scheduled',
  scheduled_date DATE,
  scheduled_time TIME,
  estimated_duration INTEGER, -- minutes
  address TEXT,
  assigned_to UUID REFERENCES users(id),
  notes TEXT,
  custom_fields JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Estimates
CREATE TABLE estimates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  estimate_number TEXT NOT NULL,
  status TEXT CHECK (status IN ('draft', 'sent', 'approved', 'declined', 'expired')) DEFAULT 'draft',
  issue_date DATE DEFAULT CURRENT_DATE,
  expiry_date DATE,
  line_items JSONB DEFAULT '[]',
  subtotal DECIMAL(10,2) DEFAULT 0,
  tax_rate DECIMAL(5,2) DEFAULT 0,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) DEFAULT 0,
  notes TEXT,
  terms TEXT,
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Invoices
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  job_id UUID REFERENCES jobs(id),
  estimate_id UUID REFERENCES estimates(id),
  invoice_number TEXT NOT NULL,
  status TEXT CHECK (status IN ('draft', 'sent', 'paid', 'partial', 'overdue', 'cancelled')) DEFAULT 'draft',
  issue_date DATE DEFAULT CURRENT_DATE,
  due_date DATE,
  line_items JSONB DEFAULT '[]',
  subtotal DECIMAL(10,2) DEFAULT 0,
  tax_rate DECIMAL(5,2) DEFAULT 0,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) DEFAULT 0,
  amount_paid DECIMAL(10,2) DEFAULT 0,
  amount_due DECIMAL(10,2) DEFAULT 0,
  notes TEXT,
  terms TEXT,
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Invoice Payments
CREATE TABLE invoice_payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  method TEXT CHECK (method IN ('cash', 'check', 'credit_card', 'bank_transfer', 'other')),
  reference TEXT,
  notes TEXT,
  payment_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Team Members (for non-auth users like contractors)
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id), -- Optional link to auth user
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  role TEXT CHECK (role IN ('admin', 'technician', 'office')) DEFAULT 'technician',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Customer Notes
CREATE TABLE customer_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_pinned BOOLEAN DEFAULT false,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Customer Files
CREATE TABLE customer_files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  file_path TEXT NOT NULL, -- Supabase Storage path
  file_type TEXT, -- MIME type
  file_size INTEGER, -- bytes
  category TEXT CHECK (category IN ('photo', 'document', 'contract', 'other')) DEFAULT 'other',
  uploaded_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activity Log
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  job_id UUID REFERENCES jobs(id) ON DELETE SET NULL,
  user_id UUID REFERENCES users(id),
  action TEXT NOT NULL, -- 'created', 'updated', 'deleted', 'status_changed', etc.
  entity_type TEXT NOT NULL, -- 'customer', 'job', 'invoice', etc.
  entity_id UUID,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_customers_company ON customers(company_id);
CREATE INDEX idx_jobs_company ON jobs(company_id);
CREATE INDEX idx_jobs_customer ON jobs(customer_id);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_scheduled_date ON jobs(scheduled_date);
CREATE INDEX idx_estimates_company ON estimates(company_id);
CREATE INDEX idx_estimates_customer ON estimates(customer_id);
CREATE INDEX idx_invoices_company ON invoices(company_id);
CREATE INDEX idx_invoices_customer ON invoices(customer_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_customer_notes_customer ON customer_notes(customer_id);
CREATE INDEX idx_customer_files_customer ON customer_files(customer_id);
CREATE INDEX idx_activities_company ON activities(company_id);
CREATE INDEX idx_activities_customer ON activities(customer_id);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_estimates_updated_at BEFORE UPDATE ON estimates FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_service_types_updated_at BEFORE UPDATE ON service_types FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_team_members_updated_at BEFORE UPDATE ON team_members FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_customer_notes_updated_at BEFORE UPDATE ON customer_notes FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

---

## Phase 2: Row Level Security (RLS)

### 2.1 RLS Policies

```sql
-- Enable RLS on all tables
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE estimates ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Helper function to get user's company_id
CREATE OR REPLACE FUNCTION get_user_company_id()
RETURNS UUID AS $$
  SELECT company_id FROM users WHERE id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER;

-- Companies: Users can only see their own company
CREATE POLICY "Users can view own company" ON companies
  FOR SELECT USING (id = get_user_company_id());

CREATE POLICY "Admins can update own company" ON companies
  FOR UPDATE USING (id = get_user_company_id() AND EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));

-- Users: Users can see teammates
CREATE POLICY "Users can view company users" ON users
  FOR SELECT USING (company_id = get_user_company_id());

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (id = auth.uid());

-- Customers: Company-scoped access
CREATE POLICY "Users can view company customers" ON customers
  FOR SELECT USING (company_id = get_user_company_id());

CREATE POLICY "Users can insert company customers" ON customers
  FOR INSERT WITH CHECK (company_id = get_user_company_id());

CREATE POLICY "Users can update company customers" ON customers
  FOR UPDATE USING (company_id = get_user_company_id());

CREATE POLICY "Admins can delete company customers" ON customers
  FOR DELETE USING (company_id = get_user_company_id() AND EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));

-- Jobs: Company-scoped access
CREATE POLICY "Users can view company jobs" ON jobs
  FOR SELECT USING (company_id = get_user_company_id());

CREATE POLICY "Users can insert company jobs" ON jobs
  FOR INSERT WITH CHECK (company_id = get_user_company_id());

CREATE POLICY "Users can update company jobs" ON jobs
  FOR UPDATE USING (company_id = get_user_company_id());

CREATE POLICY "Users can delete company jobs" ON jobs
  FOR DELETE USING (company_id = get_user_company_id());

-- Estimates: Company-scoped access
CREATE POLICY "Users can view company estimates" ON estimates
  FOR SELECT USING (company_id = get_user_company_id());

CREATE POLICY "Users can insert company estimates" ON estimates
  FOR INSERT WITH CHECK (company_id = get_user_company_id());

CREATE POLICY "Users can update company estimates" ON estimates
  FOR UPDATE USING (company_id = get_user_company_id());

CREATE POLICY "Users can delete company estimates" ON estimates
  FOR DELETE USING (company_id = get_user_company_id());

-- Invoices: Company-scoped access
CREATE POLICY "Users can view company invoices" ON invoices
  FOR SELECT USING (company_id = get_user_company_id());

CREATE POLICY "Users can insert company invoices" ON invoices
  FOR INSERT WITH CHECK (company_id = get_user_company_id());

CREATE POLICY "Users can update company invoices" ON invoices
  FOR UPDATE USING (company_id = get_user_company_id());

CREATE POLICY "Admins can delete invoices" ON invoices
  FOR DELETE USING (company_id = get_user_company_id() AND EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));

-- Invoice Payments: Access via invoice
CREATE POLICY "Users can view invoice payments" ON invoice_payments
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM invoices WHERE id = invoice_payments.invoice_id AND company_id = get_user_company_id()
  ));

CREATE POLICY "Users can insert invoice payments" ON invoice_payments
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM invoices WHERE id = invoice_payments.invoice_id AND company_id = get_user_company_id()
  ));

-- Service Types: Company-scoped
CREATE POLICY "Users can view company service types" ON service_types
  FOR SELECT USING (company_id = get_user_company_id());

CREATE POLICY "Admins can manage service types" ON service_types
  FOR ALL USING (company_id = get_user_company_id() AND EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));

-- Team Members: Company-scoped
CREATE POLICY "Users can view company team members" ON team_members
  FOR SELECT USING (company_id = get_user_company_id());

CREATE POLICY "Admins can manage team members" ON team_members
  FOR ALL USING (company_id = get_user_company_id() AND EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));

-- Customer Notes: Access via customer
CREATE POLICY "Users can view customer notes" ON customer_notes
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM customers WHERE id = customer_notes.customer_id AND company_id = get_user_company_id()
  ));

CREATE POLICY "Users can insert customer notes" ON customer_notes
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM customers WHERE id = customer_notes.customer_id AND company_id = get_user_company_id()
  ));

CREATE POLICY "Users can update own notes" ON customer_notes
  FOR UPDATE USING (created_by = auth.uid());

CREATE POLICY "Users can delete own notes" ON customer_notes
  FOR DELETE USING (created_by = auth.uid());

-- Customer Files: Access via customer
CREATE POLICY "Users can view customer files" ON customer_files
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM customers WHERE id = customer_files.customer_id AND company_id = get_user_company_id()
  ));

CREATE POLICY "Users can upload customer files" ON customer_files
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM customers WHERE id = customer_files.customer_id AND company_id = get_user_company_id()
  ));

CREATE POLICY "Users can delete own files" ON customer_files
  FOR DELETE USING (uploaded_by = auth.uid());

-- Activities: Company-scoped, read-only for most
CREATE POLICY "Users can view company activities" ON activities
  FOR SELECT USING (company_id = get_user_company_id());

CREATE POLICY "System can insert activities" ON activities
  FOR INSERT WITH CHECK (company_id = get_user_company_id());
```

---

## Phase 3: Storage Setup

### 3.1 Storage Buckets

```sql
-- Create storage bucket for customer files
INSERT INTO storage.buckets (id, name, public)
VALUES ('customer-files', 'customer-files', false);

-- Storage policies
CREATE POLICY "Users can view company files" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'customer-files' AND
    (storage.foldername(name))[1] = get_user_company_id()::text
  );

CREATE POLICY "Users can upload company files" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'customer-files' AND
    (storage.foldername(name))[1] = get_user_company_id()::text
  );

CREATE POLICY "Users can delete own files" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'customer-files' AND
    owner = auth.uid()
  );
```

### 3.2 File Path Convention
```
customer-files/{company_id}/{customer_id}/{filename}
```

---

## Phase 4: API Route Migration

### 4.1 Migration Order

| Priority | API Route | Complexity |
|----------|-----------|------------|
| 1 | `/api/customers` | LOW |
| 2 | `/api/customers/[id]` | LOW |
| 3 | `/api/jobs` | MEDIUM |
| 4 | `/api/jobs/[id]` | MEDIUM |
| 5 | `/api/estimates` | MEDIUM |
| 6 | `/api/estimates/[id]` | MEDIUM |
| 7 | `/api/invoices` | MEDIUM |
| 8 | `/api/invoices/[id]` | MEDIUM |
| 9 | `/api/service-types` | LOW |
| 10 | `/api/team-members` | LOW |
| 11 | `/api/dispatch` | HIGH |
| 12 | `/api/company` | LOW |

### 4.2 API Route Template

```typescript
// app/api/customers/route.ts
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();

  // Auth check
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Parse query params
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("_page") || "1");
  const limit = parseInt(searchParams.get("_limit") || "20");
  const sort = searchParams.get("_sort") || "created_at";
  const order = searchParams.get("_order") || "desc";

  // Build query
  let query = supabase
    .from("customers")
    .select("*", { count: "exact" });

  // Apply filters
  const customerId = searchParams.get("customerId");
  if (customerId) {
    query = query.eq("id", customerId);
  }

  // Apply sorting
  query = query.order(sort, { ascending: order === "asc" });

  // Apply pagination
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data, total: count || 0 });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  // Auth check
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get user's company
  const { data: profile } = await supabase
    .from("users")
    .select("company_id")
    .eq("id", user.id)
    .single();

  if (!profile?.company_id) {
    return NextResponse.json({ error: "No company found" }, { status: 400 });
  }

  const body = await request.json();

  // Validation
  if (!body.name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("customers")
    .insert({
      company_id: profile.company_id,
      name: body.name,
      email: body.email || null,
      phone: body.phone || null,
      address: body.address || null,
      notes: body.notes || null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
```

---

## Phase 5: New API Endpoints

### 5.1 Endpoints to Create

| Endpoint | Purpose | Tab |
|----------|---------|-----|
| `GET /api/customers/[id]/notes` | Fetch customer notes | Notes |
| `POST /api/customers/[id]/notes` | Create note | Notes |
| `PATCH /api/notes/[id]` | Update note | Notes |
| `DELETE /api/notes/[id]` | Delete note | Notes |
| `GET /api/customers/[id]/files` | Fetch customer files | Files |
| `POST /api/customers/[id]/files` | Upload file | Files |
| `DELETE /api/files/[id]` | Delete file | Files |
| `GET /api/customers/[id]/activities` | Fetch activity log | Overview |

---

## Phase 6: Authentication

### 6.1 Auth Flow

1. **Sign Up**: Create auth.users entry + users table entry + companies table entry
2. **Sign In**: Standard Supabase auth
3. **Session**: Managed by `@supabase/ssr` middleware

### 6.2 Middleware

```typescript
// middleware.ts
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();

  // Protect dashboard routes
  if (request.nextUrl.pathname.startsWith("/customers") ||
      request.nextUrl.pathname.startsWith("/jobs") ||
      request.nextUrl.pathname.startsWith("/invoices") ||
      request.nextUrl.pathname.startsWith("/estimates")) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
```

---

## Phase 7: Implementation Checklist

### Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key  # For admin operations
```

### Step-by-Step Tasks

- [ ] **Week 1: Database Setup**
  - [ ] Create Supabase project
  - [ ] Run table creation SQL
  - [ ] Run RLS policies SQL
  - [ ] Create storage bucket
  - [ ] Set up storage policies
  - [ ] Add environment variables

- [ ] **Week 2: Core API Migration**
  - [ ] Migrate `/api/customers` to Supabase
  - [ ] Migrate `/api/customers/[id]` to Supabase
  - [ ] Migrate `/api/jobs` to Supabase
  - [ ] Migrate `/api/jobs/[id]` to Supabase
  - [ ] Test CRUD operations

- [ ] **Week 3: Financial APIs**
  - [ ] Migrate `/api/estimates` to Supabase
  - [ ] Migrate `/api/estimates/[id]` to Supabase
  - [ ] Migrate `/api/invoices` to Supabase
  - [ ] Migrate `/api/invoices/[id]` to Supabase
  - [ ] Add payment endpoints

- [ ] **Week 4: Supporting APIs**
  - [ ] Migrate `/api/service-types` to Supabase
  - [ ] Migrate `/api/team-members` to Supabase
  - [ ] Migrate `/api/company` to Supabase
  - [ ] Migrate `/api/dispatch` to Supabase

- [ ] **Week 5: New Endpoints**
  - [ ] Create `/api/customers/[id]/notes` endpoints
  - [ ] Create `/api/customers/[id]/files` endpoints
  - [ ] Create `/api/customers/[id]/activities` endpoint
  - [ ] Set up file upload to Supabase Storage

- [ ] **Week 6: Auth & Polish**
  - [ ] Implement auth middleware
  - [ ] Create sign up flow (with company creation)
  - [ ] Create login page
  - [ ] Add session management
  - [ ] Test RLS policies
  - [ ] Seed demo data

---

## Seed Data SQL

```sql
-- Create demo company
INSERT INTO companies (id, name, email, phone, address, city, state, zip_code)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Demo Company',
  'demo@servicepro.app',
  '555-123-4567',
  '123 Main Street',
  'Springfield',
  'IL',
  '62701'
);

-- Create demo admin user (after auth.users entry exists)
-- INSERT INTO users (id, company_id, name, email, role)
-- VALUES (auth_user_id, '00000000-0000-0000-0000-000000000001', 'Admin User', 'admin@demo.com', 'admin');

-- Create sample customers
INSERT INTO customers (company_id, name, email, phone, address) VALUES
('00000000-0000-0000-0000-000000000001', 'John Smith', 'john@example.com', '555-111-2222', '456 Oak Ave'),
('00000000-0000-0000-0000-000000000001', 'Jane Doe', 'jane@example.com', '555-333-4444', '789 Pine St'),
('00000000-0000-0000-0000-000000000001', 'Bob Wilson', 'bob@example.com', '555-555-6666', '321 Elm Blvd');
```

---

## Quick Reference

### Supabase Client Usage

```typescript
// In Server Components / API Routes
import { createClient } from "@/lib/supabase/server";
const supabase = await createClient();

// In Client Components
import { createClient } from "@/lib/supabase/client";
const supabase = createClient();
```

### Query Patterns

```typescript
// List with pagination
const { data, error, count } = await supabase
  .from("customers")
  .select("*", { count: "exact" })
  .eq("company_id", companyId)
  .order("created_at", { ascending: false })
  .range(0, 19);

// Single record with relations
const { data } = await supabase
  .from("jobs")
  .select(`
    *,
    customer:customers(name, email),
    assigned:users(name)
  `)
  .eq("id", jobId)
  .single();

// Insert with return
const { data, error } = await supabase
  .from("customers")
  .insert({ name, email, company_id: companyId })
  .select()
  .single();

// Update
const { data, error } = await supabase
  .from("customers")
  .update({ name, email })
  .eq("id", customerId)
  .select()
  .single();

// Delete
const { error } = await supabase
  .from("customers")
  .delete()
  .eq("id", customerId);
```

---

## File Changes Summary

| Action | File | Description |
|--------|------|-------------|
| ADD | `.env.local` | Supabase credentials |
| ADD | `middleware.ts` | Auth protection |
| MODIFY | `app/api/customers/route.ts` | Supabase queries |
| MODIFY | `app/api/customers/[id]/route.ts` | Supabase queries |
| MODIFY | `app/api/jobs/route.ts` | Supabase queries |
| MODIFY | `app/api/jobs/[id]/route.ts` | Supabase queries |
| MODIFY | `app/api/estimates/route.ts` | Supabase queries |
| MODIFY | `app/api/estimates/[id]/route.ts` | Supabase queries |
| MODIFY | `app/api/invoices/route.ts` | Supabase queries |
| MODIFY | `app/api/invoices/[id]/route.ts` | Supabase queries |
| MODIFY | `app/api/service-types/route.ts` | Supabase queries |
| MODIFY | `app/api/team-members/route.ts` | Supabase queries |
| MODIFY | `app/api/dispatch/route.ts` | Supabase queries |
| MODIFY | `app/api/company/route.ts` | Supabase queries |
| ADD | `app/api/customers/[id]/notes/route.ts` | New endpoint |
| ADD | `app/api/customers/[id]/files/route.ts` | New endpoint |
| ADD | `app/api/notes/[id]/route.ts` | New endpoint |
| ADD | `app/api/files/[id]/route.ts` | New endpoint |
| DELETE | `app/api/*/data.ts` | Remove mock data files |
