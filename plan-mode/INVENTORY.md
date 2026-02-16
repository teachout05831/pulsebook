# ServicePro - Page & API Inventory

## Dashboard Pages

| Route | File | Status | Notes |
|-------|------|--------|-------|
| `/` | `app/page.tsx` | Working | Redirects to dashboard |
| `/login` | `app/login/page.tsx` | Working | Auth page |
| `/signup` | `app/signup/page.tsx` | Working | Auth page |
| `/dashboard` | `app/(dashboard)/dashboard/page.tsx` | Partial | Customer count broken |
| `/customers` | `app/(dashboard)/customers/page.tsx` | **BROKEN** | Needs DB migration |
| `/customers/new` | `app/(dashboard)/customers/new/page.tsx` | **BROKEN** | Needs DB migration |
| `/customers/[id]` | `app/(dashboard)/customers/[id]/page.tsx` | **BROKEN** | Needs DB migration |
| `/customers/[id]/edit` | `app/(dashboard)/customers/[id]/edit/page.tsx` | **BROKEN** | Needs DB migration |
| `/jobs` | `app/(dashboard)/jobs/page.tsx` | Working | |
| `/jobs/new` | `app/(dashboard)/jobs/new/page.tsx` | Working | |
| `/jobs/[id]` | `app/(dashboard)/jobs/[id]/page.tsx` | Working | |
| `/jobs/dispatch` | `app/(dashboard)/jobs/dispatch/page.tsx` | Working | Recently improved |
| `/jobs/calendar` | `app/(dashboard)/jobs/calendar/page.tsx` | Working | |
| `/estimates` | `app/(dashboard)/estimates/page.tsx` | Working | |
| `/estimates/new` | `app/(dashboard)/estimates/new/page.tsx` | Working | |
| `/estimates/[id]` | `app/(dashboard)/estimates/[id]/page.tsx` | Working | |
| `/invoices` | `app/(dashboard)/invoices/page.tsx` | Working | |
| `/invoices/new` | `app/(dashboard)/invoices/new/page.tsx` | Working | |
| `/invoices/[id]` | `app/(dashboard)/invoices/[id]/page.tsx` | Working | |
| `/reports` | `app/(dashboard)/reports/page.tsx` | Working | |
| `/sales` | `app/(dashboard)/sales/page.tsx` | **BROKEN** | Uses customer status |
| `/settings` | `app/(dashboard)/settings/page.tsx` | Working | |

---

## API Routes

### Customers
| Method | Route | Status | Notes |
|--------|-------|--------|-------|
| GET | `/api/customers` | **BROKEN** | Missing DB columns |
| POST | `/api/customers` | **BROKEN** | Missing DB columns |
| GET | `/api/customers/[id]` | **BROKEN** | Missing DB columns |
| PATCH | `/api/customers/[id]` | **BROKEN** | Missing DB columns |
| DELETE | `/api/customers/[id]` | Working | |

### Jobs
| Method | Route | Status | Notes |
|--------|-------|--------|-------|
| GET | `/api/jobs` | Working | |
| POST | `/api/jobs` | Working | |
| GET | `/api/jobs/[id]` | Working | |
| PATCH | `/api/jobs/[id]` | Working | |
| DELETE | `/api/jobs/[id]` | Working | |

### Dispatch
| Method | Route | Status | Notes |
|--------|-------|--------|-------|
| GET | `/api/dispatch` | Working | Returns jobs + technicians |
| PATCH | `/api/dispatch` | Working | Drag-drop updates |

### Estimates
| Method | Route | Status | Notes |
|--------|-------|--------|-------|
| GET | `/api/estimates` | Working | |
| POST | `/api/estimates` | Working | |
| GET | `/api/estimates/[id]` | Working | |
| PATCH | `/api/estimates/[id]` | Working | |
| DELETE | `/api/estimates/[id]` | Working | |

### Invoices
| Method | Route | Status | Notes |
|--------|-------|--------|-------|
| GET | `/api/invoices` | Working | |
| POST | `/api/invoices` | Working | |
| GET | `/api/invoices/[id]` | Working | |
| PATCH | `/api/invoices/[id]` | Working | |
| DELETE | `/api/invoices/[id]` | Working | |

### Other
| Method | Route | Status | Notes |
|--------|-------|--------|-------|
| GET | `/api/company` | Working | |
| PATCH | `/api/company` | Working | |
| GET | `/api/service-types` | Working | |
| POST | `/api/service-types` | Working | |
| GET | `/api/team-members` | Working | |
| POST | `/api/team-members` | Working | |
| POST | `/api/seed` | Working | Test data generator |

---

## Features Folder

| Feature | Path | Status |
|---------|------|--------|
| Customer Detail | `features/customer-detail/` | Working |
| Leads | `features/leads/` | **Partial** - missing queries folder |
| Reports | `features/reports/` | Working |

---

## Components (Shared)

| Component | Path | Purpose |
|-----------|------|---------|
| UI Components | `components/ui/` | shadcn/ui components |
| Forms | `components/forms/` | Shared form components |
| Layouts | `components/layouts/` | Layout wrappers |
| Dispatch | `components/dispatch/` | Dispatch board (should be feature) |

---

## Database Tables

| Table | Used By | Migration Status |
|-------|---------|------------------|
| users | Auth | ✅ Complete |
| companies | All | ✅ Complete |
| team_members | Jobs, Dispatch | ✅ Complete |
| customers | Customers, Jobs | ⚠️ Needs migration |
| jobs | Jobs, Dispatch | ⚠️ Needs migration |
| estimates | Estimates | ⚠️ Needs migration |
| invoices | Invoices | ⚠️ Needs migration |
| service_types | Jobs, Settings | ✅ Complete |
