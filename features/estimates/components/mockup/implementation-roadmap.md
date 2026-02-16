# Implementation Roadmap

> Follows the priority order from game-plan.md. Each phase lists exact files, DB changes, and coding standards compliance.

---

## Dependency Map

```
Phase 1 ─ Customizable Dropdowns        (standalone — no deps)
Phase 2 ─ Auto-Fees System              (extends calculateTotals)
Phase 3 ─ Line Items on Jobs            (requires Job Detail redesign)
Phase 4 ─ Hourly Display Options        (extends estimate pricing)
Phase 5 ─ Payments                      (major — new DB tables + feature)
Phase 6 ─ Prepaid Packages              (depends on Phase 5)
Phase 7 ─ Book Dropdown & Job Actions   (frontend — uses existing hooks)
Phase 8 ─ Documents Panel               (new DB + slide panel)
Phase 9 ─ Activity Panel                (new DB + event logging)
Phase 10 ─ Customer Account Balance     (depends on Phase 5 payment data)
Phase 11 ─ Job Photos                   (wire existing components)
Phase 12 ─ Contract Auto-Attachment     (depends on Phase 8)
Phase 13 ─ Map on Addresses             (standalone — Google Maps)
Phase 14 ─ Resource Labels              (settings JSONB only)
Phase 15 ─ Arrival Time Windows         (settings JSONB only)
Phase 16 ─ Customer Portal              (separate project)
```

---

## Phase 1: Customizable Dropdowns

**Goal:** Replace hardcoded ESTIMATE_SOURCES, SERVICE_TYPES, LEAD_STATUSES with company-defined options stored in settings JSONB.

**Why first:** Quick win. Zero migration. Makes platform work for any industry immediately.

### DB Changes
- **None.** Uses existing `companies.settings` JSONB field.

### Type Changes

**`types/company.ts`** — Add to CompanySettings:
```ts
export interface DropdownOption {
  value: string;
  label: string;
  color?: string;      // optional badge color for lead statuses
  isDefault?: boolean;  // pre-selected on new estimates
}

export interface CustomDropdowns {
  serviceTypes: DropdownOption[];
  sources: DropdownOption[];
  leadStatuses: DropdownOption[];
}

// Add to CompanySettings:
customDropdowns?: CustomDropdowns;
```

### File Plan

| Action | File | Lines |
|--------|------|-------|
| MODIFY | `types/company.ts` | +20 (interfaces + defaults) |
| CREATE | `features/dropdown-settings/types.ts` | ~30 |
| CREATE | `features/dropdown-settings/queries/getDropdownSettings.ts` | ~40 |
| CREATE | `features/dropdown-settings/actions/saveDropdownSettings.ts` | ~50 |
| CREATE | `features/dropdown-settings/hooks/useDropdownSettings.ts` | ~60 |
| CREATE | `features/dropdown-settings/components/DropdownSettingsPage.tsx` | ~120 |
| CREATE | `features/dropdown-settings/components/DropdownListEditor.tsx` | ~100 |
| CREATE | `features/dropdown-settings/index.ts` | ~10 |
| CREATE | `app/(dashboard)/settings/dropdowns/page.tsx` | ~15 |
| CREATE | `app/api/settings/dropdowns/route.ts` | ~50 |
| MODIFY | `features/estimates/components/left/QuoteInfoCard.tsx` | swap 3 arrays → props |
| MODIFY | `features/estimates/hooks/useEstimateDetail.ts` | fetch dropdown settings |
| MODIFY | `components/layouts/SettingsLayout.tsx` | add nav link |

### Data Flow
```
Settings Page → useDropdownSettings hook → PATCH /api/settings/dropdowns → saveDropdownSettings action → companies.settings JSONB

QuoteInfoCard receives options via props (fetched by parent hook)
```

### Standards Compliance
- Query: getUser() → active_company_id → fetch company.settings → return dropdowns
- Action: getUser() → validate input → merge into settings JSONB → save
- Hook: fetch() to API route, not Refine
- Components: receive data via props, no direct API calls
- snake_case↔camelCase: conversion in API route only

---

## Phase 2: Auto-Fees System

**Goal:** Company defines percentage or fixed fees (supply fee, trip fee). Two-level control: settings enables globally, per-estimate checkbox toggles it.

**Why second:** Affects pricing on every estimate. Needs to land before jobs get line items.

### DB Changes
- **Migration:** Add `auto_fees` JSONB column to `estimates` table (array of applied fees per estimate)
- Or: store as special line items with `category: "auto_fee"` (preferred — no migration, reuses existing line_items JSONB)

**Recommended approach:** Auto-fees generate line items with `category: "auto_fee"` and `isAutoFee: true` flag. This way:
- No new DB column needed
- calculateTotals already sums line items
- PricingCard already renders line items by category
- Only need: settings for fee definitions + UI to toggle per estimate

### Type Changes

**`types/company.ts`** — Add to CompanySettings:
```ts
export interface AutoFeeDefinition {
  id: string;
  label: string;           // "Supply Fee", "Trip Fee"
  type: "percentage" | "fixed";
  value: number;           // 10 = 10% or $10
  enabled: boolean;        // global toggle
  appliesTo: "all" | "flat" | "hourly" | "per_service";
}

// Add to CompanySettings:
autoFees?: AutoFeeDefinition[];
```

**`types/estimate.ts`** — Add to EstimateLineItem:
```ts
isAutoFee?: boolean;  // true = generated from company auto-fee settings
autoFeeId?: string;   // links back to AutoFeeDefinition.id
```

### File Plan

| Action | File | Lines |
|--------|------|-------|
| MODIFY | `types/company.ts` | +15 (AutoFeeDefinition interface + defaults) |
| MODIFY | `types/estimate.ts` | +2 (isAutoFee, autoFeeId on line item) |
| CREATE | `features/auto-fees/types.ts` | ~20 |
| CREATE | `features/auto-fees/queries/getAutoFeeSettings.ts` | ~35 |
| CREATE | `features/auto-fees/actions/saveAutoFeeSettings.ts` | ~50 |
| CREATE | `features/auto-fees/hooks/useAutoFees.ts` | ~70 |
| CREATE | `features/auto-fees/components/AutoFeesSettings.tsx` | ~120 |
| CREATE | `features/auto-fees/index.ts` | ~10 |
| MODIFY | `features/estimates/utils/calculateTotals.ts` | +15 (auto-fee line items) |
| MODIFY | `features/estimates/components/right/PricingCard.tsx` | show auto-fee rows with checkbox toggle |
| CREATE | `app/api/settings/auto-fees/route.ts` | ~50 |
| MODIFY | Settings layout | add nav link |

### Key Logic
```
On estimate create/load:
  1. Fetch company autoFees settings
  2. For each enabled fee matching this pricing model:
     - If fee not already in lineItems → auto-add it
     - Show with checkbox (checked = applied, unchecked = skipped)
  3. calculateTotals sums all line items including auto-fees
  4. Hourly estimates: show "10%" label only (no dollar amount until job complete)
```

### Standards Compliance
- Auto-fees stored as line items = no new DB table, no migration
- calculateTotals unchanged (already sums all line items)
- Settings follow same pattern as estimate-builder settings
- No `select('*')`, proper auth, ownership checks

---

## Phase 3: Line Items on Jobs

**Goal:** Jobs get the same ServicePicker / MaterialsPicker / CustomLineItem that estimates have. Jobs from estimates inherit line items. Quick-booked jobs enter line items directly.

**Why third:** Core pricing gap. Jobs need financials for invoicing, payments, and reporting.

### DB Changes
- **Migration:** Add columns to `jobs` table:
  - `line_items` JSONB (array of line items — same shape as estimates)
  - `pricing_model` text (hourly/flat/per_service)
  - `subtotal` numeric
  - `tax_rate` numeric
  - `tax_amount` numeric
  - `total` numeric
  - `deposit_type` text
  - `deposit_amount` numeric
  - `deposit_paid` numeric default 0
  - `resources` JSONB (trucks, team, hours, rate)
  - `source_estimate_id` uuid (FK → estimates, nullable)

### Type Changes

**`types/job.ts`** — Extend Job interface:
```ts
export interface Job {
  // ... existing fields ...
  lineItems: EstimateLineItem[];   // NEW — reuse estimate line item type
  pricingModel: PricingModel;       // NEW
  resources: EstimateResources;     // NEW — reuse estimate resources type
  subtotal: number;                 // NEW
  taxRate: number;                  // NEW
  taxAmount: number;                // NEW
  total: number;                    // NEW
  depositType: DepositType | null;  // NEW
  depositAmount: number | null;     // NEW
  depositPaid: number;              // NEW
  sourceEstimateId: string | null;  // NEW
}
```

### Job Detail Page Redesign

**Current state:** Jobs use a simple form (`JobFormEdit.tsx`). Need to rebuild to match estimate 3-column layout.

**New structure:**
```
features/jobs/components/
├── detail/
│   ├── JobDetailLayout.tsx        (~80 lines)
│   ├── header/
│   │   ├── JobHeader.tsx          (~85 lines)
│   │   └── JobStatusActions.tsx   (~60 lines)
│   ├── left/
│   │   ├── JobInfoCard.tsx        (~120 lines)
│   │   └── JobTasksCard.tsx       (~75 lines)
│   ├── center/
│   │   ├── JobAddressCard.tsx     (~80 lines)
│   │   ├── JobNotesCard.tsx       (~65 lines)
│   │   └── JobPhotosCard.tsx      (~50 lines)
│   └── right/
│       ├── JobResourcesCard.tsx   (~100 lines)
│       ├── JobPricingCard.tsx     (~140 lines)
│       └── JobTypeCard.tsx        (~45 lines)
├── JobForm.tsx                    (create form — keep)
├── CreateJobModal.tsx             (keep)
└── JobsList.tsx                   (keep)
```

### File Plan

| Action | File | Lines |
|--------|------|-------|
| CREATE | `migrations/20250201000030_job_line_items.sql` | ~30 |
| MODIFY | `types/job.ts` | +25 (pricing fields) |
| CREATE | `features/jobs/components/detail/JobDetailLayout.tsx` | ~80 |
| CREATE | `features/jobs/components/detail/header/JobHeader.tsx` | ~85 |
| CREATE | `features/jobs/components/detail/header/JobStatusActions.tsx` | ~60 |
| CREATE | `features/jobs/components/detail/left/JobInfoCard.tsx` | ~120 |
| CREATE | `features/jobs/components/detail/left/JobTasksCard.tsx` | ~75 |
| CREATE | `features/jobs/components/detail/center/JobAddressCard.tsx` | ~80 |
| CREATE | `features/jobs/components/detail/center/JobNotesCard.tsx` | ~65 |
| CREATE | `features/jobs/components/detail/center/JobPhotosCard.tsx` | ~50 |
| CREATE | `features/jobs/components/detail/right/JobResourcesCard.tsx` | ~100 |
| CREATE | `features/jobs/components/detail/right/JobPricingCard.tsx` | ~140 |
| CREATE | `features/jobs/components/detail/right/JobTypeCard.tsx` | ~45 |
| CREATE | `features/jobs/hooks/useJobDetail.ts` | ~90 |
| CREATE | `features/jobs/hooks/useJobPricing.ts` | ~80 |
| CREATE | `features/jobs/queries/getJobDetail.ts` | ~60 |
| MODIFY | `features/jobs/actions/` | update job actions for new fields |
| MODIFY | `app/api/jobs/[id]/route.ts` | handle new fields |
| MODIFY | `app/(dashboard)/jobs/[id]/page.tsx` | render JobDetailLayout |
| SHARE | `features/estimates/utils/calculateTotals.ts` | move to shared location |
| SHARE | `features/estimates/components/ServicePickerModal.tsx` | move to shared |
| SHARE | `features/estimates/components/MaterialPickerModal.tsx` | move to shared |
| SHARE | `features/estimates/components/CustomLineItemModal.tsx` | move to shared |

### Shared Components Strategy
Move picker modals to a shared location:
```
features/line-items/                    (NEW shared feature)
├── components/
│   ├── ServicePickerModal.tsx
│   ├── MaterialPickerModal.tsx
│   └── CustomLineItemModal.tsx
├── utils/
│   └── calculateTotals.ts
├── types.ts                            (EstimateLineItem → LineItem)
└── index.ts
```

Both estimate and job detail pages import from `features/line-items/`.

### Book Job Flow
When "Book Job" is clicked on an estimate:
1. Create job with `source_estimate_id = estimate.id`
2. Copy `line_items`, `pricing_model`, `resources`, `tax_rate` from estimate
3. Copy locations from estimate_locations → job address
4. Link: `estimate.job_id = newJob.id`

---

## Phase 4: Hourly Display Options

**Goal:** Control what customers see for hourly estimates — rate only, rate + estimated range, or fixed total.

### DB Changes
- **None.** Add fields to estimate resources JSONB:
  - `showEstimatedHours: boolean`
  - `minHours: number | null`
  - `maxHours: number | null`

### File Plan

| Action | File | Lines |
|--------|------|-------|
| MODIFY | `types/estimate.ts` | +3 (EstimateResources fields) |
| MODIFY | `features/estimates/components/right/ResourcesCard.tsx` | +20 (min/max hour inputs) |
| MODIFY | `features/estimates/components/right/PricingCard.tsx` | +15 (range display) |
| MODIFY | Customer-facing estimate page | show range or rate only |
| MODIFY | `features/estimate-settings/components/` | toggle for default behavior |

### Display Logic
```
if pricingModel === "hourly":
  if showEstimatedHours && minHours && maxHours:
    → "$150/hr, est. 6-8 hours ($900-$1,200)"
  else:
    → "$150/hr"
else:
  → show exact total
```

---

## Phase 5: Payments

**Goal:** Full payment infrastructure. Slide panel on estimate/job. Collect payments, track history, send payment links.

**Why fifth:** Revenue collection. Everything after this depends on payment data.

### DB Changes
- **Migration:** New tables:

```sql
-- Payment records
CREATE TABLE payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id),
  customer_id uuid NOT NULL REFERENCES customers(id),
  estimate_id uuid REFERENCES estimates(id),
  job_id uuid REFERENCES jobs(id),
  amount numeric NOT NULL,
  method text NOT NULL,          -- 'card', 'cash', 'check', 'other'
  status text NOT NULL DEFAULT 'completed',  -- 'completed', 'pending', 'refunded', 'failed'
  reference_number text,         -- check #, transaction ID, etc.
  cc_fee_amount numeric DEFAULT 0,
  cc_fee_rate numeric DEFAULT 0, -- 2.9
  notes text,
  received_by text,              -- admin name or 'system' or 'customer'
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Payment methods (cards on file)
CREATE TABLE payment_methods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id),
  customer_id uuid NOT NULL REFERENCES customers(id),
  type text NOT NULL,             -- 'card', 'bank_account'
  last_four text NOT NULL,
  brand text,                     -- 'visa', 'mastercard', 'amex'
  exp_month integer,
  exp_year integer,
  is_default boolean DEFAULT false,
  stripe_payment_method_id text,  -- for future Stripe integration
  created_at timestamptz DEFAULT now()
);
```

### Feature Structure
```
features/payments/
├── types.ts                         (~50 lines)
├── queries/
│   ├── getPayments.ts               (~50 lines)
│   └── getPaymentMethods.ts         (~40 lines)
├── actions/
│   ├── recordPayment.ts             (~60 lines)
│   └── refundPayment.ts             (~50 lines)
├── hooks/
│   ├── usePayments.ts               (~80 lines)
│   └── usePaymentPanel.ts           (~70 lines)
├── components/
│   ├── PaymentPanel.tsx             (~140 lines)
│   ├── RecordPaymentForm.tsx        (~120 lines)
│   ├── PaymentHistory.tsx           (~80 lines)
│   ├── PaymentSummary.tsx           (~60 lines)
│   └── SendPaymentLink.tsx          (~80 lines)
├── utils/
│   └── calculateCcFee.ts           (~15 lines)
├── index.ts
```

### API Routes
```
/api/payments                    GET (list), POST (record)
/api/payments/[id]               GET, PATCH (refund)
/api/payments/methods             GET (customer payment methods)
```

### Integration Points
- Estimate detail: PaymentPanel opens from icon button + PricingCard link
- Job detail: PaymentPanel opens from icon button + JobPricingCard link
- Tech portal: Separate step-by-step payment flow (not slide panel)
- CC fee: Auto-calculated at 2.9% when method = 'card', shown as separate line

---

## Phase 6: Prepaid Packages

**Goal:** Companies define packages. Customers buy X visits upfront. Each completed visit auto-deducts.

**Depends on:** Phase 5 (Payments) for payment recording.

### DB Changes
```sql
-- Company-defined package templates
CREATE TABLE service_packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id),
  name text NOT NULL,
  visit_count integer NOT NULL,
  total_price numeric NOT NULL,
  per_visit_price numeric NOT NULL,  -- calculated: total / visits
  discount_percent numeric DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Customer-purchased package instances
CREATE TABLE customer_packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id),
  customer_id uuid NOT NULL REFERENCES customers(id),
  package_id uuid NOT NULL REFERENCES service_packages(id),
  job_id uuid REFERENCES jobs(id),        -- recurring job this is attached to
  visits_total integer NOT NULL,
  visits_used integer NOT NULL DEFAULT 0,
  amount_paid numeric NOT NULL,
  payment_id uuid REFERENCES payments(id),
  auto_renew boolean DEFAULT false,
  status text NOT NULL DEFAULT 'active',   -- 'active', 'completed', 'cancelled'
  purchased_at timestamptz DEFAULT now(),
  completed_at timestamptz
);
```

### Feature Structure
```
features/prepaid-packages/
├── types.ts
├── queries/getPackages.ts, getCustomerPackage.ts
├── actions/createPackage.ts, purchasePackage.ts, deductVisit.ts
├── hooks/usePackages.ts, useCustomerPackage.ts
├── components/
│   ├── PackageSettings.tsx          (admin — define packages)
│   ├── PackageTracker.tsx           (recurring job — visual tracker)
│   ├── PurchasePackageModal.tsx     (customer buys package)
│   └── PackageCard.tsx              (compact card for job detail)
├── index.ts
```

### Auto-Deduct Logic
```
When job.status → 'completed' AND job has active customer_package:
  1. Increment visits_used
  2. If visits_used === visits_total → mark package 'completed'
  3. If auto_renew → create new package + record payment
  4. Log activity
```

---

## Phase 7: Book Dropdown & Job Actions

**Goal:** Estimate gets "Book" dropdown (Preview, Send, Take Payment, Book Job, Mark Lost, Duplicate). Job gets icon buttons + Schedule Job.

### DB Changes
- **None.** Uses existing status fields + actions.

### File Plan

| Action | File | Lines |
|--------|------|-------|
| MODIFY | `features/estimates/components/header/StatusActions.tsx` | rewrite as dropdown |
| MODIFY | `features/estimates/components/header/EstimateHeader.tsx` | icon buttons |
| CREATE | `features/estimates/actions/duplicateEstimate.ts` | ~60 |
| CREATE | `features/estimates/actions/markEstimateLost.ts` | ~40 |
| MODIFY | `features/jobs/components/detail/header/JobHeader.tsx` | icon buttons |
| MODIFY | `features/jobs/components/detail/header/JobStatusActions.tsx` | Schedule button |

### Key Behaviors
- **Preview:** Opens customer-facing estimate page in new tab
- **Send:** Opens send modal (email/text) — future implementation
- **Take Payment:** Opens PaymentPanel slide (from Phase 5)
- **Book Job:** Creates job from estimate (existing flow, enhanced)
- **Mark Lost:** Sets status to 'lost', optional reason field
- **Duplicate:** Copies estimate with new number, status = 'draft'
- **Schedule Job:** Opens Schedule Modal (Phase 8) or navigates to Calendar Page

---

## Phase 8: Job Scheduler + Availability Engine

**Goal:** Shared scheduling engine that powers admin booking (now) and customer self-booking (later). Build the availability brain once — two frontends use it.

**Strategy:** Reps use the admin scheduler daily, providing real-world feedback to refine the engine. By the time customer-facing online booking goes live, the engine is battle-tested through hundreds of real bookings.

### DB Changes
- **None for engine.** Queries existing `jobs` table + `team_members` + company business hours from `scheduling_pages.settings`.
- Reuses existing Online Booking settings (business hours, team member availability).

### Shared Availability Engine

```
features/scheduling/engine/
├── getAvailability.ts              (~70 lines)
│   Input: date, companyId, duration?, teamSize?
│   Logic: fetch jobs for date → fetch team schedules → subtract busy time → return open slots
│   Output: TimeSlot[] with available techs/crews per slot
│
├── getTimeSlots.ts                 (~40 lines)
│   Generates time windows from company business hours
│   Respects arrival time windows (Phase 16)
│
├── checkConflicts.ts               (~35 lines)
│   Validates a specific tech/crew isn't double-booked
│   Called before confirming a booking
│
└── types.ts                        (~30 lines)
    TimeSlot, AvailabilityResult, ScheduleRequest
```

### Admin Scheduler (Option A — Modal)

```
features/scheduling/components/
├── ScheduleModal.tsx               (~140 lines)
│   Mini calendar (left) + time slots (right)
│   Color-coded availability dots on calendar days
│   Tech/crew assignment dropdown
│   "Open Full Calendar" link
│
├── MiniCalendar.tsx                (~100 lines)
│   Month grid with availability indicators
│   Calls getAvailability() for visible month
│
├── TimeSlotPicker.tsx              (~80 lines)
│   Lists available slots for selected day
│   Shows which techs/crews are free per slot
│   Highlights selected slot
│
└── index.ts
```

### Full Calendar Page (Option C — Later Phase)

```
app/(dashboard)/calendar/page.tsx    (~20 lines)
features/scheduling/components/
├── CalendarPage.tsx                 (~140 lines)
│   Week/Day/Month view toggle
│   Time grid with job blocks
│   Unscheduled jobs sidebar
│
├── CalendarGrid.tsx                 (~120 lines)
│   Renders time rows × day columns
│   Existing jobs as colored blocks
│
├── UnscheduledSidebar.tsx           (~80 lines)
│   Jobs without dates, drag onto calendar
│
└── CalendarJobCard.tsx              (~40 lines)
    Compact job card for grid/sidebar
```

### Hooks

| File | Lines | Purpose |
|------|-------|---------|
| `useAvailability.ts` | ~60 | Fetches availability for a date range — shared by admin modal + calendar |
| `useScheduleJob.ts` | ~50 | Confirms booking: assigns tech, sets date/time, creates/updates job |

### API Routes
```
/api/scheduling/availability?date=2026-02-27&duration=180    GET (returns TimeSlot[])
/api/scheduling/book                                          POST (confirm booking)
```

### How It Connects to Online Booking
```
Admin Scheduler Modal          Customer Booking Page (/s/[token])
        │                              │
        └──── both call ──────────────┘
                    │
          getAvailability(date, companyId)
                    │
        ┌───────────┴───────────┐
        │   Same engine, but:   │
        │   Admin: sees ALL     │
        │   Customer: filtered  │
        │   by business rules   │
        └───────────────────────┘
```

### Build Order
1. **Phase 8a:** Availability engine + Schedule Modal (triggered from Book Dropdown)
2. **Phase 8b:** Full Calendar Page at `/calendar` (after modal is proven)
3. **Online Booking Phase 2:** Connect customer-facing `/s/[token]` to same engine

### Standards Compliance
- Engine functions are pure queries — getUser() → company check → return data
- No `select('*')`, proper `.limit()` on job queries
- Hooks use `fetch()` to API routes
- Components receive availability data via props

---

## Phase 9: Documents Panel

**Goal:** Slide panel showing contracts, estimates, invoices, work orders grouped by entity.

### DB Changes
```sql
CREATE TABLE documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id),
  customer_id uuid REFERENCES customers(id),
  estimate_id uuid REFERENCES estimates(id),
  job_id uuid REFERENCES jobs(id),
  type text NOT NULL,               -- 'contract', 'invoice', 'work_order', 'estimate_page'
  name text NOT NULL,
  status text NOT NULL DEFAULT 'draft',  -- 'draft', 'sent', 'signed', 'paid', 'void'
  template_id uuid,                 -- links to contract template if auto-attached
  content jsonb,                    -- document data/content
  sent_at timestamptz,
  signed_at timestamptz,
  public_token text UNIQUE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

### Feature Structure
```
features/documents/
├── types.ts
├── queries/getDocuments.ts
├── actions/createDocument.ts, updateDocumentStatus.ts
├── hooks/useDocuments.ts
├── components/
│   ├── DocumentsPanel.tsx           (slide panel)
│   ├── DocumentRow.tsx              (single doc with status badge)
│   └── GenerateDocumentModal.tsx    (create new doc)
├── index.ts
```

---

## Phase 10: Activity Panel

**Goal:** Timestamped audit trail for every change to estimates and jobs.

### DB Changes
```sql
CREATE TABLE activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id),
  entity_type text NOT NULL,        -- 'estimate', 'job', 'customer', 'payment'
  entity_id uuid NOT NULL,
  action text NOT NULL,             -- 'created', 'updated', 'status_changed', 'payment_received', etc.
  description text NOT NULL,
  metadata jsonb,                   -- changed fields, old/new values
  performed_by uuid,                -- user id
  performed_by_name text,
  performer_type text DEFAULT 'admin',  -- 'admin', 'customer', 'system', 'tech'
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_activity_log_entity ON activity_log(entity_type, entity_id);
```

### Feature Structure
```
features/activity/
├── types.ts
├── queries/getActivityLog.ts
├── actions/logActivity.ts           (called by other actions)
├── hooks/useActivityLog.ts
├── components/
│   ├── ActivityPanel.tsx            (slide panel)
│   ├── ActivityEntry.tsx            (single timeline entry)
│   └── ActivityTimeline.tsx         (vertical timeline)
├── index.ts
```

### Integration
`logActivity()` gets called from:
- Estimate actions (create, update, status change, send)
- Job actions (create, update, status change, complete, dispatch)
- Payment actions (record, refund)
- Document actions (create, send, sign)

---

## Phase 11: Customer Account Balance

**Goal:** Show total owed on every customer record. Filterable on customer list.

### DB Changes
- **None.** Computed from existing data (jobs.total - payments.amount).

### File Plan

| Action | File | Lines |
|--------|------|-------|
| CREATE | `features/customers/queries/getCustomerBalance.ts` | ~50 |
| MODIFY | `features/customer-detail/components/CustomerHeader.tsx` | +20 (balance display) |
| MODIFY | `features/customers/queries/getCustomers.ts` | +10 (balance subquery) |
| MODIFY | `features/customers/components/CustomersList.tsx` | +10 (balance column) |

### Query Logic
```sql
SELECT
  COALESCE(SUM(j.total), 0) as total_billed,
  COALESCE(SUM(p.amount), 0) as total_paid,
  COALESCE(SUM(j.total), 0) - COALESCE(SUM(p.amount), 0) as balance_due
FROM jobs j
LEFT JOIN payments p ON p.customer_id = j.customer_id
WHERE j.customer_id = $1 AND j.company_id = $2
```

---

## Phase 12: Job Photos

**Goal:** Surface existing JobPhotosSection on job detail page.

### DB Changes
- **None.** Components and hooks already exist.

### File Plan

| Action | File | Lines |
|--------|------|-------|
| MODIFY | `features/jobs/components/detail/center/JobPhotosCard.tsx` | wire JobPhotosSection |
| VERIFY | `features/jobs/components/JobPhotosSection.tsx` | already built |
| VERIFY | `features/jobs/hooks/useJobFiles.ts` | already built |

**Smallest phase.** Just import existing components into the new job detail layout (from Phase 3).

---

## Phase 13: Contract Auto-Attachment

**Goal:** Company defines contract templates with AUTO/MANUAL toggle. AUTO contracts attach to new estimates/jobs automatically.

**Depends on:** Phase 8 (Documents infrastructure).

### DB Changes
```sql
CREATE TABLE contract_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id),
  name text NOT NULL,
  content text,                     -- template content/HTML
  attachment_mode text NOT NULL DEFAULT 'manual',  -- 'auto', 'manual'
  applies_to text[] DEFAULT '{}',   -- ['hourly', 'flat', 'per_service'] or empty = all
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

### Logic
```
On estimate/job create:
  1. Fetch active templates where attachment_mode = 'auto'
  2. Filter by applies_to matching pricing_model (or empty = all)
  3. Create document record for each matching template
  4. Admin can remove auto-attached docs or add manual ones
```

---

## Phase 14: Map on Addresses

**Goal:** Clickable map on address cards. Single pin or route line based on number of addresses.

### DB Changes
- **None.** Uses Google Maps Embed API or static maps.

### File Plan

| Action | File | Lines |
|--------|------|-------|
| CREATE | `features/maps/components/AddressMap.tsx` | ~100 |
| CREATE | `features/maps/components/RouteMap.tsx` | ~120 |
| CREATE | `features/maps/hooks/useGoogleMaps.ts` | ~50 |
| MODIFY | `features/estimates/components/center/StopsCard.tsx` | embed map |
| MODIFY | `features/jobs/components/detail/center/JobAddressCard.tsx` | embed map |

### Env Vars
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` — for Maps JavaScript API

---

## Phase 15: Resource Labels & Terminology

**Goal:** Companies rename Trucks → Vehicles, Estimates → Quotes, Customers → Clients, etc.

### DB Changes
- **None.** Uses CompanySettings JSONB.

### Type Changes
```ts
export interface CompanyTerminology {
  estimate: string;       // default: "Estimate"
  job: string;            // default: "Job"
  customer: string;       // default: "Customer"
  invoice: string;        // default: "Invoice"
  estimatePrefix: string; // default: "EST-"
  jobPrefix: string;      // default: "JOB-"
  invoicePrefix: string;  // default: "INV-"
}

// Add to CompanySettings:
terminology?: CompanyTerminology;
```

### Implementation
- Create `useTerminology()` hook that reads from company settings
- All UI labels that say "Estimate", "Job", "Customer" use this hook
- Number format: `${prefix}${year}-${padded_number}`

---

## Phase 16: Arrival Time Windows

**Goal:** Company-defined arrival windows. Selectable on jobs/estimates.

### DB Changes
- **None.** Uses CompanySettings JSONB.

### Type Changes
```ts
export interface ArrivalWindow {
  id: string;
  label: string;            // "Morning"
  startTime: string;        // "08:00"
  endTime: string;          // "12:00"
  isDefault?: boolean;
}

// Add to CompanySettings:
arrivalWindows?: ArrivalWindow[];
```

### File Plan
- Settings UI (add to scheduling or company settings)
- Dropdown on estimate/job forms
- Customer-facing display: "Arrival between 8 AM - 12 PM"
- Tech portal: show window on schedule view

---

## Phase 17: Customer Portal

**Separate project.** Not included in this implementation cycle. Requires:
- Public customer auth flow (magic link or password)
- Branded customer dashboard
- Estimate approval, contract signing, payment collection
- Message thread between customer and company

---

## Implementation Order Summary

| Phase | Item | Migration? | Complexity | Est. Files |
|-------|------|-----------|------------|-----------|
| 1 | Customizable Dropdowns | No | Low | 13 |
| 2 | Auto-Fees System | No* | Medium | 12 |
| 3 | Line Items on Jobs | **Yes** | **High** | 25+ |
| 4 | Hourly Display Options | No | Low | 5 |
| 5 | Payments | **Yes** | **High** | 20+ |
| 6 | Prepaid Packages | **Yes** | Medium | 15 |
| 7 | Book Dropdown & Job Actions | No | Low | 6 |
| 8 | Documents Panel | **Yes** | Medium | 12 |
| 9 | Activity Panel | **Yes** | Medium | 10 |
| 10 | Customer Account Balance | No | Low | 4 |
| 11 | Job Photos | No | **Trivial** | 2 |
| 12 | Contract Auto-Attachment | **Yes** | Medium | 10 |
| 13 | Map on Addresses | No | Medium | 5 |
| 14 | Resource Labels | No | Low | 8 |
| 15 | Arrival Time Windows | No | Low | 5 |
| 16 | Customer Portal | **Yes** | **Very High** | 50+ |

*Phase 2 reuses line items (no migration). Only needs settings JSONB.

### Migrations Required (6 total, not counting Customer Portal)
1. `20250201000030_job_line_items.sql` — Phase 3
2. `20250201000031_payments.sql` — Phase 5
3. `20250201000032_prepaid_packages.sql` — Phase 6
4. `20250201000033_documents.sql` — Phase 8
5. `20250201000034_activity_log.sql` — Phase 9
6. `20250201000035_contract_templates.sql` — Phase 12

---

## Coding Standards Checklist (Every Phase)

- [ ] All files under line limits (Page≤50, Component≤150, Hook≤100, Query≤80, Action≤80)
- [ ] Queries: `getUser()` → `active_company_id` → filter → throw on error
- [ ] Actions: `getUser()` → validate → ownership check → return `{error}` or `{success}`
- [ ] snake_case ↔ camelCase conversion in API routes only
- [ ] Specific field selects + `.limit()` on all queries
- [ ] Ownership check before update/delete
- [ ] Hooks use `fetch()` to API routes, NOT Refine
- [ ] Types defined in feature `types.ts`
- [ ] Public exports in feature `index.ts`
- [ ] Components receive data via props — no direct API calls
