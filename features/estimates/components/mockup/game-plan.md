# System Game Plan

## What's Built (Done)

- [x] Estimate detail page (V3 redesign, 3-column layout)
- [x] Service Catalog (`/settings/service-catalog`)
- [x] Materials Catalog (`/settings/materials`)
- [x] Line items on estimates (ServicePicker, MaterialsPicker, CustomLineItem)
- [x] calculateTotals engine (hourly, flat, per_service + tax + deposits)
- [x] Custom fields for customers and jobs
- [x] Tags for customers
- [x] Crew management + dispatch
- [x] Tech portal (mobile)
- [x] Payment slide panel (mockup done — slides from right on estimate + job detail)
- [x] Customer Portal (mockup done — unified customer view)
- [x] Documents slide panel (mockup done — contracts, invoices, work orders)
- [x] Activity slide panel (mockup done — timestamped audit trail)
- [x] Book dropdown on estimate (Preview, Send, Take Payment, Book Job, Mark Lost, Duplicate)
- [x] Job header actions (Documents, Activity, Payments icons + Schedule Job button)

---

## Things Needed

### 1. Auto-Fees System
> Company-defined percentage or fixed fees. Two-level control: settings enables it, estimate/job toggles it per quote.

| Fee | Example Rate | Notes |
|-----|-------------|-------|
| Supply Fee | 10% of total | Materials handling, supplies |
| Trip Fee | % or fixed $ | Travel cost |

**How it works:**
- **Settings** — Toggle ON/OFF, set rate (%), set custom label
- **Per Estimate/Job** — Checkbox to apply or skip for this specific quote
- **Hourly jobs** — Show "10%" label only (total unknown until job complete)
- **Flat/per-service** — Calculate actual dollar amount
- **CC fee** — NOT here. Applied at payment time in the payment panel when customer pays by card.

---

### 2. Line Items on Jobs
> Jobs need the same ServicePicker / MaterialsPicker / CustomLineItem that estimates have.

- Quick-booked jobs need full line item entry (no estimate to inherit from)
- Jobs from estimates inherit line items but can add more (additional services)
- Same picker modals, same pricing breakdown
- Feeds into job financial card + invoicing

---

### 3. Map on Addresses
> Clickable map on the Stops/Addresses card. Context-aware based on number of addresses.

| Scenario | What Shows |
|----------|-----------|
| Single address | Map with one pin (pest control, cleaning, HVAC) |
| Two addresses (to/from) | Map with route line, distance, drive time (moving, delivery) |

- Shows on both estimate detail and job detail
- "Navigate" link opens Google Maps directions
- Distance data could feed into pricing (per-mile charges)

---

### 4. Hourly Rate Display Options
> For hourly pricing, control what the customer sees on the estimate.

| Option | What Customer Sees |
|--------|-------------------|
| Rate only | "$150/hr" — no time estimate, no total |
| Rate + estimated range | "$150/hr, est. 6-8 hours ($900-$1,200)" |
| Fixed total | Exact dollar amount (flat/per-service pricing) |

- Toggle per estimate: "Show estimated hours" ON/OFF
- When OFF, just display the hourly rate
- When ON, show range fields (min hours / max hours)

---

### 5. Payments (Build from Mockup)
> Slide panel from right side. Already mocked up. Needs actual implementation.

- Opens from estimate detail, job detail (icon button + pricing card link)
- Shows: balance due, total vs paid, payment history
- Collect payment: card/cash/check/other
- Send payment link (email/text) for customer self-service
- CC processing fee (2.9%) auto-added when card method selected in payment panel
- Tech portal: separate step-by-step payment flow (not slide panel)

---

### 6. Job Photos
> Photos directly on job detail page. Currently only reachable through customer → jobs tab.

- JobPhotosSection component + useJobFiles hook already exist
- Need to surface on job detail page (center column, Photos tab alongside Notes)
- Tech portal: camera/gallery upload from phone on-site
- Before/during/after photo categories

---

### 7. Customizable Dropdowns
> Companies define their own options instead of using hardcoded lists.

| Dropdown | Currently Hardcoded | Should Be |
|----------|-------------------|-----------|
| Service Types | Local, Long Distance, Commercial, Packing... | Company-defined in settings |
| Sources | Referral, Google Ads, Phone, Walk-in... | Company-defined in settings |
| Lead Statuses | New, Contacted, Qualified, Proposal... | Company-defined in settings |

- DB already stores as plain text — accepts any value
- Just need settings UI + swap hardcoded arrays to read from company settings
- Small change, big impact on multi-industry support

---

### 8. Documents Panel
> Slide panel showing all contracts, estimates, invoices, and work orders for the estimate/job.

- Opens from icon button in estimate and job detail headers
- Documents grouped by estimate and job sections
- Each document shows: name, date, status (Draft/Sent/Signed/Paid)
- "+ Generate Document" button for creating new contracts, invoices, work orders
- Status tracking: Draft → Sent → Signed/Paid
- Ties into Contract Auto-Attachment system (Item 7)

---

### 9. Activity Panel
> Timestamped audit trail of every change to the estimate/job.

- Opens from icon button in estimate and job detail headers
- Logs: creation, edits, sends, approvals, payments, scheduling, dispatch, completion
- Each entry: what happened + when + who did it
- Needs: `activity_log` DB table, automatic event recording on CRUD operations
- User attribution (admin, customer, system)

---

### 10. Book Dropdown & Job Actions
> Replace single action buttons with contextual dropdown menus.

**Estimate — Book dropdown:**
- Preview Estimate (switches to customer page view)
- Send Estimate (email/text to customer)
- Take Payment (opens payment panel)
- Book Job (creates job from estimate)
- Mark Lost
- Duplicate

**Job detail — Header actions:**
- Icon buttons: Documents, Activity, Payments
- Edit button
- Schedule Job button (NOT Dispatch — dispatch happens on dispatch board only)
- No "Dispatch" button on job detail

---

### 11. Job Scheduler + Availability Engine
> Shared scheduling engine that powers both admin booking and customer self-booking. Build once, use everywhere.

**Shared Engine** (`features/scheduling/engine/`):
- `getAvailability(date, companyId)` — returns open time slots based on existing jobs + business hours + team schedules
- `getTimeSlots(date, businessHours)` — generates windows from company business hours settings
- `checkConflicts(techId, date, startTime, duration)` — validates no double-booking

**Admin Scheduler (Option A — Modal):**
- Click "Schedule Job" on estimate/job → modal opens
- Left: mini calendar with availability dots (green/yellow/red)
- Right: time slots for selected day with tech/crew availability
- Pick slot → assign tech → confirm → job scheduled
- "Open Full Calendar" link for complex scheduling

**Full Calendar Page (Option C — Later):**
- `/calendar` — week/day/month views
- Unscheduled jobs sidebar, drag onto time slots
- See all techs/crews and their workload
- Build after modal is proven

**Why shared:** Reps use the admin scheduler daily, refining the availability engine through real bookings. By the time customer-facing online booking goes live (`/s/[token]`), the engine has been battle-tested. Same `getAvailability()` call powers both — admin sees all slots, customer sees filtered windows.

- Connects to existing Online Booking feature (`features/scheduling/`)
- Reuses business hours, team member settings already in scheduling_pages
- No duplicate availability logic

---

### 12. Contract Auto-Attachment (was 11)
> Company defines standard contracts in settings. Contracts auto-attach to new estimates/jobs based on rules.

- Settings: define contract templates with AUTO/MANUAL toggle
- Optionally tie to pricing model (hourly contracts for hourly jobs, flat rate for flat)
- AUTO contracts appear automatically on new estimates/jobs
- Admin can remove any that don't apply, or add manual contracts
- Status flow: Draft → Sent → Signed
- Inherits from estimate to job

---

### 13. Resource Labels & Terminology
> Let companies rename labels so the platform feels like theirs.

- Resource labels: rename Trucks → Vehicles, Team → Techs, etc.
- Terminology: rename Estimates → Quotes, Jobs → Work Orders, Customers → Clients
- Number formats: custom prefixes (Q-2026-001, WO-001, INV-001)
- All stored in company settings JSONB
- Resource label toggles partially exist in estimate settings already

---

### 14. Prepaid Packages
> Companies define package deals. Customer purchases X visits upfront at a discount. Each completed visit auto-deducts.

- Settings: define packages (name, number of visits, total price, discount %)
- Customer purchases package — card charged upfront for full amount
- Package tracker on recurring job: visual dots + progress bar showing used/remaining
- Auto-deduct: when job status = completed, visits_used increments automatically
- Auto-renew toggle: charges card on file when package runs out
- Low-remaining alert (e.g., "2 visits remaining")
- DB: `service_packages` (company-defined), `customer_packages` (purchased instances)
- Billing dropdown on recurring job includes "Prepaid package" option

---

### 15. Customer Account Balance
> Show total amount owed at the top of every customer record. At-a-glance financial snapshot.

- Customer detail header: prominent balance display (red when owing, green when $0)
- Breakdown: unpaid jobs count, open invoices count, lifetime paid total
- Customer list: balance as a sortable/filterable column
- Filter: "Has balance" to quickly find customers who owe money
- Calculated field: sum of unpaid amounts across jobs + invoices (no new DB table)
- Updates automatically when payments are received

---

### 16. Arrival Time Windows
> Company-defined arrival windows. Customer sees "Arrival between 8 AM - 12 PM" instead of exact times.

- Settings: define windows (label, start time, end time) — e.g., "Morning (8 AM - 12 PM)"
- Per estimate/job: dropdown to pick a window
- Customer-facing: shows friendly window text instead of exact scheduling time
- Recurring jobs: window applies to all instances by default
- Tech portal: shows window on schedule view
- DB: `arrival_windows` array in company settings JSONB, jobs/estimates store `arrival_window_id`

---

### 17. Customer Portal (Future)
> Unified customer-facing dashboard. Lower priority — separate build.

- Customer sees: estimates, jobs, invoices, contracts, payments, messages
- Branded with company logo/colors
- Action items: approve estimate, sign contract, pay invoice
- Links from emails/texts land here

---

## Priority Order

| # | Item | Why First |
|---|------|-----------|
| 1 | Customizable Dropdowns | Quick win — makes platform work for any industry |
| 2 | Auto-Fees System | Affects pricing on every estimate and job |
| 3 | Line Items on Jobs | Jobs need full pricing, not just inherited from estimates |
| 4 | Hourly Display Options | Completes the pricing story for hourly businesses |
| 5 | Payments | Revenue collection — the money part |
| 6 | Prepaid Packages | Recurring revenue — purchase upfront, auto-deduct per visit |
| 7 | Book Dropdown & Job Actions | Header UX — replaces Dispatch button, adds dropdown |
| 8 | Job Scheduler + Availability Engine | Shared engine powers admin booking + future customer self-booking. Reps test it daily, refining before customers touch it. |
| 9 | Documents Panel | Shows contracts, invoices, work orders in slide panel |
| 10 | Activity Panel | Audit trail — who did what and when |
| 11 | Customer Account Balance | At-a-glance owed amount on every customer |
| 12 | Job Photos | Surface existing components on job detail |
| 13 | Contract Auto-Attachment | Templates with AUTO/MANUAL toggle |
| 14 | Map on Addresses | Nice-to-have, improves UX |
| 15 | Resource Labels & Terminology | Customizable labels and number formats |
| 16 | Arrival Time Windows | Company-defined windows (8-12, 10-2, 1-5) |
| 17 | Customer Portal | Separate project, bigger scope |
